
-- 1) Move has_role to private schema (not exposed by PostgREST) and update all policies

CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Recreate policies to reference private.has_role
DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins read all posts" ON public.blog_posts;
CREATE POLICY "Admins read all posts" ON public.blog_posts FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins write posts" ON public.blog_posts;
CREATE POLICY "Admins write posts" ON public.blog_posts FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins read all projects" ON public.projects;
CREATE POLICY "Admins read all projects" ON public.projects FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins write projects" ON public.projects;
CREATE POLICY "Admins write projects" ON public.projects FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins read all testimonials" ON public.testimonials;
CREATE POLICY "Admins read all testimonials" ON public.testimonials FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins write testimonials" ON public.testimonials;
CREATE POLICY "Admins write testimonials" ON public.testimonials FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins read all services" ON public.services;
CREATE POLICY "Admins read all services" ON public.services FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins write services" ON public.services;
CREATE POLICY "Admins write services" ON public.services FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins read all pricing" ON public.pricing_tiers;
CREATE POLICY "Admins read all pricing" ON public.pricing_tiers FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins write pricing" ON public.pricing_tiers;
CREATE POLICY "Admins write pricing" ON public.pricing_tiers FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage settings" ON public.site_settings;
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins read activity" ON public.activity_log;
CREATE POLICY "Admins read activity" ON public.activity_log FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'));
DROP POLICY IF EXISTS "Admins write activity" ON public.activity_log;
CREATE POLICY "Admins write activity" ON public.activity_log FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin') AND auth.uid() = user_id);

-- Storage: restrict media read to admins only (was: any authenticated user)
DROP POLICY IF EXISTS "Authenticated read media" ON storage.objects;
DROP POLICY IF EXISTS "Admins manage media" ON storage.objects;
CREATE POLICY "Admins manage media" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'media' AND private.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'media' AND private.has_role(auth.uid(), 'admin'));

-- Drop old public.has_role now that no policy references it
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- 2) site_settings: restrict base table; expose only intended-public columns via a view
DROP POLICY IF EXISTS "Public can read settings" ON public.site_settings;

CREATE OR REPLACE VIEW public.public_site_settings
WITH (security_invoker = true) AS
SELECT
  id, brand_name, tagline, hero_title, hero_subtitle, about_text,
  contact_email, contact_phone, whatsapp_number, location,
  logo_url, favicon_url, resume_url,
  social_github, social_linkedin, social_twitter, social_instagram,
  social_facebook, social_youtube, footer_text
FROM public.site_settings;

-- Allow anon+authenticated to select from the view; base table needs a matching
-- policy for the view (security_invoker) to return rows.
CREATE POLICY "Public view of settings" ON public.site_settings FOR SELECT TO anon, authenticated
  USING (true);

GRANT SELECT ON public.public_site_settings TO anon, authenticated;
