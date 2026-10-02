/**
 * Server-safe JSON-LD builders and Open Graph / Twitter Card meta helpers.
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

/** Social profiles (used for Person.sameAs / Organization.sameAs). */
export const SAME_AS = [
  "https://github.com/salahjuniordev",
  "https://www.linkedin.com/in/salah-junior-987684398",
  "https://www.instagram.com/salahjuniordev",
  "https://www.facebook.com/profile.php?id=61586199631543",
];

/**
 * The identity facts that appear in structured data. Route heads pass the
 * admin-managed values resolved from `site_settings` so the JSON-LD can never
 * disagree with the visible site; these constants are the fallback.
 */
export type SiteFacts = {
  brand: string;
  brandFull: string;
  email: string;
  phone: string;
  locality: string;
  country: string;
  sameAs: string[];
};

export const DEFAULT_SITE_FACTS: SiteFacts = {
  brand: BRAND,
  brandFull: BRAND_FULL,
  email: CONTACT_EMAIL,
  phone: CONTACT_PHONE,
  locality: LOCALITY,
  country: COUNTRY,
  sameAs: SAME_AS,
};

/** Build SiteFacts from a resolved settings row (see resolveSiteServer). */
export function siteFactsFromResolved(r: {
  brandName: string;
  email: string;
  phoneDigits: string;
  location: string;
  sameAs: string[];
}): SiteFacts {
  const locality = r.location.split(",")[0]?.trim() || LOCALITY;
  return {
    brand: r.brandName,
    brandFull: r.brandName,
    email: r.email,
    phone: r.phoneDigits ? `+${r.phoneDigits}` : CONTACT_PHONE,
    locality,
    country: COUNTRY,
    sameAs: r.sameAs.length ? r.sameAs : SAME_AS,
  };
}

type Lang = "en" | "fr";

const langTag = (l: Lang) => (l === "fr" ? "fr" : "en");

/* -------------------------------------------------------------------- */
/*  Open Graph (English-first) + canonical / hreflang helpers             */
/* -------------------------------------------------------------------- */

