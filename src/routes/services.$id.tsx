import { createFileRoute, notFound } from "@tanstack/react-router";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { BackToTop } from "@/components/site/BackToTop";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useSeo } from "@/lib/use-seo";
import { slugify } from "@/lib/slug";
import { IntakeForm } from "@/components/site/IntakeForm";
import {
  servicePageSchemas,
  asJsonLdScript,
  ogMeta,
  twitterMeta,
  altLinks,
  SITE_ORIGIN,
  type ServiceSeed,
  type FaqEntry,
} from "@/lib/seo-schemas";

type Service = Tables<"services">;

type Lang = "en" | "fr";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SERVICE_INCLUDES: Array<[string, string]> = [
  ["Professional consultation", "Consultation professionnelle"],
  ["Custom design & development", "Conception et développement sur mesure"],
  ["Responsive & mobile-ready", "Responsive et prêt pour mobile"],
  ["Revision rounds included", "Cycles de révision inclus"],
  ["Final delivery & handoff", "Livraison et transfert finaux"],
];

const SERVICE_ABOUT: Array<[string, string]> = [
  [
    "My {title} service takes you from first idea to launch: a discovery call to define your goals, a custom design aligned with your brand, and clean, maintainable code. Every website I deliver is fully responsive on phones, tablets and desktops, optimised for speed, and built with semantic HTML, meta tags and JSON-LD structured data so search engines can actually find and rank it.",
    "Mon service {title} vous accompagne de l'idée au lancement : appel de découverte pour définir vos objectifs, design sur mesure aligné à votre marque, et un code propre et maintenable. Chaque site livré est entièrement responsive (mobile, tablette, desktop), optimisé pour la vitesse, et construit avec du HTML sémantique, des balises meta et des données structurées JSON-LD pour être trouvé et bien classé par les moteurs de recherche.",
  ],
  [
    "I work with startups, small businesses and established companies in Yaoundé, across Cameroon and internationally. You deal directly with the developer — no agency layers — with clear milestones, at least three revision rounds and post-launch support included.",
    "Je travaille avec des startups, des PME et des entreprises établies à Yaoundé, partout au Cameroun et à l'international. Vous échangez directement avec le développeur — sans intermédiaire — avec des jalons clairs, au moins trois tours de révisions et un support après lancement.",
  ],
  [
    "Tell me about your project via WhatsApp or the contact form below: I reply within 24 hours with a tailored quote, a realistic timeline and the exact deliverables included.",
    "Parlez-moi de votre projet via WhatsApp ou le formulaire ci-dessous : je réponds sous 24 heures avec un devis sur mesure, un délai réaliste et la liste exacte des livrables.",
  ],
];

const SERVICE_FAQS: FaqEntry[] = [
  {
    q: ["How much does this service cost?", "Combien coûte ce service ?"],
    a: [
      "Every project is scoped individually — pricing depends on features, number of pages and timeline. Send your requirements via WhatsApp or the contact form and you will receive a tailored quote within 24 hours. Standard terms are 50% upfront and 50% on delivery.",
      "Chaque projet est chiffré individuellement — le prix dépend des fonctionnalités, du nombre de pages et du délai. Envoyez vos besoins via WhatsApp ou le formulaire de contact et vous recevrez un devis sur mesure sous 24 heures. Conditions standard : 50% d'acompte et 50% à la livraison.",
    ],
  },
  {
    q: ["How long does delivery take?", "Quel est le délai de livraison ?"],
    a: [
      "Most projects ship in 3–7 business days; larger builds such as e-commerce sites or full branding packages take 3–5 weeks. Rush delivery is available — mention your deadline when you reach out.",
      "La plupart des projets sont livrés en 3–7 jours ouvrables ; les projets plus importants (e-commerce, identité complète) prennent 3 à 5 semaines. Une livraison express est possible — précisez votre échéance lors de votre premier contact.",
    ],
  },
  {
    q: ["Do you work with clients outside Cameroon?", "Travaillez-vous avec des clients hors Cameroun ?"],
    a: [
      "Yes. I work remotely with clients across Africa, Europe and North America via WhatsApp, email and video calls, in English or French.",
      "Oui. Je travaille à distance avec des clients en Afrique, en Europe et en Amérique du Nord via WhatsApp, email et appels vidéo, en anglais ou en français.",
    ],
  },
];

