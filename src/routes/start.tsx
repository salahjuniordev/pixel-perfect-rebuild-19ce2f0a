import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { BackToTop } from "@/components/site/BackToTop";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { IntakeForm } from "@/components/site/IntakeForm";
import {
  asJsonLdScript,
  legalPageSchemas,
  ogMeta,
  twitterMeta,
  altLinks,
  SITE_ORIGIN,
} from "@/lib/seo-schemas";

type ServiceOption = { id: string; title: string; icon: string | null };

const START_TITLE_EN = "Start a Project – Web Development & Design Brief | Salah Junior";
const START_TITLE_FR = "Démarrer un Projet – Brief Développement Web & Design | Salah Junior";
const START_DESC_EN =
  "Tell me about your project in 2 minutes: pick a service, answer a few targeted questions, and get a tailored quote within 24 hours. Web development, UI/UX, branding and more.";
const START_DESC_FR =
  "Parlez-moi de votre projet en 2 minutes : choisissez un service, répondez à quelques questions ciblées et recevez un devis sur mesure sous 24 heures. Développement web, UI/UX, branding et plus.";

async function loadServices(): Promise<ServiceOption[]> {
  try {
    const { data } = await supabase
      .from("services")
      .select("id,title,icon")
      .eq("published", true)
      .order("order_index", { ascending: true });
    return (data ?? []) as ServiceOption[];
  } catch {
    return [];
  }
}

export const Route = createFileRoute("/start")({
  validateSearch: (search: Record<string, unknown>) => ({
    service: typeof search.service === "string" ? search.service : undefined,
  }),
  loader: () => ({ services: loadServices() }),
  head: () => ({
    meta: [
      { title: START_TITLE_EN },
      { name: "description", content: START_DESC_EN },
      ...ogMeta({
        titleEn: START_TITLE_EN,
        descEn: START_DESC_EN,
        titleFr: START_TITLE_FR,
        descFr: START_DESC_FR,
        url: `${SITE_ORIGIN}/start`,
      }),
      ...twitterMeta({ title: START_TITLE_EN, description: START_DESC_EN, url: `${SITE_ORIGIN}/start` }),
    ],
    links: altLinks("/start"),
    scripts: legalPageSchemas({
      path: "/start",
      titleEn: "Start a Project",
      titleFr: "Démarrer un Projet",
      descEn: START_DESC_EN,
      descFr: START_DESC_FR,
    }).map(asJsonLdScript),
  }),
  component: () => (
    <LanguageProvider>
      <StartPage />
    </LanguageProvider>
  ),
});

function StartPage() {
  const { services } = Route.useLoaderData();
  const { service: preselectedId } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { t } = useLanguage();
  const [resolved, setResolved] = useState<ServiceOption[] | null>(null);

  // Loader returns a promise — resolve it client-side.
  useEffect(() => {
    let alive = true;
    services.then((s) => alive && setResolved(s));
    return () => {
      alive = false;
    };
  }, [services]);

  const pick = (id: string | null, title?: string) => {
    if (id && id !== "__general__") {
      navigate({ search: { service: id } });
    } else {
      navigate({ search: { service: undefined } });
      // General request: no service — remember the title in memory only.
      setGeneral(title === "General inquiry");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [general, setGeneral] = useState(false);
  // "pricing:<Tier>" comes from Pricing plan buttons — general request with plan context.
  const pricingTier = preselectedId?.startsWith("pricing:")
    ? decodeURIComponent(preselectedId.slice("pricing:".length))
    : null;
  const selected = preselectedId && !pricingTier
    ? resolved?.find((s) => s.id === preselectedId)
    : undefined;

  useSeoOnce(t);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <header className="pt-32 pb-12 bg-[#07101f]">
          <div className="container-sj text-center">
            <nav aria-label={t("Breadcrumb", "Fil d'Ariane")} className="text-xs text-slate-400 mb-4">
              <Link to="/" className="hover:text-[--brand]">{t("Home", "Accueil")}</Link>
              <span className="mx-2">›</span>
              <span className="text-[--brand]">{t("Start a Project", "Démarrer un Projet")}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              {t("Start a Project", "Démarrer un Projet")}
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto">
              {t(
                "Two minutes of questions, a tailored quote within 24 hours. Pick what you need to begin.",
                "Deux minutes de questions, un devis sur mesure sous 24 heures. Choisissez ce dont vous avez besoin pour commencer.",
              )}
            </p>
          </div>
        </header>

        <main className="flex-1 section-padding !pt-14">
          <div className="container-sj">
            {!selected && !general && !pricingTier ? (
              <ServicePicker services={resolved} onPick={pick} t={t} />
            ) : (
              <div className="max-w-3xl mx-auto">
                {selected && (
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-[var(--brand)]/15 border border-[var(--brand)]/25 grid place-items-center">
                        <i className={`fa-solid ${selected.icon || "fa-cube"} text-[var(--brand)]`} />
                      </span>
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">
                          {t("Selected service", "Service sélectionné")}
                        </div>
                        <div className="text-white font-semibold">{selected.title}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => { setGeneral(false); pick(null); }}
                      className="text-sm text-slate-400 hover:text-white transition"
                    >
                      <i className="fa-solid fa-arrow-left mr-2" />{t("Change", "Changer")}
                    </button>
                  </div>
                )}
                {pricingTier && (
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-[var(--brand)]/15 border border-[var(--brand)]/25 grid place-items-center">
                        <i className="fa-solid fa-tags text-[var(--brand)]" />
                      </span>
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">
                          {t("Selected plan", "Forfait sélectionné")}
                        </div>
                        <div className="text-white font-semibold">{pricingTier}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => { setGeneral(false); pick(null); }}
                      className="text-sm text-slate-400 hover:text-white transition"
                    >
                      <i className="fa-solid fa-arrow-left mr-2" />{t("Change", "Changer")}
                    </button>
                  </div>
                )}
                <IntakeForm
                  serviceId={selected?.id ?? null}
                  serviceTitle={
                    selected?.title ??
                    (pricingTier ? `Pricing plan: ${pricingTier}` : general ? "General inquiry" : "")
                  }
                  t={t}
                />
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
      <WhatsAppFloat />
      <BackToTop />
    </>
  );
}

function useSeoOnce(t: (en: string, fr: string) => string) {
  useEffect(() => {
    // Client-side title sync (head() covers SSR + crawlers).
    document.title = t(START_TITLE_EN, START_TITLE_FR);
  }, [t]);
}

function ServicePicker({ services, onPick, t }: {
  services: ServiceOption[] | null;
  onPick: (id: string, title: string) => void;
  t: (en: string, fr: string) => string;
}) {
  return (
    <div className="max-w-4xl mx-auto">
      {!services ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card-dark h-28 animate-pulse opacity-40" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => onPick(s.id, s.title)}
                className="card-dark !p-6 text-left group"
              >
                <div className="w-11 h-11 rounded-xl bg-[var(--brand)]/10 border border-[var(--brand)]/20 grid place-items-center mb-4 group-hover:bg-[var(--brand)]/20 transition-colors">
                  <i className={`fa-solid ${s.icon || "fa-cube"} text-[var(--brand)]`} />
                </div>
                <div className="text-white font-semibold">{s.title}</div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  {t("Start this project", "Démarrer ce projet")}
                  <i className="fa-solid fa-arrow-right text-[var(--brand)] text-[10px] group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => onPick("__general__", "General inquiry")}
              className="text-sm text-slate-400 hover:text-[var(--brand)] transition underline underline-offset-4"
            >
              {t("Something else? Start a general request", "Autre chose ? Démarrer une demande générale")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
