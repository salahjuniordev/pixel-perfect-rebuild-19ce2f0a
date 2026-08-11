DROP POLICY IF EXISTS "Branding read for visitors" ON public.site_settings;

REVOKE SELECT ON public.site_settings FROM anon;

ALTER VIEW public.public_site_settings SET (security_invoker = false);

GRANT SELECT ON public.public_site_settings TO anon, authenticated;