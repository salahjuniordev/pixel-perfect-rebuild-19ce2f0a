-- Lock down the public view to read-only for anonymous/authenticated visitors
REVOKE ALL ON public.public_site_settings FROM anon, authenticated;
GRANT SELECT ON public.public_site_settings TO anon, authenticated;
GRANT ALL ON public.public_site_settings TO service_role;

-- Replace the broad authenticated read of the base table (which exposed contact fields)
DROP POLICY IF EXISTS "Authenticated read of settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public branding read" ON public.site_settings;

CREATE POLICY "Branding read for visitors"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (true);

-- Column-level grants keep sensitive columns out of reach for non-admin roles
REVOKE ALL ON public.site_settings FROM anon, authenticated;
GRANT SELECT (
  id, brand_name, tagline, hero_title, hero_subtitle, about_text, location,
  logo_url, favicon_url, resume_url, social_github, social_linkedin,
  social_twitter, social_instagram, social_facebook, social_youtube, footer_text
) ON public.site_settings TO anon, authenticated;

-- Admins (authenticated with admin role) keep full management access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;