/**
 * The standing OG image: the brand's real 1200×630 preview card
 * (source: public/img/og-preview.png). The admin-uploaded og_image_url
 * (site settings) overrides it at the __root level.
 */
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.png`;
export const OG_IMAGE_ALT = "Salah Junior, Full-Stack Web Developer in Yaoundé, Cameroon";

/** Absolute URL for a site path ("/faq" -> "https://host/faq"). */
export const absUrl = (path: string) =>
  `${SITE_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * The effective OG image: the admin-uploaded one (site_settings.og_image_url)
 * when present, else the bundled default. Accepts absolute or root-relative URLs.
 */
export function ogImage(url?: string | null): string {
  if (!url) return DEFAULT_OG_IMAGE;
  return url.startsWith("http") ? url : `${SITE_ORIGIN}${url}`;
}
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_TYPE = "image/png";

/**
 * Open Graph tags with English as the primary locale (og:title /
 * og:description in English) and French exposed as the alternate locale.
 */
export function ogMeta(opts: {
  titleEn: string;
  descEn: string;
  titleFr: string;
  descFr: string;
  url: string;
  image?: string | null;
  type?: "website" | "article" | "profile";
  siteName?: string;
  imageAlt?: string;
}) {
  const image = opts.image || DEFAULT_OG_IMAGE;
  return [
    { property: "og:site_name", content: opts.siteName ?? BRAND },
    { property: "og:type", content: opts.type ?? "website" },
    { property: "og:url", content: opts.url },
    { property: "og:title", content: opts.titleEn },
    { property: "og:description", content: opts.descEn },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: opts.imageAlt ?? OG_IMAGE_ALT },
    { property: "og:image:width", content: String(OG_IMAGE_WIDTH) },
    { property: "og:image:height", content: String(OG_IMAGE_HEIGHT) },
    { property: "og:image:type", content: OG_IMAGE_TYPE },
    { property: "og:locale", content: "en_US" },
    { property: "og:locale:alternate", content: "fr_FR" },
  ];
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
    { name: "twitter:image:alt", content: OG_IMAGE_ALT },
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
/*  Sitewide: Organization + Person + WebSite + ProfessionalService       */
/*  (single-node builders used by __root.tsx and the static validator)    */
/* -------------------------------------------------------------------- */

export function organizationSchema(lang: Lang, facts: SiteFacts = DEFAULT_SITE_FACTS) {
  const isFr = lang === "fr";
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: "SalahJuniorDev",
    alternateName: facts.brand,
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/logo.png`,
    image: `${SITE_ORIGIN}/og-image.png`,
    email: `mailto:${facts.email}`,
    telephone: facts.phone,
    description: isFr
      ? "Studio indépendant de développement web full-stack, design UI/UX et identité de marque basé à Yaoundé, Cameroun."
      : "Independent studio for full-stack web development, UI/UX design and brand identity based in Yaoundé, Cameroon.",
    address: {
      "@type": "PostalAddress",
      addressLocality: facts.locality,
      addressRegion: "Centre",
      addressCountry: facts.country,
    },
    areaServed: ["CM", "Africa", "Worldwide"],
    founder: { "@type": "Person", name: facts.brandFull, url: SITE_ORIGIN },
    sameAs: facts.sameAs,
    inLanguage: langTag(lang),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: isFr ? "service client" : "customer support",
        email: facts.email,
        telephone: facts.phone,
        availableLanguage: ["English", "French"],
        areaServed: ["CM", "Africa", "Worldwide"],
        contactOption: "TollFree",
      },
      {
        "@type": "ContactPoint",
        contactType: isFr ? "ventes" : "sales",
        email: facts.email,
        telephone: facts.phone,
        availableLanguage: ["English", "French"],
      },
    ],
  };
}

export function personSchema(lang: Lang, facts: SiteFacts = DEFAULT_SITE_FACTS) {
  const isFr = lang === "fr";
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_ORIGIN}/#person`,
    name: facts.brandFull,
    alternateName: facts.brand,
    url: SITE_ORIGIN,
    image: `${SITE_ORIGIN}/hero-portrait.png`,
    jobTitle: isFr
      ? "Développeur Web Full-Stack"
      : "Full-Stack Web Developer",
    description: isFr
      ? "Développeur Web Full-Stack basé à Yaoundé, Cameroun."
      : "Full-Stack Web Developer based in Yaoundé, Cameroon.",
    email: `mailto:${facts.email}`,
    telephone: facts.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: facts.locality,
      addressCountry: facts.country,
    },
    worksFor: { "@id": `${SITE_ORIGIN}/#organization` },
    sameAs: facts.sameAs,
    knowsAbout: [
      "Web development",
      "React",
      "Next.js",
      "Node.js",
      "UI/UX design",
      "SEO",
    ],
    knowsLanguage: ["en", "fr"],
    inLanguage: langTag(lang),
  };
}

