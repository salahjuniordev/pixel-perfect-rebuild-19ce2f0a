/**
 * Image URL helpers.
 *
 * Remote assets (Cloudinary / Supabase Storage) are served at their original,
 * often multi-megabyte size. These helpers request a resized, auto-format
 * (WebP/AVIF) variant so mobile devices don't download 2 MB PNGs.
 */

/** Insert Cloudinary delivery transformations into an upload URL. */
export function optimizedImage(src?: string | null, width = 800): string {
  if (!src) return "";
  if (src.includes("res.cloudinary.com") && src.includes("/upload/")) {
    // Skip if transformations are already present right after /upload/.
    const [head, tail] = src.split("/upload/");
    if (/^(f_|q_|w_|c_|dpr_)/.test(tail)) return src;
    return `${head}/upload/f_auto,q_auto,c_limit,w_${width}/${tail}`;
  }
  if (src.includes("/storage/v1/object/public/")) {
    // Supabase image transformation endpoint.
    const url = src.replace("/object/public/", "/render/image/public/");
    return `${url}${url.includes("?") ? "&" : "?"}width=${width}&quality=75&resize=contain`;
  }
  return src;
}

/** Common attributes for non-critical images. */
export const lazyImgProps = {
  loading: "lazy" as const,
  decoding: "async" as const,
};
