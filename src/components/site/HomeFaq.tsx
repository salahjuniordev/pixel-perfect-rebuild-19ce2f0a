import { useState } from "react";
import { useLanguage } from "@/lib/language";
import { SITE_ORIGIN, type FaqEntry } from "@/lib/seo-schemas";

/**
 * Homepage FAQ — deliberately DIFFERENT from the /faq page (services,
 * payment terms, revisions count, support are covered there). These are
 * pre-sale objections a visitor scanning the homepage has, each answered
 * concretely. Keep both lists in sync with reality when prices/processes
 * change; never duplicate questions across the two lists.
 *
 * SEO notes:
 * - Answers are always in the DOM (visibility-toggled via `hidden`, not
 *   conditionally rendered) so crawlers and AI answer engines can read them
 *   from the server HTML.
 * - homeFaqSchemas() emits FAQPage JSON-LD for both languages, wired into
 *   the route's head() in src/routes/index.tsx. Google restricts FAQ rich
 *   results to authoritative sites, but the markup still feeds AI Overviews
 *   and LLM answer engines.
 */
const HOME_FAQ: FaqEntry[] = [
  {
    q: ["How much does a website cost?", "Combien coûte un site web ?"],
    a: [
      "One-page sites, business websites with CMS, full e-commerce — every plan is fixed-price and visible in the pricing section above, and flyer design subscriptions start at 15,000 FCFA/month. You approve the exact quote before any work starts, so there are no surprises.",
      "Site vitrine, site d'entreprise avec CMS, e-commerce complet — chaque forfait est à prix fixe, visible dans la section tarifs ci-dessus, et les abonnements flyers démarrent à 15 000 FCFA/mois. Vous validez le devis exact avant le moindre travail : aucune surprise.",
    ],
  },
  {
    q: ["Can I see real examples before I commit?", "Puis-je voir des exemples concrets avant de m'engager ?"],
    a: [
      "Absolutely — the Portfolio and Gallery sections above show real shipped work, and each project page tells the story behind the build: the problem, the decisions, the result. Want samples closer to your industry? Ask and I'll send relevant work.",
      "Bien sûr — les sections Portfolio et Galerie ci-dessus montrent des projets réellement livrés, et chaque page projet raconte l'histoire : le problème, les décisions, le résultat. Vous voulez voir des réalisations de votre secteur ? Demandez-moi, je vous enverrai des exemples.",
    ],
  },
  {
    q: ["Who actually does the work?", "Qui fait réellement le travail ?"],
    a: [
      "Me — from the first message to the final deployment. No account managers, no hand-offs: you speak directly with the person designing and coding your project, which is why decisions take hours instead of weeks.",
      "Moi — du premier message à la mise en ligne. Aucun intermédiaire, aucun transfert : vous échangez directement avec la personne qui conçoit et code votre projet. C'est pourquoi les décisions se prennent en heures, pas en semaines.",
    ],
  },
  {
    q: ["Do you work in English and French?", "Travaillez-vous en français et en anglais ?"],
    a: [
      "Yes — I work with clients in both English and French, and this site itself runs in both. I can also deliver your website's content, flyers and brand materials in one or both languages.",
      "Oui — je travaille avec mes clients en français comme en anglais, et ce site existe d'ailleurs dans les deux langues. Je peux aussi livrer le contenu de votre site, vos flyers et vos supports de marque dans une ou deux langues.",
    ],
  },
  {
    q: ["What's included with every plan?", "Qu'est-ce qui est inclus avec chaque forfait ?"],
    a: [
      "Beyond the plan features themselves: a custom email address, domain name registration, business address setup, and one month of flyer designs. See the green \"Included with every plan\" block on any pricing card above.",
      "En plus des fonctionnalités du forfait : une adresse e-mail personnalisée, l'enregistrement du nom de domaine, la configuration de l'adresse commerciale et un mois de création de flyers. Voir le bloc vert « Inclus avec chaque forfait » sur les cartes de tarifs ci-dessus.",
    ],
  },
  {
    q: ["Can you fix or redesign my existing website?", "Pouvez-vous réparer ou refaire mon site existant ?"],
    a: [
      "Yes. I start with a quick audit — speed, mobile experience, SEO, security — then tell you honestly whether a targeted fix or a full rebuild gives you more value for your budget. You get the recommendation before any commitment.",
      "Oui. Je commence par un audit rapide — vitesse, expérience mobile, SEO, sécurité — puis je vous dis honnêtement si une correction ciblée ou une refonte complète offre le meilleur rapport valeur/prix. Vous recevez la recommandation avant tout engagement.",
    ],
  },
  {
    q: ["What if I don't like the first design?", "Et si le premier design ne me plaît pas ?"],
    a: [
      "Then we iterate. Every plan includes revision rounds, and nothing goes live until you approve it. You follow progress on a preview link throughout the project — never a surprise at delivery.",
      "Alors on itère. Chaque forfait inclut des tours de révisions, et rien n'est mis en ligne sans votre validation. Vous suivez l'avancement via un lien d'aperçu pendant tout le projet — jamais de surprise à la livraison.",
    ],
  },
  {
    q: ["How do we stay in touch during the project?", "Comment restons-nous en contact pendant le projet ?"],
    a: [
      "WhatsApp and email for quick questions, plus a short progress update at each milestone with a live preview link. After launch, you reach me the same way — response within 24 business hours.",
      "WhatsApp et e-mail pour les échanges rapides, plus un point d'avancement à chaque étape avec un lien d'aperçu en direct. Après le lancement, vous me joignez de la même façon — réponse sous 24h ouvrées.",
    ],
  },
];

