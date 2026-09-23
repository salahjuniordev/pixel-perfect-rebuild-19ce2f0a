-- 1. site_settings: replace the "everyone sees every row" read rule with a scoped one
CREATE OR REPLACE FUNCTION private.public_site_settings_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.id FROM public.site_settings s ORDER BY s.created_at ASC LIMIT 1
$$;

REVOKE ALL ON FUNCTION private.public_site_settings_id() FROM public;
GRANT EXECUTE ON FUNCTION private.public_site_settings_id() TO anon, authenticated;

DROP POLICY IF EXISTS "Public reads site settings" ON public.site_settings;
CREATE POLICY "Public reads site settings"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (id = private.public_site_settings_id());

-- 2. ebooks: remove blanket authenticated write access (admin policy already exists)
DROP POLICY IF EXISTS "Authenticated manage ebooks" ON public.ebooks;

-- 3. hero_images: same
DROP POLICY IF EXISTS "Authenticated manage hero images" ON public.hero_images;

-- 4. newsletter_subscribers: remove blanket authenticated read/delete (admin policies already exist)
DROP POLICY IF EXISTS "Authenticated read subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated delete subscribers" ON public.newsletter_subscribers;

-- keep public subscribe, but validate instead of accepting anything
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe"
ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(email) <= 254
  AND source IN ('landing', 'blog', 'footer', 'ebooks')
);