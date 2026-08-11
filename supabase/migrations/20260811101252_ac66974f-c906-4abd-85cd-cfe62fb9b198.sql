ALTER VIEW public.public_site_settings SET (security_invoker = true);
DROP VIEW IF EXISTS public.public_site_settings;

CREATE OR REPLACE FUNCTION public.get_public_site_settings()
RETURNS TABLE (
  id uuid,
  brand_name text,
  tagline text,
  hero_title text,
  hero_subtitle text,
  about_text text,
  location text,
  logo_url text,
  favicon_url text,
  resume_url text,
  social_github text,
  social_linkedin text,
  social_twitter text,
  social_instagram text,
  social_facebook text,
  social_youtube text,
  footer_text text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.id, s.brand_name, s.tagline, s.hero_title, s.hero_subtitle, s.about_text,
         s.location, s.logo_url, s.favicon_url, s.resume_url,
         s.social_github, s.social_linkedin, s.social_twitter, s.social_instagram,
         s.social_facebook, s.social_youtube, s.footer_text
  FROM public.site_settings s
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_site_settings() TO anon, authenticated;