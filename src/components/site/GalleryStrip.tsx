import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";
import { optimizedImage } from "@/lib/img";

type GalleryItem = {
  id: string;
  url: string;
  alt: string | null;
  caption: string | null;
  size: "big" | "small";
  link_url: string | null;
};

/**
 * Design gallery: two auto-scrolling rows.
 * Row 1 drifts left, row 2 drifts right (track content duplicated for a
 * seamless loop). Cards alternate between big and small sizes for rhythm.
 * Pauses on hover; static grid when the user prefers reduced motion.
 */
export function GalleryStrip() {
  const { t } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ((supabase as any).from("gallery_items") as any)
      .select("id,url,alt,caption,size,link_url")
      .eq("published", true)
      .order("order_index", { ascending: true })
      .then(({ data }: { data: unknown }) => {
        setItems((data as GalleryItem[]) ?? []);
        setLoaded(true);
      });
  }, []);

  // Don't render the section until we know there's content (mirrors Ebooks).
  if (!loaded || items.length < 3) return null;

  // Interleave big/small so sizes alternate; keep DB order intact otherwise.
  const bigs = items.filter((i) => i.size === "big");
  const smalls = items.filter((i) => i.size === "small");
  const rowA: GalleryItem[] = [];
  const rowB: GalleryItem[] = [];
  const pool = [...items];
  let useBigFirst = true;
  while (pool.length) {
    const pick = pool.shift()!;
    (useBigFirst ? rowA : rowB).push(pick);
    // Alternate within each row using the tagged sizes as a guide.
    useBigFirst = pick.size === "small" ? true : !useBigFirst;
  }
  // If one row ended up empty (e.g. all same size), split evenly.
  const rows = rowA.length && rowB.length
    ? [rowA, rowB]
    : [items.slice(0, Math.ceil(items.length / 2)), items.slice(Math.ceil(items.length / 2))];

  const card = (item: GalleryItem, big: boolean) => {
    const img = (
      <img
        src={optimizedImage(item.url, big ? 1000 : 600)}
        alt={item.alt || item.caption || "Gallery image"}
        width={big ? 1000 : 600}
        height={big ? 750 : 450}
        loading="lazy"
        decoding="async"
      />
    );
    return item.link_url ? (
      <a href={item.link_url} target="_blank" rel="noreferrer" className={`g-card ${big ? "g-card-big" : "g-card-small"}`}>
        {img}
        {item.caption && <span className="g-caption">{item.caption}</span>}
      </a>
    ) : (
      <div className={`g-card ${big ? "g-card-big" : "g-card-small"}`}>
        {img}
        {item.caption && <span className="g-caption">{item.caption}</span>}
      </div>
    );
  };

  return (
    <section id="gallery" className="gallery-section" aria-label={t("Design gallery", "Galerie de designs")}>
      <div className="container-sj">
        <div className="services-head">
          <h2 className="services-title">{t("Design Gallery", "Galerie de Designs")}</h2>
          <div className="services-underline">
            <span />
            <i className="dot" />
            <i className="dot" />
            <span />
          </div>
          <p className="gallery-sub">
            {t(
              "Visual work in motion — posters, branding and designs I've crafted.",
              "Des travaux visuels en mouvement — affiches, branding et designs que j'ai créés.",
            )}
          </p>
        </div>
      </div>

      <div className="gallery-strip">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className={`g-row ${rowIdx === 1 ? "g-row-reverse" : ""}`}>
            {/* Track duplicated once: translateX(-50%) loops seamlessly. */}
            <div className={`g-track ${rowIdx === 1 ? "g-track-reverse" : ""}`}>
              {[...row, ...row].map((item, i) => card(item, item.size === "big" || i % 3 === 0))}
            </div>
          </div>
        ))}
        {/* Edge fades */}
        <div className="g-fade g-fade-left" aria-hidden="true" />
        <div className="g-fade g-fade-right" aria-hidden="true" />
      </div>
    </section>
  );
}