export function websiteSchema(lang: Lang, facts: SiteFacts = DEFAULT_SITE_FACTS) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    name: facts.brand,
    url: SITE_ORIGIN,
    inLanguage: ["en", "fr"],
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_ORIGIN}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function professionalServiceSchema(lang: Lang, facts: SiteFacts = DEFAULT_SITE_FACTS) {
  const isFr = lang === "fr";
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_ORIGIN}/#business`,
    name: "Salah Junior Dev",
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/logo.png`,
    image: `${SITE_ORIGIN}/og-image.png`,
    founder: { "@id": `${SITE_ORIGIN}/#person` },
    priceRange: "$149 - $799",
    areaServed: ["Cameroon", "Central Africa"],
    availableLanguage: ["English", "French"],
    address: {
      "@type": "PostalAddress",
      addressLocality: facts.locality,
      addressCountry: facts.country,
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

/* -------------------------------------------------------------------- */
/*  Homepage: one JSON-LD @graph per language                             */
/*  (Person + ProfessionalService + WebSite, linked via @id)              */
/* -------------------------------------------------------------------- */

/**
 * Home page structured data as a single @graph per language so the nodes
 * are explicitly linked (founder → #person, publisher → #organization),
 * exactly as Google recommends for a personal-brand site.
 */
export function homeGraphs(facts: SiteFacts = DEFAULT_SITE_FACTS): unknown[] {
  const langs: Lang[] = ["en", "fr"];
  return langs.map((lang) => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_ORIGIN}/#person`,
        name: facts.brandFull,
        alternateName: facts.brand,
        url: SITE_ORIGIN,
        image: `${SITE_ORIGIN}/hero-portrait.png`,
        jobTitle: lang === "fr" ? "Développeur Web Full-Stack" : "Full-Stack Web Developer",
        email: `mailto:${facts.email}`,
        telephone: facts.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: facts.locality,
          addressCountry: facts.country,
        },
        knowsAbout: [
          "Web development",
          "React",
          "Next.js",
          "Node.js",
          "UI/UX design",
          "SEO",
        ],
        sameAs: facts.sameAs,
        inLanguage: langTag(lang),
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_ORIGIN}/#business`,
        name: "Salah Junior Dev",
        url: SITE_ORIGIN,
        logo: `${SITE_ORIGIN}/logo.png`,
        image: `${SITE_ORIGIN}/og-image.png`,
        founder: { "@id": `${SITE_ORIGIN}/#person` },
        areaServed: ["Cameroon", "Central Africa"],
        availableLanguage: ["English", "French"],
        priceRange: "$149 - $799",
        address: {
          "@type": "PostalAddress",
          addressLocality: facts.locality,
          addressCountry: facts.country,
        },
        inLanguage: langTag(lang),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        name: facts.brand,
        url: SITE_ORIGIN,
        inLanguage: ["en", "fr"],
        publisher: { "@id": `${SITE_ORIGIN}/#organization` },
      },
    ],
  }));
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
/*  Service detail page: Service + HowTo + FAQPage + BreadcrumbList      */
/* -------------------------------------------------------------------- */

export type ServiceSeed = {
  id: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  /** Bullet list shown in the "What's Included" card — becomes HowTo steps. */
  includes?: string[];
  /** Optional FAQ pairs for this service ([en, fr] tuples, like FaqEntry). */
  faqs?: FaqEntry[];
};

export function servicePageSchemas(seed: ServiceSeed, lang: Lang): unknown[] {
  const url = `${SITE_ORIGIN}/services/${seed.id}`;
  const isFr = lang === "fr";
  const out: unknown[] = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}#service-${lang}`,
      name: seed.title,
      description: seed.description || undefined,
      image: seed.image_url || undefined,
      url,
      serviceType: seed.title,
      provider: { "@id": `${SITE_ORIGIN}/#organization` },
      areaServed: ["CM", "Africa", "Worldwide"],
      inLanguage: langTag(lang),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumbs-${lang}`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: isFr ? "Accueil" : "Home", item: SITE_ORIGIN },
        { "@type": "ListItem", position: 2, name: isFr ? "Services" : "Services", item: `${SITE_ORIGIN}/#services` },
        { "@type": "ListItem", position: 3, name: seed.title, item: url },
      ],
    },
  ];

  if (seed.includes && seed.includes.length > 0) {
    out.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "@id": `${url}#howto-${lang}`,
      name: isFr ? `Comment se déroule le service ${seed.title}` : `How the ${seed.title} service works`,
      description: seed.description || undefined,
      inLanguage: langTag(lang),
      step: seed.includes.map((label, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: label,
        text: label,
      })),
    });
  }

  if (seed.faqs && seed.faqs.length > 0) {
    const idx = isFr ? 1 : 0;
    out.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${url}#faq-${lang}`,
      inLanguage: langTag(lang),
      mainEntity: seed.faqs.map((f) => ({
        "@type": "Question",
        name: f.q[idx],
        acceptedAnswer: { "@type": "Answer", text: f.a[idx] },
      })),
    });
  }

  return out;
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
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
      url,
      name: post.title,
      inLanguage: langTag(l),
    },
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
