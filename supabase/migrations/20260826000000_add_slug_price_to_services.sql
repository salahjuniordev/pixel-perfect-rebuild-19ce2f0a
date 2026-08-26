-- Add slug (for clean URLs) and price (for card display) to services
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS price text;

-- Auto-generate slugs from existing service titles
UPDATE public.services
SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;
