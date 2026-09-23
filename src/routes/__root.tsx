import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import notFoundCss from "../notfound.css?url";
import galleryCss from "../gallery.css?url";
import { supabase } from "@/integrations/supabase/client";

/** Reads the admin-uploaded OG image from site_settings (SSR-safe, non-fatal). */
async function loadOgImage(): Promise<string | null> {
  try {
    const { data } = await (supabase.from("site_settings") as any)
      .select("og_image_url")
      .limit(1)
      .maybeSingle();
    return (data?.og_image_url as string) || null;
  } catch {
    return null;
  }
}
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/lib/auth";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { Toaster } from "@/components/ui/sonner";
import { asJsonLdScript, organizationSchema, websiteSchema, DEFAULT_OG_IMAGE, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, OG_IMAGE_TYPE } from "@/lib/seo-schemas";

function NotFoundComponent() {
  const { t } = useLanguage();
  const glyphs = ["</>", "{ }", "();", "=>", "npm i", "git push", "0x1F", "</div>", "&&", "::"];
  return (
    <div className="notfound-page">
      {/* Ambient drifting code glyphs — pure CSS, decorative */}
      <div className="nf-field" aria-hidden="true">
        {glyphs.map((g, i) => (
          <span key={i} className="nf-glyph" style={{
            "--x": `${(i * 37 + 11) % 90}%`,
            "--d": `${14 + (i % 5) * 3}s`,
            "--delay": `${-(i * 2.3)}s`,
            "--s": `${0.7 + ((i * 13) % 5) / 8}`,
          } as React.CSSProperties}>{g}</span>
        ))}
      </div>

      <div className="nf-card">
        <div className="nf-terminal" aria-hidden="true">
          <span className="nf-dot" /><span className="nf-dot" /><span className="nf-dot" />
          <span className="nf-path">~/salahjuniordev</span>
        </div>
        <div className="nf-stage">
          <div className="notfound-code">4<span className="nf-zero">0</span>4</div>
          <p className="nf-line">
            <span className="nf-prompt">$</span>
            <span className="nf-cmd">npm run find-page</span>
          </p>
          <p className="nf-error">
            <span className="nf-err-tag">ERROR</span>
            {t("Page not found", "Page introuvable")}
          </p>
        </div>
        <h1 className="notfound-title">
          {t(
            "This route doesn't exist — yet.",
            "Cette route n'existe pas — pas encore.",
          )}
        </h1>
        <p className="notfound-sub">
          {t(
            "The page you're looking for was moved, renamed, or never deployed.",
            "La page que vous cherchez a été déplacée, renommée ou n'a jamais été déployée.",
          )}
        </p>
        <div className="notfound-actions">
          <Link to="/" className="notfound-btn notfound-btn-primary">
            <i className="fa-solid fa-house" aria-hidden="true" />
            {t("Back home", "Retour à l'accueil")}
          </Link>
          <a href="/start" className="notfound-btn notfound-btn-ghost">
            <i className="fa-solid fa-rocket" aria-hidden="true" />
            {t("Start a Project", "Démarrer un Projet")}
          </a>
        </div>
      </div>
    </div>
  );
}

