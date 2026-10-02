-- Free, email-gated ebook downloads (lead magnets).
-- Every gate submission is recorded here regardless of newsletter consent;
-- newsletter_subscribers only receives the ones that ticked the opt-in box.
create table if not exists public.ebook_downloads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  ebook_id uuid,
  ebook_title text,
  opt_in boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.ebook_downloads enable row level security;

-- Anyone may submit the gate form; nobody may read the list publicly.
drop policy if exists "ebook_downloads public insert" on public.ebook_downloads;
create policy "ebook_downloads public insert"
  on public.ebook_downloads for insert
  to anon, authenticated
  with check (true);

drop policy if exists "ebook_downloads admin read" on public.ebook_downloads;
create policy "ebook_downloads admin read"
  on public.ebook_downloads for select
  to authenticated
  using (auth.role() = 'authenticated');

drop policy if exists "ebook_downloads admin manage" on public.ebook_downloads;
create policy "ebook_downloads admin manage"
  on public.ebook_downloads for all
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create index if not exists ebook_downloads_created_idx
  on public.ebook_downloads (created_at desc);
create index if not exists ebook_downloads_email_idx
  on public.ebook_downloads (email);
create index if not exists ebook_downloads_ebook_idx
  on public.ebook_downloads (ebook_id);