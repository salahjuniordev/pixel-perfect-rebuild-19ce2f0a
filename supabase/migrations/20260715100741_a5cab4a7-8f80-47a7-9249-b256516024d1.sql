
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

-- Restrict anon to only the non-sensitive columns on the base table so the
-- security-invoker view works, and any direct query from anon cannot read
-- contact_email / contact_phone / whatsapp_number.
REVOKE ALL ON public.site_settings FROM anon;
GRANT SELECT (
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
) ON public.site_settings TO anon;

-- Row-level access for anon (column privileges above further restrict which columns).
DROP POLICY IF EXISTS "Public branding read" ON public.site_settings;
CREATE POLICY "Public branding read"
  ON public.site_settings
  FOR SELECT
  TO anon
  USING (true);

GRANT SELECT ON public.public_site_settings TO anon, authenticated;
