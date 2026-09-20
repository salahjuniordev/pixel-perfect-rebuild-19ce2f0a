-- Admin-manageable Open Graph image (the preview shown when the site URL is
-- shared on WhatsApp, LinkedIn, X, etc.). Falls back to /img/og-preview.png
-- when empty. Recommended upload: 1200x630 (1.91:1), PNG or JPG.
alter table public.site_settings
  add column if not exists og_image_url text;

-- The site_settings table uses column-level grants for anon; make the new
-- column readable so SSR and client metadata code can fetch it.
grant select (og_image_url) on public.site_settings to anon, authenticated;
