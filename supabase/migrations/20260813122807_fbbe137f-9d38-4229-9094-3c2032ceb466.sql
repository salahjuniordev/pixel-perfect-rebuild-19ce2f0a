ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS slug text;

CREATE OR REPLACE FUNCTION public.unaccent_fallback(_txt text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT translate(_txt, 'àáâãäåçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ', 'aaaaaaceeeeiiiinooooouuuuyyAAAAAACEEEEIIIINOOOOOUUUUY');
$$;

CREATE OR REPLACE FUNCTION public.slugify(_txt text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT trim(both '-' from regexp_replace(lower(public.unaccent_fallback(_txt)), '[^a-z0-9]+', '-', 'g'));
$$;

UPDATE public.projects SET slug = public.slugify(title) WHERE slug IS NULL OR slug = '';

CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_key ON public.projects (slug);

CREATE OR REPLACE FUNCTION public.projects_set_slug()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.slugify(NEW.title);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS projects_set_slug_trg ON public.projects;
CREATE TRIGGER projects_set_slug_trg BEFORE INSERT OR UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.projects_set_slug();