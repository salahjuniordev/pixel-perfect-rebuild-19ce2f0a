#!/usr/bin/env node
/**
 * Validates JSON-LD blocks embedded in the app.
 *
 * Two modes:
 *  1. Static: parses `src/lib/seo-schemas.ts` builders by importing them
 *     and running against a fixture set.
 *  2. Live: crawls a base URL (defaults to http://localhost:8080) and
 *     extracts every <script type="application/ld+json"> from key pages,
 *     validates required fields per @type.
 *
 * Exit codes:
 *  0 — all schemas valid
 *  1 — one or more errors
 *
 * Usage:
 *   node scripts/validate-jsonld.mjs                 # live crawl
 *   node scripts/validate-jsonld.mjs --static        # static builders only
 *   BASE_URL=https://example.com node scripts/validate-jsonld.mjs
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:8080";
const STATIC_ONLY = process.argv.includes("--static");

const PAGES = [
  "/",
  "/faq",
  "/terms-conditions",
  "/refund-policy",
  "/license-copyright",
];

/** Minimum required fields per schema.org @type. */
const RULES = {
  Person: ["name", "url"],
  Organization: ["name", "url", "contactPoint"],
  WebSite: ["name", "url"],
  ProfessionalService: ["name", "url", "address"],
  FAQPage: ["mainEntity"],
  Article: ["headline", "author", "publisher", "mainEntityOfPage"],
  WebPage: ["name", "url", "inLanguage"],
  BreadcrumbList: ["itemListElement"],
  ContactPoint: ["contactType"],
};

const errors = [];
const seenTypes = new Set();

function validate(node, ctx) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach((n, i) => validate(n, `${ctx}[${i}]`));
    return;
  }
  const type = node["@type"];
  if (type && typeof type === "string") {
    seenTypes.add(type);
    const required = RULES[type];
    if (required) {
      for (const key of required) {
        if (node[key] === undefined || node[key] === null || node[key] === "") {
          errors.push(`${ctx} → ${type} missing required field "${key}"`);
        }
      }
    }
  }
  for (const [k, v] of Object.entries(node)) {
    if (typeof v === "object") validate(v, `${ctx}.${k}`);
  }
}

async function extractFromHtml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch ${url} → ${res.status}`);
  const html = await res.text();
  const blocks = [
    ...html.matchAll(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  return blocks.map((m) => m[1].trim());
}

async function runLive() {
  console.log(`\n🔎  Live JSON-LD validation against ${BASE_URL}\n`);
  for (const page of PAGES) {
    const url = `${BASE_URL}${page}`;
    let raw = [];
    try {
      raw = await extractFromHtml(url);
    } catch (e) {
      errors.push(`${page} → fetch failed: ${e.message}`);
      continue;
    }
    if (raw.length === 0) {
      errors.push(`${page} → no <script type="application/ld+json"> found in SSR HTML`);
      continue;
    }
    console.log(`  ${page}  → ${raw.length} JSON-LD block(s)`);
    raw.forEach((body, i) => {
      try {
        const parsed = JSON.parse(body);
        validate(parsed, `${page}#${i}`);
      } catch (e) {
        errors.push(`${page}#${i} → invalid JSON: ${e.message}`);
      }
    });
  }
}

async function runStatic() {
  console.log("\n🔎  Static JSON-LD validation (builders)\n");
  const mod = await import("../src/lib/seo-schemas.ts").catch(async () => {
    // Fall back to source parse if tsx runtime not available
    console.error(
      "  ⚠  Direct TS import failed. Run with tsx: `npx tsx scripts/validate-jsonld.mjs --static`",
    );
    process.exit(2);
  });
  validate(mod.organizationSchema("en"), "organizationSchema(en)");
  validate(mod.organizationSchema("fr"), "organizationSchema(fr)");
  validate(mod.personSchema("en"), "personSchema(en)");
  validate(mod.websiteSchema("en"), "websiteSchema(en)");
  validate(mod.professionalServiceSchema("en"), "professionalServiceSchema(en)");
  validate(
    mod.faqPageSchema([{ q: ["Q?", "Q?"], a: ["A", "A"] }], "en"),
    "faqPageSchema",
  );
  validate(
    mod.legalPageSchemas({
      path: "/terms-conditions",
      titleEn: "T",
      titleFr: "T",
      descEn: "d",
      descFr: "d",
    }),
    "legalPageSchemas",
  );
  validate(
    mod.articleSchemas({
      slug: "hello",
      title: "Hello",
      excerpt: "x",
      cover: "https://x/y.jpg",
      publishedAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-02T00:00:00Z",
    }),
    "articleSchemas",
  );
}

(async () => {
  if (STATIC_ONLY) await runStatic();
  else await runLive();

  const types = [...seenTypes].sort().join(", ");
  console.log(`\n  Detected @types: ${types || "(none)"}\n`);

  if (errors.length) {
    console.error(`❌  ${errors.length} JSON-LD validation error(s):\n`);
    errors.forEach((e) => console.error(`   • ${e}`));
    process.exit(1);
  }
  console.log("✅  All JSON-LD blocks pass required-field checks.\n");
})();
