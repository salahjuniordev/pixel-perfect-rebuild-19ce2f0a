/**
 * Server-safe JSON-LD builders and Twitter Card meta helpers.
 *
 * All builders return plain JSON-serializable objects so they can be
 * embedded via TanStack Router `head().scripts` and emitted in the
 * initial SSR HTML (crawler-friendly on Vercel and Lovable hosting).
 *
 * Bilingual pages emit BOTH English and French JSON-LD in parallel
 * so localized rich results are detected without client hydration.
 */

export const SITE_ORIGIN = "https://salahjuniordev.vercel.app";
export const BRAND = "Salah Junior";
export const BRAND_FULL = "Salah Junior Ncham";
export const CONTACT_EMAIL = "salahjuniorncham@gmail.com";
export const CONTACT_PHONE = "+237683693011";
export const LOCALITY = "Yaoundé";
export const COUNTRY = "CM";
export const SAME_AS = [
  "https://github.com/salahjuniordev",
  "https://www.instagram.com/salahjuniordev",
  "https://www.facebook.com/salahjuniordev",
];

type Lang = "en" | "fr";

const langTag = (l: Lang) => (l === "fr" ? "fr" : "en");

/* -------------------------------------------------------------------- */
/*  Sitewide: Person + ProfessionalService + Organization/ContactPoint  */
/* -------------------------------------------------------------------- */

export function organizationSchema(lang: Lang) {
  const isFr = lang === "fr";
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: "SalahJuniorDev",
    alternateName: BRAND,
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/logo.png`,
    image: `${SITE_ORIGIN}/logo.png`,
    email: `mailto:${CONTACT_EMAIL}`,
    telephone: CONTACT_PHONE,
    description: isFr
      ? "Studio indépendant de développement web full-stack, design UI/UX et identité de marque basé à Yaoundé, Cameroun."
      : "Independent studio for full-stack web development, UI/UX design and brand identity based in Yaoundé, Cameroon.",
    address: {
      "@type": "PostalAddress",
      addressLocality: LOCALITY,
      addressRegion: "Centre",
      addressCountry: COUNTRY,
    },
    areaServed: ["CM", "Africa", "Worldwide"],
    founder: { "@type": "Person", name: BRAND_FULL, url: SITE_ORIGIN },
    sameAs: SAME_AS,
    inLanguage: langTag(lang),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: isFr ? "service client" : "customer support",
        email: CONTACT_EMAIL,
        telephone: CONTACT_PHONE,
        availableLanguage: ["English", "French"],
        areaServed: ["CM", "Africa", "Worldwide"],
        contactOption: "TollFree",
      },
      {
        "@type": "ContactPoint",
        contactType: isFr ? "ventes" : "sales",
        email: CONTACT_EMAIL,
        telephone: CONTACT_PHONE,
        availableLanguage: ["English", "French"],
      },
    ],
  };
}

export function personSchema(lang: Lang) {
  const isFr = lang === "fr";
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_ORIGIN}/#person`,
    name: BRAND_FULL,
    alternateName: BRAND,
    url: SITE_ORIGIN,
    image: `${SITE_ORIGIN}/logo.png`,
    jobTitle: isFr
      ? "Développeur Web Full-Stack & Designer UI/UX"
      : "Full-Stack Web Developer & UI/UX Designer",
    description: isFr
      ? "Développeur Web Full-Stack et Designer UI/UX basé à Yaoundé, Cameroun."
      : "Full-Stack Web Developer and UI/UX Designer based in Yaoundé, Cameroon.",
    email: `mailto:${CONTACT_EMAIL}`,
    telephone: CONTACT_PHONE,
    address: {
      "@type": "PostalAddress",
      addressLocality: LOCALITY,
      addressCountry: COUNTRY,
    },
    worksFor: { "@id": `${SITE_ORIGIN}/#organization` },
    sameAs: SAME_AS,
    knowsAbout: [
      "Web Development",
      "UI/UX Design",
      "Branding",
      "React",
      "TypeScript",
      "Supabase",
      "Figma",
    ],
    knowsLanguage: ["en", "fr"],
    inLanguage: langTag(lang),
  };
}

export function websiteSchema(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    name: `${BRAND} Portfolio`,
    url: SITE_ORIGIN,
    inLanguage: [langTag(lang), langTag(lang === "fr" ? "en" : "fr")],
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_ORIGIN}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function professionalServiceSchema(lang: Lang) {
  const isFr = lang === "fr";
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_ORIGIN}/#service`,
    name: "SalahJuniorDev",
    url: SITE_ORIGIN,
    image: `${SITE_ORIGIN}/logo.png`,
    priceRange: "$$",
    areaServed: ["CM", "Africa", "Worldwide"],
    address: {
      "@type": "PostalAddress",
      addressLocality: LOCALITY,
      addressCountry: COUNTRY,
    },
    description: isFr
      ? "Services de développement web full-stack, design UI/UX, identité de marque et administration bureautique."
      : "Full-stack web development, UI/UX design, branding and office administration services.",
    serviceType: isFr
      ? ["Développement Web", "Design UI/UX", "Identité de Marque", "Design Graphique"]
      : ["Web Development", "UI/UX Design", "Branding", "Graphic Design"],
    provider: { "@id": `${SITE_ORIGIN}/#organization` },
    inLanguage: langTag(lang),
  };
}

/**
 * Home page: emit English + French copies of each schema in one call.
 */
export function homeGraphs(): unknown[] {
  const langs: Lang[] = ["en", "fr"];
  return [
    ...langs.map(personSchema),
    ...langs.map(professionalServiceSchema),
  ];
}

/* -------------------------------------------------------------------- */
/*  FAQ                                                                  */
/* -------------------------------------------------------------------- */

