/**
 * URL-safe slug from arbitrary text ("É-commerce & SEO!" -> "e-commerce-seo").
 * Mirrors the SQL slugify() used by existing migrations.
 */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Normalizes an admin-entered blog slug: strips full URLs, leading
 * "/blog/" paths and trailing slashes so only the identifier remains.
 */
export function cleanSlug(raw: string): string {
  return raw
    .trim()
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\/+(blog\/)?/i, "")
    .replace(/\/+$/, "");
}
