import sanitizeHtml from "sanitize-html";

/**
 * Sanitizes rich-text HTML that is stored in the database (blog bodies, case
 * studies) before it is rendered with dangerouslySetInnerHTML. Even though
 * only admins can write these tables now, admin accounts can be phished or
 * compromised, and XSS from stored content would run on every visitor's
 * browser. Allow-list approach: everything not explicitly permitted is
 * stripped.
 */
export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(html, {
    allowedTags: [
      "h2", "h3", "h4", "h5", "h6", "p", "a", "ul", "ol", "li", "b", "i",
      "em", "strong", "blockquote", "code", "pre", "img", "br", "hr",
      "span", "div", "table", "thead", "tbody", "tr", "th", "td",
      "figure", "figcaption", "sup", "sub", "small", "center",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "srcset", "alt", "title", "width", "height", "loading"],
      span: ["class"],
      div: ["class"],
      p: ["class"],
      "*": ["style"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    // Auto-add rel=noopener/nofollow to links with target=_blank.
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener nofollow" }, true),
    },
    disallowedTagsMode: "discard",
  });
}