export type FaqEntry = { q: [string, string]; a: [string, string] };

export function faqPageSchema(entries: FaqEntry[], lang: Lang) {
  const idx = lang === "fr" ? 1 : 0;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_ORIGIN}/faq#${lang}`,
    inLanguage: langTag(lang),
    url: `${SITE_ORIGIN}/faq`,
    isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
    mainEntity: entries.map((e) => ({
      "@type": "Question",
      name: e.q[idx],
      acceptedAnswer: { "@type": "Answer", text: e.a[idx] },
    })),
  };
}

/* -------------------------------------------------------------------- */
/*  Legal pages (WebPage + BreadcrumbList)                              */
/* -------------------------------------------------------------------- */

export function legalPageSchemas(opts: {
  path: string;
  titleEn: string;
  titleFr: string;
  descEn: string;
  descFr: string;
}): unknown[] {
  const url = `${SITE_ORIGIN}${opts.path}`;
  const langs: Lang[] = ["en", "fr"];
  return langs.flatMap((l) => {
    const isFr = l === "fr";
    return [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${url}#${l}`,
        name: isFr ? opts.titleFr : opts.titleEn,
        description: isFr ? opts.descFr : opts.descEn,
        url,
        inLanguage: langTag(l),
        isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
        about: { "@id": `${SITE_ORIGIN}/#organization` },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs-${l}`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isFr ? "Accueil" : "Home",
            item: SITE_ORIGIN,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isFr ? opts.titleFr : opts.titleEn,
            item: url,
          },
        ],
      },
    ];
  });
}

/* -------------------------------------------------------------------- */
/*  Blog Article                                                         */
/* -------------------------------------------------------------------- */

export type ArticleSeed = {
  slug: string;
  title: string;
  excerpt?: string | null;
  cover?: string | null;
  tag?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
};

export function articleSchemas(post: ArticleSeed): unknown[] {
  const url = `${SITE_ORIGIN}/blog/${post.slug}`;
  const image = post.cover ? [post.cover] : undefined;
  const langs: Lang[] = ["en", "fr"];
  const article = (l: Lang) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article-${l}`,
    headline: post.title,
    description: post.excerpt || undefined,
    image,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    inLanguage: langTag(l),
    articleSection: post.tag || undefined,
    keywords: post.tag || undefined,
    author: { "@id": `${SITE_ORIGIN}/#person` },
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  });
  const breadcrumb = (l: Lang) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumbs-${l}`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: l === "fr" ? "Accueil" : "Home", item: SITE_ORIGIN },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_ORIGIN}/#blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  });
  return langs.flatMap((l) => [article(l), breadcrumb(l)]);
}

/* -------------------------------------------------------------------- */
/*  Twitter Card meta                                                    */
/* -------------------------------------------------------------------- */

export function twitterMeta(opts: {
  title: string;
  description: string;
  image?: string | null;
  url?: string;
}) {
  const image = opts.image || DEFAULT_OG_IMAGE;
  const meta: Array<Record<string, string>> = [
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: opts.title },
    { name: "twitter:description", content: opts.description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: opts.title },
    { name: "twitter:site", content: "@salahjuniordev" },
    { name: "twitter:creator", content: "@salahjuniordev" },
  ];
  if (opts.url) meta.push({ name: "twitter:url", content: opts.url });
  return meta;
}

/** Encode any JSON-LD object as a TanStack Router head() script entry. */
export function asJsonLdScript(data: unknown) {
  return {
    type: "application/ld+json",
    children: JSON.stringify(data),
  };
}

/* -------------------------------------------------------------------- */
/*  Open Graph (French-first) + canonical / hreflang helpers             */
/* -------------------------------------------------------------------- */

export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/img/og-preview.png`;
export const OG_IMAGE_WIDTH = 851;
export const OG_IMAGE_HEIGHT = 315;
export const OG_IMAGE_TYPE = "image/png";

/** Absolute URL for a site path ("/faq" -> "https://host/faq"). */
export const absUrl = (path: string) =>
  `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Open Graph tags with French as the primary locale (og:title / og:description
 * in French) and English exposed as the alternate locale.
 */
export function ogMeta(opts: {
  titleFr: string;
  descFr: string;
  titleEn?: string;
  descEn?: string;
  url: string;
  image?: string | null;
  type?: "website" | "article" | "profile";
  siteName?: string;
}) {
  const image = opts.image || DEFAULT_OG_IMAGE;
  const meta: Array<Record<string, string>> = [
    { property: "og:site_name", content: opts.siteName ?? BRAND },
    { property: "og:type", content: opts.type ?? "website" },
    { property: "og:url", content: opts.url },
    { property: "og:title", content: opts.titleFr },
    { property: "og:description", content: opts.descFr },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: opts.titleFr },
    { property: "og:image:width", content: String(OG_IMAGE_WIDTH) },
    { property: "og:image:height", content: String(OG_IMAGE_HEIGHT) },
    { property: "og:image:type", content: OG_IMAGE_TYPE },
    { property: "og:locale", content: "fr_FR" },
    { property: "og:locale:alternate", content: "en_US" },
  ];
  return meta;
}

/** canonical + hreflang (fr / en / x-default) link tags for a site path. */
export function altLinks(path: string) {
  const base = absUrl(path);
  const sep = base.includes("?") ? "&" : "?";
  return [
    { rel: "canonical", href: base },
    { rel: "alternate", hrefLang: "fr", href: `${base}${sep}lang=fr` },
    { rel: "alternate", hrefLang: "en", href: `${base}${sep}lang=en` },
    { rel: "alternate", hrefLang: "x-default", href: base },
  ];
}
