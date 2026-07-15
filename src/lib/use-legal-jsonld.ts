import { useJsonLd } from "./use-jsonld";
import { useLanguage } from "./language";

/**
 * JSON-LD for a legal/policy page. Emits WebPage (CreativeWork subtype)
 * with license, in-language, plus a BreadcrumbList back to home.
 */
export function useLegalJsonLd(opts: {
  id: string;
  path: string;
  titleEn: string;
  titleFr: string;
  descEn: string;
  descFr: string;
}) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://faithful-update.lovable.app";
  const url = `${origin}${opts.path}`;
  useJsonLd(opts.id, [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: isFr ? opts.titleFr : opts.titleEn,
      description: isFr ? opts.descFr : opts.descEn,
      url,
      inLanguage: isFr ? "fr" : "en",
      isPartOf: { "@type": "WebSite", name: "Salah Junior Portfolio", url: origin },
      publisher: {
        "@type": "Person",
        name: "Salah Junior Ncham",
        url: origin,
        logo: { "@type": "ImageObject", url: `${origin}/logo.png` },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: isFr ? "Accueil" : "Home", item: origin },
        { "@type": "ListItem", position: 2, name: isFr ? opts.titleFr : opts.titleEn, item: url },
      ],
    },
  ]);
}
