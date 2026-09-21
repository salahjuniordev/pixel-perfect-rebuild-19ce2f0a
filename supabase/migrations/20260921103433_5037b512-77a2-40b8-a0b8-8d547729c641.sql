-- ─────────────────────────────────────────────────────────────────────────────
-- Project categories + portfolio showcase upgrade
--
-- 1) project_categories: dashboard-managed tabs for the portfolio filter.
--    `has_link` tells the admin form whether projects in this category are
--    websites (link_url + live preview) or visual work (image gallery only).
--    Seeded with Salah's four requested tabs; more can be added in the admin.
-- 2) projects: new columns for richer cards and design-type work:
--      gallery     — jsonb array of { url, alt } image objects (design work)
--      featured    — big card placement on the homepage grid
--      client      — client name (who it was for)
--      year        — completion year
--      tags        — free-form tech/skill list, shown as chips
--      cover_alt   — accessible alt text for the cover image (SEO + a11y)
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Category tabs (admin-managed)
create table if not exists public.project_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  has_link boolean not null default true, -- true: web projects w/ links; false: visual work
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.project_categories enable row level security;

drop policy if exists "project_categories public read" on public.project_categories;
create policy "project_categories public read"
  on public.project_categories for select
  using (published = true);

drop policy if exists "project_categories admin write" on public.project_categories;
create policy "project_categories admin write"
  on public.project_categories for all
  using (private.has_role(auth.uid(), 'admin'))
  with check (private.has_role(auth.uid(), 'admin'));

-- Default tabs (slug must match what the admin form generates)
insert into public.project_categories (name, slug, has_link, order_index) values
  ('Web Development', 'web-development', true, 1),
  ('Graphic Design', 'graphic-design', false, 2),
  ('Identity Branding', 'identity-branding', false, 3),
  ('SEO', 'seo', false, 4)
on conflict (name) do nothing;

-- 2) Project showcase columns
alter table public.projects
  add column if not exists gallery jsonb not null default '[]'::jsonb,
  add column if not exists featured boolean not null default false,
  add column if not exists client text,
  add column if not exists year text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists cover_alt text;

-- Index for the published+ordered listing
create index if not exists projects_published_order_idx
  on public.projects (order_index) where published = true;

-- 3) Backfill: link existing project slugs for the detail pages
update public.projects
set slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'))
where slug is null or slug = '';