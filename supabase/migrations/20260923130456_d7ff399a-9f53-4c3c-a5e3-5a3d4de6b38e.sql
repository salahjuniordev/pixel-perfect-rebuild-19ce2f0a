-- ============================================================
-- Project intake: visitor-submitted project briefs per service
-- ============================================================
--
-- One table for ALL services. Common contact/budget fields live in
-- dedicated columns; service-specific answers live in `answers` jsonb,
-- validated client- and code-side against src/lib/intake-schema.ts
-- (each service kind defines its own extra fields).
--
-- SECURITY MODEL (hardened):
--   1. RLS: anon/authenticated get INSERT only; SELECT/UPDATE/DELETE are
--      admin-only via private.has_role(). Submissions are private.
--   2. Column-level INSERT grants: the public roles can only write the
--      content columns — they CANNOT spoof id, created_at, status,
--      admin_notes (a crafted request can't land as "Won" with notes).
--   3. Size bounds on every public-writable column + answers jsonb,
--      so no multi-megabyte payloads through the anon key.
--   4. Honeypot: bots that fill the hidden field are rejected.
--   5. Rate limiting: max 3 submissions per email per hour, enforced by a
--      SECURITY DEFINER function (it must bypass RLS to count past rows —
--      a plain subquery in the policy would see zero rows for anon).
--      Raises a distinct error so the UI can show a specific message.
--   6. No SELECT feedback for the public: submit-and-blind, so spammers
--      can't enumerate or read anyone's submissions.

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

-- ------------------------------------------------------------------
-- Rate limit: max 3 submissions per email per hour.
-- SECURITY DEFINER so the count sees all rows despite anon having no
-- SELECT policy. Raises a distinct error (P0001 + marker text) so the
-- frontend can show a specific "you already sent one" message.
-- ------------------------------------------------------------------
create or replace function private.intake_rate_limit_ok(p_email text)
returns boolean
language plpgsql
security definer
set search_path = private
stable
as $$
declare
  recent int;
begin
  -- Admins are exempt (dashboard testing shouldn't trip the limiter).
  if private.has_role(auth.uid(), 'admin') then
    return true;
  end if;

  select count(*) into recent
  from public.project_intake
  where lower(email) = lower(p_email)
    and created_at > now() - interval '1 hour';

  if recent >= 3 then
    raise exception 'INTAKE_RATE_LIMITED'
      using errcode = 'P0001',
            hint = 'Try again later or use WhatsApp.';
  end if;

  return true;
end;
$$;

-- ------------------------------------------------------------------
-- RLS policies
-- ------------------------------------------------------------------

-- Public: insert only, with anti-spam + size guards on every public column.
drop policy if exists "project_intake public insert" on public.project_intake;
create policy "project_intake public insert"
  on public.project_intake for insert to anon, authenticated
  with check (
    honeypot = ''
    and char_length(name) between 2 and 120
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and char_length(coalesce(message, '')) <= 5000
    and char_length(coalesce(phone, '')) <= 40
    and char_length(coalesce(service_title, '')) <= 200
    and char_length(coalesce(budget, '')) <= 60
    and char_length(coalesce(deadline, '')) <= 60
    and jsonb_typeof(answers) = 'object'
    and octet_length(answers::text) <= 16384
    and private.intake_rate_limit_ok(email)
  );

-- Admin: everything (read, edit status/notes, delete)
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

-- ------------------------------------------------------------------
-- Column-level privileges (defense in depth on top of RLS)
-- ------------------------------------------------------------------
-- The public roles may insert ONLY the content columns. id, created_at,
-- status and admin_notes are server-controlled. Admin (authenticated +
-- has_role) keeps full UPDATE/DELETE through the admin-only policies.

revoke insert on table public.project_intake from anon, authenticated;
grant insert (name, email, phone, service_id, service_title, budget, deadline, answers, message, honeypot)
  on table public.project_intake to anon, authenticated;

revoke update, delete on table public.project_intake from anon;

create index if not exists project_intake_status_idx
  on public.project_intake (status, created_at desc);