import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";

type Ebook = {
  id: string;
  title: string;
  description: string | null;
  price: string | null;
  currency: string | null;
  cover_url: string | null;
  /** Supabase Storage PDF (or any direct file URL) served after the email gate. */
  buy_url: string;
  badge: string | null;
  order_index: number;
  published: boolean;
};

type Gate = { ebook: Ebook } | null;

/**
 * Stable per-guide label for the newsletter `source` column, so the admin can
 * tell which ebook drove a signup. Derived from the title, not order_index —
 * ordering can be reordered by the admin and would break attribution.
 */
const sourceLabel = (ebook: Ebook) =>
  `ebook:${
    ebook.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "guide"
  }`;

export function Ebooks() {
  const { t } = useLanguage();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [gate, setGate] = useState<Gate>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await (supabase.from("ebooks" as any) as any)
          .select("*")
          .eq("published", true)
          .order("order_index", { ascending: true });
        setEbooks((data as Ebook[]) ?? []);
      } catch {
        /* table may not exist yet — section stays hidden */
      }
    })();
  }, []);

  // Hide the section entirely until the admin has published at least one ebook.
  if (ebooks.length === 0) return null;

  return (
    <section id="ebooks" className="section-padding bg-[#07101f]">
      <div className="container-sj">
        <div className="sec-head text-center mb-14">
          <p className="eyebrow">{t("Free Resources", "Ressources gratuites")}</p>
          <h2>{t("Free Ebooks & Guides", "Ebooks & Guides gratuits")}</h2>
          <div className="underline" />
          <p>
            {t(
              "Practical guides I've written to help you build faster. Enter your email, download instantly — completely free.",
              "Des guides pratiques que j'ai écrits pour vous aider à construire plus vite. Entrez votre email, téléchargement immédiat — entièrement gratuit.",
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ebooks.map((b) => (
            <article key={b.id} className="ebook-card">
              <div className="ebook-cover">
                {b.cover_url ? (
                  <img src={b.cover_url} alt={b.title} loading="lazy" decoding="async" />
                ) : (
                  <div className="ebook-cover-fallback">
                    <i className="fa-solid fa-book-open" />
                  </div>
                )}
                <span className="ebook-badge">{b.badge || t("Free", "Gratuit")}</span>
              </div>
              <div className="ebook-body">
                <h3 className="ebook-title">{b.title}</h3>
                {b.description && <p className="ebook-desc">{b.description}</p>}
                <div className="ebook-foot">
                  {b.buy_url ? (
                    <button
                      type="button"
                      onClick={() => setGate({ ebook: b })}
                      className="ebook-buy-btn"
                    >
                      <i className="fa-solid fa-download" />
                      {t("Free Download", "Téléchargement gratuit")}
                    </button>
                  ) : (
                    <span className="ebook-coming-soon">{t("Coming soon", "Bientôt")}</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <DownloadGate ebook={gate?.ebook ?? null} onClose={() => setGate(null)} />
    </section>
  );
}

/* -------------------------------------------------------------------- */
/*  Email gate — captures the address, then starts the download.          */
/*  The address lands in newsletter_subscribers with source "ebook:<n>"  */
/*  so the admin list can attribute which guide drove the signup.         */
/* -------------------------------------------------------------------- */

function DownloadGate({ ebook, onClose }: { ebook: Ebook | null; onClose: () => void }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [optIn, setOptIn] = useState(true);
  const [status, setStatus] = useState<"idle" | "busy" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Reset for the next visitor / next ebook.
  useEffect(() => {
    setEmail("");
    setOptIn(true);
    setStatus("idle");
    setErrorMsg("");
  }, [ebook?.id]);

  // Escape closes, and the page behind must not scroll while the gate is open.
  // `onClose` is a fresh closure every render, so the effect is keyed only on
  // `ebook` and the listener reads the latest callback through a ref.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    if (!ebook) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [ebook]);

  if (!ebook) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const address = email.trim().toLowerCase();
    if (!address) return;

    setStatus("busy");
    setErrorMsg("");

    // Open the tab synchronously: a window.open() after an await is blocked
    // by most popup blockers, and we want the file to start without a click.
    const tab = window.open("", "_blank");

    try {
      // Capture failure must never block the download — the visitor still
      // gets the guide even if a signup insert errors.
      try {
        await (supabase.from("ebook_downloads" as any) as any).insert({
          email: address,
          ebook_id: ebook.id,
          ebook_title: ebook.title,
          opt_in: optIn,
        });

        // Only people who ticked the box go on the newsletter list.
        if (optIn) {
          const { error } = await (supabase.from("newsletter_subscribers" as any) as any).insert({
            email: address,
            source: sourceLabel(ebook),
          });
          // 23505 = already subscribed — that is a success, not an error.
          if (error && (error as any).code !== "23505") throw error;
        }
      } catch (err: any) {
        console.error("[ebooks] download capture failed", err);
      }

      if (tab) tab.location.href = ebook.buy_url;
      else window.location.href = ebook.buy_url;
      onClose();
    } catch (err: any) {
      if (tab) tab.close();
      setErrorMsg(
        err?.message ||
          t("Something went wrong. Please try again.", "Une erreur est survenue. Réessayez."),
      );
      setStatus("error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ebook-gate-title"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-[#0b1626] border border-white/10 p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-1">
          <h3 id="ebook-gate-title" className="text-white text-lg font-bold leading-snug">
            {ebook.title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("Close", "Fermer")}
            className="text-slate-400 hover:text-white transition-colors shrink-0"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <p className="text-sm text-slate-400 mb-6">
          {t(
            "Free PDF. Enter your email and the download starts right away.",
            "PDF gratuit. Entrez votre email et le téléchargement commence immédiatement.",
          )}
        </p>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("your@email.com", "votre@email.com")}
            aria-label={t("Email address", "Adresse email")}
            className="w-full rounded-xl bg-[#05090f] border border-white/10 px-4 py-3 text-white text-sm outline-none focus:border-[var(--brand)] transition-colors"
          />

          <label className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed cursor-pointer">
            <input
              type="checkbox"
              checked={optIn}
              onChange={(e) => setOptIn(e.target.checked)}
              className="mt-0.5 accent-[var(--brand)]"
            />
            {t(
              "Email me new guides and project breakdowns. No spam, unsubscribe anytime.",
              "Envoyez-moi les nouveaux guides et études de cas. Pas de spam, désinscription à tout moment.",
            )}
          </label>

          <button
            type="submit"
            disabled={status === "busy"}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand)] text-[var(--ink)] font-bold py-3 text-sm hover:bg-[var(--brand-ink)] hover:text-white transition-colors disabled:opacity-60"
          >
            <i className={`fa-solid ${status === "busy" ? "fa-spinner fa-spin" : "fa-download"}`} />
            {status === "busy"
              ? t("Preparing…", "Préparation…")
              : t("Send me the guide", "Envoyez-moi le guide")}
          </button>
        </form>

        {status === "error" && (
          <p className="mt-3 text-sm text-red-400" role="alert">
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}
