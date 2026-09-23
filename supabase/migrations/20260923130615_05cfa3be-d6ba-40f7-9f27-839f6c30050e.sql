-- ============================================================
-- Email replies: messages the admin sends to clients from the
-- Project Requests dashboard (via Resend).
-- ============================================================
--
-- One row per sent reply, linked to its intake submission. Gives the
-- admin a full conversation history next to each project brief.
--
-- RLS: admin-only. Clients never read these — they receive emails.

create table if not exists public.email_replies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  intake_id uuid not null references public.project_intake(id) on delete cascade,
  to_email text not null,
  subject text not null,
  body text not null check (char_length(body) <= 20000),
  status text not null default 'sent' check (status in ('sent','failed'))
);

alter table public.email_replies enable row level security;

drop policy if exists "email_replies admin read" on public.email_replies;
create policy "email_replies admin read"
  on public.email_replies for select
  using (private.has_role(auth.uid(), 'admin'));

drop policy if exists "email_replies admin insert" on public.email_replies;
create policy "email_replies admin insert"
  on public.email_replies for insert
  with check (private.has_role(auth.uid(), 'admin'));

create index if not exists email_replies_intake_idx
  on public.email_replies (intake_id, created_at desc);