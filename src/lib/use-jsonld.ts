import { useEffect } from "react";

/**
 * Inject one or more JSON-LD scripts into <head>.
 * Each script is tagged with data-jsonld-id={id}-{index} so that re-renders
 * replace instead of duplicate. Scripts are removed on unmount.
 */
export function useJsonLd(id: string, data: unknown | unknown[] | null | undefined) {
  useEffect(() => {
    if (typeof document === "undefined" || !data) return;
    const items = Array.isArray(data) ? data : [data];
    const nodes: HTMLScriptElement[] = [];
    items.forEach((item, i) => {
      if (!item) return;
      const key = `${id}-${i}`;
      document.head.querySelectorAll(`script[data-jsonld-id="${key}"]`).forEach((n) => n.remove());
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.setAttribute("data-jsonld-id", key);
      el.text = JSON.stringify(item);
      document.head.appendChild(el);
      nodes.push(el);
    });
    return () => {
      nodes.forEach((n) => n.remove());
    };
  }, [id, JSON.stringify(data)]);
}
