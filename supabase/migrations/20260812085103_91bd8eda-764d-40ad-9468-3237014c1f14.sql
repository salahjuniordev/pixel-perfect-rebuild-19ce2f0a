-- Replace the public SECURITY DEFINER settings function with column-level grants + RLS
DROP FUNCTION IF EXISTS public.get_public_site_settings();

CREATE POLICY "Public reads site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);

GRANT SELECT (
  id, brand_name, tagline, hero_title, hero_subtitle, about_text, location,
  logo_url, favicon_url, resume_url, social_github, social_linkedin,
  social_twitter, social_instagram, social_facebook, social_youtube, footer_text
) ON public.site_settings TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;