-- ============================================================
-- Project intake: visitor-submitted project briefs per service
-- ============================================================
--
-- One table for ALL services. Common contact/budget fields live in
-- dedicated columns; service-specific answers live in `answers` jsonb,
-- validated client- and code-side against src/lib/intake-schema.ts
-- (each service kind defines its own extra fields).
--
-- RLS model:
--   - anon: INSERT only (public intake form), with lightweight guards
--     (honeypot must be empty, message length bounded) to blunt spam bots.
--   - admin (private.has_role): full read + update (status/notes) + delete.
--   - No anon SELECT/UPDATE/DELETE — submissions are private.

create table if not exists public.project_intake (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Who's asking
  name text not null,
  email text not null,
  phone text,

  -- What they're asking about
  service_id uuid references public.services(id) on delete set null,
  service_title text not null default '',
  budget text,
  deadline text,

  -- Service-specific answers (shape defined by intake-schema.ts)
  answers jsonb not null default '{}'::jsonb,

  -- Free-form brief / additional notes from the client
  message text not null default '' check (char_length(message) <= 5000),

  -- Honeypot: real users never fill this (bots do). INSERT is rejected when set.
  honeypot text not null default '',

  -- Admin pipeline
  status text not null default 'new' check (status in ('new','in_review','quoted','won','archived')),
  admin_notes text not null default ''
);

alter table public.project_intake enable row level security;

-- Public: can only submit (no reading back the table, no editing rows)
drop policy if exists "project_intake public insert" on public.project_intake;
create policy "project_intake public insert"
  on public.project_intake for insert to anon, authenticated
  with check (
    honeypot = ''
    and char_length(name) between 2 and 120
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and char_length(coalesce(message, '')) <= 5000
  );

-- Admin: everything
drop policy if exists "project_intake admin read" on public.project_intake;
create policy "project_intake admin read"
  on public.project_intake for select
  using (private.has_role(auth.uid(), 'admin'));

drop policy if exists "project_intake admin update" on public.project_intake;
create policy "project_intake admin update"
  on public.project_intake for update
  using (private.has_role(auth.uid(), 'admin'))
  with check (private.has_role(auth.uid(), 'admin'));

drop policy if exists "project_intake admin delete" on public.project_intake;
create policy "project_intake admin delete"
  on public.project_intake for delete
  using (private.has_role(auth.uid(), 'admin'));

create index if not exists project_intake_status_idx
  on public.project_intake (status, created_at desc);
