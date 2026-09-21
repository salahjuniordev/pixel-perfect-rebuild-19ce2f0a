-- ─────────────────────────────────────────────────────────────────────────────
-- Design gallery: a scrolling showcase strip on the homepage.
-- Admin uploads images, tags each as 'big' or 'small' (the frontend arranges
-- them in staggered rows with varied card sizes), and orders/publishes them.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt text default '',
  caption text,
  size text not null default 'small' check (size in ('big', 'small')),
  link_url text,
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.gallery_items enable row level security;

drop policy if exists "gallery public read" on public.gallery_items;
create policy "gallery public read"
  on public.gallery_items for select
  using (published = true);

-- Admin-only writes from day one (private.has_role pattern — no repeat of the
-- ebooks RLS mistake).
drop policy if exists "gallery admin write" on public.gallery_items;
create policy "gallery admin write"
  on public.gallery_items for all
  using (private.has_role(auth.uid(), 'admin'))
  with check (private.has_role(auth.uid(), 'admin'));

create index if not exists gallery_items_order_idx
  on public.gallery_items (order_index) where published = true;