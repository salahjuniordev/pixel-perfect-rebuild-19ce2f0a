-- ─────────────────────────────────────────────────────────────────────────────
-- Security hardening: admin-only write policies
--
-- Problem: several tables created with `auth.role() = 'authenticated'` write
-- policies let ANY signed-up user (not just admins) insert/update/delete
-- content that then appears on the public site. A spammer who created a free
-- Supabase account could inject rows into `ebooks` (25 bogus books), hide
-- testimonials, delete subscribers, etc.
--
-- Fix: reuse the existing private.has_role() admin check for every content
-- table. Public read policies (published = true) stay unchanged.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1) Ebooks — the table that was abused (any authenticated user could insert)
drop policy if exists "ebooks admin write" on public.ebooks;
create policy "ebooks admin write"
  on public.ebooks for all
  using (private.has_role(auth.uid(), 'admin'))
  with check (private.has_role(auth.uid(), 'admin'));

-- 2) Newsletter subscribers — read/delete were open to any authenticated user
drop policy if exists "newsletter admin read" on public.newsletter_subscribers;
create policy "newsletter admin read"
  on public.newsletter_subscribers for select
  using (private.has_role(auth.uid(), 'admin'));

drop policy if exists "newsletter admin delete" on public.newsletter_subscribers;
create policy "newsletter admin delete"
  on public.newsletter_subscribers for delete
  using (private.has_role(auth.uid(), 'admin'));

-- 4) Hero images — same weak `auth.role() = 'authenticated'` write policy
--    from 20260913000000_create_hero_images.sql; any signed-up user could
--    replace the homepage hero.
drop policy if exists "hero_images admin write" on public.hero_images;
create policy "hero_images admin write"
  on public.hero_images for all
  using (private.has_role(auth.uid(), 'admin'))
  with check (private.has_role(auth.uid(), 'admin'));

-- 3) Content tables — belt-and-suspenders: replace the generic
--    authenticated-user policies (from 20260714013828) with admin-only ones,
--    so a rogue signup can never mutate public site content.
do $$
declare
  t text;
begin
  foreach t in array array['blog_posts', 'projects', 'testimonials', 'services', 'pricing_tiers']
  loop
    execute format('drop policy if exists "Admins read all %1$s" on public.%1$I', t);
    execute format(
      'create policy "Admins read all %1$s" on public.%1$I for select to authenticated
       using (private.has_role(auth.uid(), ''admin''))', t);
    execute format('drop policy if exists "Admins write %1$s" on public.%1$I', t);
    execute format(
      'create policy "Admins write %1$s" on public.%1$I for all to authenticated
       using (private.has_role(auth.uid(), ''admin''))
       with check (private.has_role(auth.uid(), ''admin''))', t);
  end loop;
end $$;