function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const { t } = useLanguage();
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {t("This page didn't load", "Cette page n'a pas pu se charger")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t(
            "Something went wrong on our end. You can try refreshing or head back home.",
            "Une erreur est survenue. Vous pouvez actualiser la page ou revenir à l'accueil.",
          )}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("Try again", "Réessayer")}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {t("Go home", "Retour à l'accueil")}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // Fetch the admin-managed OG image once per server request so crawlers see
  // the dashboard-uploaded image in the SSR head. Falls back to the default.
  loader: async () => ({ ogImage: await loadOgImage() }),
  head: ({ match }: any) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Salah Junior | Full-Stack Web Developer & UI/UX Designer – Yaoundé, Cameroon" },
      { name: "description", content: "Full-Stack Web Developer and UI/UX Designer based in Yaoundé, Cameroon. Turning ideas into digital reality." },
      { name: "author", content: "Salah Junior Ncham" },
      { name: "theme-color", content: "#07101f" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: match.context.ogImage ?? DEFAULT_OG_IMAGE },
      { property: "og:image:width", content: String(OG_IMAGE_WIDTH) },
      { property: "og:image:height", content: String(OG_IMAGE_HEIGHT) },
      { property: "og:image:type", content: OG_IMAGE_TYPE },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Salah Junior | Full-Stack Web Developer & UI/UX Designer – Yaoundé, Cameroon" },
      { name: "twitter:title", content: "Salah Junior | Full-Stack Web Developer & UI/UX Designer – Yaoundé, Cameroon" },
      { property: "og:description", content: "Full-Stack Web Developer and UI/UX Designer based in Yaoundé, Cameroon. Turning ideas into digital reality." },
      { name: "twitter:description", content: "Full-Stack Web Developer and UI/UX Designer based in Yaoundé, Cameroon. Turning ideas into digital reality." },
      { name: "twitter:image", content: match.context.ogImage ?? DEFAULT_OG_IMAGE },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: notFoundCss },
      { rel: "stylesheet", href: galleryCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "icon", href: "/pwa-192.png", type: "image/png", sizes: "192x192" },
      // LCP candidates: the hero portrait is rendered client-side by Hero.tsx, so
      // preload it (media-scoped so mobile doesn't download the desktop asset and
      // vice versa). Hero.tsx defaults match these paths.
      { rel: "preload", href: "/hero-portrait.png", as: "image", media: "(min-width: 769px)" },
      { rel: "preload", href: "/hero-mobile-1.webp", as: "image", media: "(max-width: 768px)" },
      // Warm up the third-party origins the page pulls assets from.
      { rel: "preconnect", href: "https://res.cloudinary.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://cdnjs.cloudflare.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://cdn.jsdelivr.net", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://cdn.simpleicons.org", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" },
    ],
    scripts: [
      // Single node per @id (Organization / WebSite) so graph nodes don't conflict.
      asJsonLdScript(organizationSchema("en")),
      asJsonLdScript(websiteSchema("en")),
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => (
    <LanguageProvider>
      <NotFoundComponent />
    </LanguageProvider>
  ),
  errorComponent: (props) => (
    <LanguageProvider>
      <ErrorBoundary {...props} />
    </LanguageProvider>
  ),
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* iOS home-screen icon + PWA splash feel */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <style>{`
          /* Branded loading screen: navy backdrop, logo pulse, fades out on app mount */
          .boot-splash {
            position: fixed;
            inset: 0;
            z-index: 99999;
            display: grid;
            place-items: center;
            background: #07101f;
            transition: opacity 450ms ease, visibility 450ms ease;
          }
          .boot-splash img {
            width: 96px;
            height: 96px;
            animation: boot-pulse 1.4s ease-in-out infinite;
          }
          @keyframes boot-pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(0.88); opacity: 0.7; }
          }
          .boot-splash.is-done { opacity: 0; visibility: hidden; pointer-events: none; }
        `}</style>
      </head>
      <body>
        <div id="boot-splash" className="boot-splash" aria-hidden="true">
          <img src="/logo.png" alt="" width={96} height={96} />
        </div>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/** Removes the static splash once React has mounted (or after a safety timeout). */
function BootSplash() {
  useEffect(() => {
    const el = document.getElementById("boot-splash");
    if (!el) return;
    const done = () => {
      el.classList.add("is-done");
      window.setTimeout(() => el.remove(), 600);
    };
    // Small delay so the first paint of the app is visible before the fade.
    const t = window.setTimeout(done, 350);
    return () => window.clearTimeout(t);
  }, []);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BootSplash />
        <Outlet />
        <Toaster theme="dark" position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}
