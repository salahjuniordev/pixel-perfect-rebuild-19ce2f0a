
DROP POLICY IF EXISTS "Public view of settings" ON public.site_settings;
REVOKE SELECT ON public.site_settings FROM anon;

DROP VIEW IF EXISTS public.public_site_settings;

CREATE VIEW public.public_site_settings
WITH (security_invoker = true) AS
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

-- Base table needs an authenticated read path so the view (security_invoker) can be
-- queried by logged-in users, in addition to admins managing settings.
CREATE POLICY "Authenticated read of settings"
  ON public.site_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow anon/authenticated to read the sanitized view.
GRANT SELECT ON public.public_site_settings TO anon, authenticated;
