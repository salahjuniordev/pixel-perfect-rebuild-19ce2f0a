import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "https://salahjuniordev.vercel.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const STATIC_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/faq", changefreq: "monthly", priority: "0.7" },
  { path: "/refund-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms-conditions", changefreq: "yearly", priority: "0.3" },
  { path: "/license-copyright", changefreq: "yearly", priority: "0.3" },
];

async function blogEntries(): Promise<SitemapEntry[]> {
  try {
    const { data } = await supabase
      .from("blog_posts")
      .select("slug,updated_at,published")
      .eq("published", true)
      .order("published_at", { ascending: false });
    return (data ?? []).map((p) => ({
      path: `/blog/${p.slug}`,
      lastmod: p.updated_at ? new Date(p.updated_at).toISOString() : undefined,
      changefreq: "monthly" as const,
      priority: "0.8",
    }));
  } catch {
    return [];
  }
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [...STATIC_ENTRIES, ...(await blogEntries())];

        const urls = entries.map((e) => {
          const loc = `${BASE_URL}${e.path}`;
          return [
            `  <url>`,
            `    <loc>${esc(loc)}</loc>`,
            `    <xhtml:link rel="alternate" hreflang="fr" href="${esc(`${loc}?lang=fr`)}" />`,
            `    <xhtml:link rel="alternate" hreflang="en" href="${esc(`${loc}?lang=en`)}" />`,
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(loc)}" />`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n");
        });

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