function toServiceSeed(s: Service, lang: Lang): ServiceSeed {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    image_url: s.image_url,
    includes: SERVICE_INCLUDES.map((pair) => (lang === "fr" ? pair[1] : pair[0])),
    faqs: SERVICE_FAQS,
  };
}

async function loadService(idOrSlug: string): Promise<Service | null> {
  try {
    // The URL may be a slug ("/services/seo-optimization") or the row UUID.
    if (UUID_RE.test(idOrSlug)) {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("id", idOrSlug)
        .eq("published", true)
        .maybeSingle();
      if (data) return data;
    }
    // Slug match: prefer the DB slug column when present (select * keeps this
    // safe even before the migration), else fall back to the slugified title.
    const { data: rows } = await supabase
      .from("services")
      .select("*")
      .eq("published", true);
    return (
      (rows as Array<Service & { slug?: string | null }> | null)?.find(
        (s) => s.slug === idOrSlug || slugify(s.title) === idOrSlug,
      ) ?? null
    );
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/services/$id")({
  loader: async ({ params }) => ({ service: await loadService(params.id) }),
  head: ({ params, loaderData }) => {
    const service = loaderData?.service;
    const url = `${SITE_ORIGIN}/services/${params.id}`;
    const title = service ? `${service.title} | Salah Junior` : "Service | Salah Junior";
    const desc =
      service?.description ||
      "Web development and design service by Salah Junior, full-stack developer and designer in Yaoundé, Cameroon.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        ...ogMeta({
          titleEn: title,
          descEn: desc,
          titleFr: title,
          descFr: desc,
          url,
          image: service?.image_url ?? null,
        }),
        ...twitterMeta({ title, description: desc, image: service?.image_url ?? null, url }),
      ],
      links: altLinks(`/services/${params.id}`),
      scripts: service
        ? (["en", "fr"] as const).flatMap((l) =>
            servicePageSchemas(toServiceSeed(service, l), l).map(asJsonLdScript)
          )
        : [],
    };
  },
  component: () => (
    <LanguageProvider>
      <ServiceDetailPage />
    </LanguageProvider>
  ),
});

