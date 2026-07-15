import { useEffect } from "react";
import { useLanguage } from "@/lib/language";

type SeoInput = {
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  path?: string; // pathname portion for canonical / hreflang
};

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  if (typeof document === "undefined") return;
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    if (hreflang) el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSeo({ title, description, path }: SeoInput) {
  const { lang } = useLanguage();
  useEffect(() => {
    const t = lang === "fr" ? title.fr : title.en;
    const d = lang === "fr" ? description.fr : description.en;
    document.title = t;
    document.documentElement.lang = lang;
    upsertMeta("name", "description", d);
    upsertMeta("property", "og:title", t);
    upsertMeta("property", "og:description", d);
    upsertMeta("property", "og:locale", lang === "fr" ? "fr_FR" : "en_US");
    upsertMeta("name", "twitter:title", t);
    upsertMeta("name", "twitter:description", d);

    const origin = window.location.origin;
    const p = path ?? window.location.pathname;
    const url = `${origin}${p}`;
    upsertLink("canonical", url);
    upsertMeta("property", "og:url", url);
    upsertLink("alternate", url, "en");
    upsertLink("alternate", url, "fr");
    upsertLink("alternate", url, "x-default");
  }, [lang, title.en, title.fr, description.en, description.fr, path]);
}
