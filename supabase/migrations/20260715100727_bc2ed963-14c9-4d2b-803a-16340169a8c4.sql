
DROP VIEW IF EXISTS public.public_site_settings;

-- security_invoker = false (default): the view runs with owner privileges,
-- so anon does NOT need SELECT on public.site_settings.
CREATE VIEW public.public_site_settings AS
SELECT
  id,
  brand_name,
  tagline,
  hero_title,
  hero_subtitle,
  about_text,
  location,
  logo_url,
  favicon_url,
  resume_url,
  social_github,
  social_linkedin,
  social_twitter,
  social_instagram,
  social_facebook,
  social_youtube,
  footer_text
FROM public.site_settings;

GRANT SELECT ON public.public_site_settings TO anon, authenticated;