function ServiceDetailPage() {
  const { service } = Route.useLoaderData();
  const { t } = useLanguage();

  useSeo({
    title: {
      en: service ? `${service.title} in Yaoundé, Cameroon | Salah Junior` : "Service | Salah Junior",
      fr: service ? `${service.title} à Yaoundé, Cameroun | Salah Junior` : "Service | Salah Junior",
    },
    description: {
      en: service?.description || "Service by Salah Junior, full-stack web developer in Yaoundé, Cameroon.",
      fr: service?.description || "Service de Salah Junior, développeur web full-stack à Yaoundé, Cameroun.",
    },
    path: `/services/${(service as { slug?: string | null })?.slug || (service?.id ?? "")}`,
    image: service?.image_url ?? undefined,
  });

  if (!service) {
    throw notFound();
  }

  return (
    <>
      <Navbar />
      <main className="svc-detail-page">
        {/* Hero */}
        <section className="svc-detail-hero">
          <div className="container-sj">
            <a href="/" className="svc-detail-back">
              <i className="fa-solid fa-arrow-left" />
              {t("All Services", "Tous les Services")}
            </a>
            <div className="svc-detail-hero-inner">
              <div className="svc-detail-icon-wrap">
                <i className={`fa-solid ${service.icon || "fa-cube"}`} />
              </div>
              <h1 className="svc-detail-title">{service.title}</h1>
              {service.description && (
                <p className="svc-detail-desc">{service.description}</p>
              )}
              <div className="svc-detail-actions">
                <a
                  href="#intake"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("intake")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="svc-detail-btn svc-detail-btn-primary"
                >
                  <i className="fa-solid fa-rocket" />
                  {t("Start a Project", "Démarrer un Projet")}
                </a>
                <a href="/" className="svc-detail-btn svc-detail-btn-ghost">
                  <i className="fa-solid fa-arrow-left" />
                  {t("View All Services", "Voir Tous les Services")}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* About this service */}
        <section className="svc-detail-section">
          <div className="container-sj">
            <h2 className="svc-detail-section-title">
              {t("About this service", "À propos de ce service")}
            </h2>
            <div className="max-w-3xl mx-auto space-y-4 text-slate-300 leading-relaxed">
              {SERVICE_ABOUT.map(([en, fr], i) => (
                <p key={i}>{t(en, fr).replace("{title}", service.title)}</p>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="svc-detail-section">
          <div className="container-sj">
            <div className="svc-detail-grid">
              <div className="svc-detail-card">
                <div className="svc-detail-card-icon">
                  <i className="fa-solid fa-check" />
                </div>
                <h3>{t("What's Included", "Ce qui est inclus")}</h3>
                <ul className="svc-detail-list">
                  {SERVICE_INCLUDES.map(([en, fr]) => (
                    <li key={en}><i className="fa-solid fa-check-circle" /> {t(en, fr)}</li>
                  ))}
                </ul>
              </div>
              <div className="svc-detail-card">
                <div className="svc-detail-card-icon">
                  <i className="fa-solid fa-clock" />
                </div>
                <h3>{t("Timeline", "Délai")}</h3>
                <ul className="svc-detail-list">
                  <li><i className="fa-solid fa-check-circle" /> {t("Typical delivery: 3–7 business days", "Livraison typique : 3–7 jours ouvrables")}</li>
                  <li><i className="fa-solid fa-check-circle" /> {t("Rush delivery available", "Livraison express disponible")}</li>
                  <li><i className="fa-solid fa-check-circle" /> {t("Milestone check-ins", "Points d'étape réguliers")}</li>
                  <li><i className="fa-solid fa-check-circle" /> {t("Post-launch support", "Support après lancement")}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Service FAQ */}
        <section className="svc-detail-section">
          <div className="container-sj">
            <h2 className="svc-detail-section-title">
              {t("Service FAQ", "FAQ Service")}
            </h2>
            <div className="max-w-3xl mx-auto space-y-3">
              {SERVICE_FAQS.map((f) => (
                <details key={f.q[0]} className="card-dark !p-0 overflow-hidden">
                  <summary className="w-full p-5 flex items-center justify-between gap-4 cursor-pointer text-white font-medium">
                    {t(f.q[0], f.q[1])}
                    <i className="fa-solid fa-chevron-down text-[--brand]" />
                  </summary>
                  <div className="px-5 pb-5 text-sm text-slate-300 leading-relaxed">
                    {t(f.a[0], f.a[1])}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Project intake form */}
        <section id="intake" className="svc-detail-section svc-detail-contact">
          <div className="container-sj">
            <h2 className="svc-detail-section-title">
              {t("Start your project", "Démarrer votre projet")}
            </h2>
            <p className="svc-detail-section-sub">
              {t(
                "Answer a few questions about your project and I'll reply within 24 hours with a tailored quote.",
                "Répondez à quelques questions sur votre projet et je reviens vers vous sous 24 heures avec un devis sur mesure."
              )}
            </p>
            <div className="max-w-3xl mx-auto border border-white/10 rounded-2xl p-6 sm:p-8 bg-white/[0.02]">
              <IntakeForm serviceId={service.id} serviceTitle={service.title} t={t} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <BackToTop />
    </>
  );
}
