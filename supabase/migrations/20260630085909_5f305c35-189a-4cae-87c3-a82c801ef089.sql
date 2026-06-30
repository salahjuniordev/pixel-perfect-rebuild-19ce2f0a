
-- Storage policies for media bucket: admins can write, anyone authenticated can read; we use signed URLs for public display
CREATE POLICY "Admins manage media" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated read media" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'media');

-- Site settings (singleton row)
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name TEXT NOT NULL DEFAULT 'Salah Junior',
  tagline TEXT DEFAULT 'Graphic Designer & Web Developer',
  hero_title TEXT,
  hero_subtitle TEXT,
  about_text TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  whatsapp_number TEXT,
  location TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  resume_url TEXT,
  social_github TEXT,
  social_linkedin TEXT,
  social_twitter TEXT,
  social_instagram TEXT,
  social_facebook TEXT,
  social_youtube TEXT,
  footer_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (brand_name, tagline) VALUES ('Salah Junior', 'Graphic Designer & Web Developer');

-- Activity log
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read activity" ON public.activity_log FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins write activity" ON public.activity_log FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') AND auth.uid() = user_id);

CREATE INDEX activity_log_created_idx ON public.activity_log(created_at DESC);