/** FAQPage JSON-LD (EN + FR) for the homepage — consumed by index.tsx head(). */
export function homeFaqSchemas(): unknown[] {
  return (["en", "fr"] as const).map((lang) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_ORIGIN}/#faq-${lang}`,
    inLanguage: lang === "fr" ? "fr-FR" : "en-US",
    isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
    mainEntity: HOME_FAQ.map((e) => ({
      "@type": "Question",
      name: lang === "fr" ? e.q[1] : e.q[0],
      acceptedAnswer: {
        "@type": "Answer",
        text: lang === "fr" ? e.a[1] : e.a[0],
      },
    })),
  }));
}

export function HomeFaq() {
  const { t } = useLanguage();
  // First question open by default — shows the interaction affordance immediately.
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding bg-[#05090f]">
      <div className="container-sj">
        <div className="sec-head text-center mb-14">
          <p className="eyebrow">{t("FAQ", "FAQ")}</p>
          <h2>{t("Questions, Answered", "Vos Questions, Nos Réponses")}</h2>
          <div className="underline" />
          <p>
            {t(
              "The short version — the full FAQ page has every detail",
              "La version courte — la page FAQ complète contient tous les détails",
            )}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-3 lg:gap-4 max-w-5xl mx-auto items-start">
          {HOME_FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q[0]}
                className={`card-dark !p-0 overflow-hidden ${isOpen ? "!border-[--brand]/40" : ""}`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`home-faq-a-${i}`}
                  className="w-full text-left p-5 flex items-start justify-between gap-4"
                >
                  <span className="text-white font-medium">{t(item.q[0], item.q[1])}</span>
                  <i
                    className={`fa-solid fa-chevron-down text-[--brand] transition mt-1 ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                {/* Always in the DOM (SSR-friendly); visibility toggled only. */}
                <div id={`home-faq-a-${i}`} className={isOpen ? "px-5 pb-5" : "hidden"}>
                  <p className="text-sm text-slate-300 leading-relaxed">{t(item.a[0], item.a[1])}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <a href="/start" className="btn-brand">
            {t("Start a Project", "Démarrer un Projet")}
            <i className="fas fa-arrow-right ml-2" aria-hidden="true" />
          </a>
          <a href="https://wa.me/237683693011" target="_blank" rel="noreferrer" className="btn-outline">
            <i className="fab fa-whatsapp mr-2" aria-hidden="true" />
            {t("Ask on WhatsApp", "Demander sur WhatsApp")}
          </a>
          <a
            href="/faq"
            className="text-sm text-slate-400 hover:text-[--brand] underline underline-offset-4 transition"
          >
            {t("Read the full FAQ", "Lire la FAQ complète")}
          </a>
        </div>
      </div>
    </section>
  );
}
