import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { LegalLayout } from "@/components/site/LegalPage";
import { useSeo } from "@/lib/use-seo";
import { asJsonLdScript, faqPageSchema, twitterMeta, SITE_ORIGIN, type FaqEntry } from "@/lib/seo-schemas";


type QA = { q: [string, string]; a: [string, string] };
type Cat = { name: [string, string]; items: QA[] };

const categories: Cat[] = [
  {
    name: ["General", "Général"],
    items: [
      {
        q: ["What services does Salah Junior offer?", "Quels services propose Salah Junior ?"],
        a: [
          "I offer Full-Stack Web Development, UI/UX Design, Graphic Design, Branding and Identity, and Office Administration. Whether you need a complete website, a logo, or a full digital strategy, I have you covered.",
          "Je propose le développement web full-stack, le design UI/UX, le design graphique, l'identité de marque et l'administration bureautique. Site complet, logo ou stratégie digitale — je m'occupe de tout.",
        ],
      },
      {
        q: ["How do I get started with a project?", "Comment démarrer un projet ?"],
        a: [
          "Reach out via the Contact section on my portfolio or send me a WhatsApp message. I will review your requirements and respond within 24 hours to schedule a discovery call.",
          "Contactez-moi via la section Contact du portfolio ou par WhatsApp. Je réponds sous 24h pour planifier un appel de découverte.",
        ],
      },
      {
        q: ["Do you work with clients outside Cameroon?", "Travaillez-vous avec des clients hors Cameroun ?"],
        a: [
          "Yes! I work with clients globally via email, WhatsApp, and video calls. I have delivered projects for clients across Africa, Europe, and beyond.",
          "Oui ! Je travaille avec des clients partout dans le monde par email, WhatsApp et appels vidéo. J'ai livré des projets en Afrique, en Europe et au-delà.",
        ],
      },
    ],
  },
  {
    name: ["Pricing & Payment", "Tarifs & Paiement"],
    items: [
      {
        q: ["What are your payment terms?", "Quelles sont vos conditions de paiement ?"],
        a: [
          "I require 50% upfront before work begins and 50% upon project completion. For larger projects, milestone-based payment can be arranged.",
          "50% d'acompte avant le démarrage et 50% à la livraison. Pour les gros projets, un paiement par jalons est possible.",
        ],
      },
      {
        q: ["What payment methods do you accept?", "Quels moyens de paiement acceptez-vous ?"],
        a: [
          "I accept Mobile Money (MTN and Orange), Bank Transfer, PayPal, and Western Union. Details are shared on your invoice.",
          "J'accepte Mobile Money (MTN et Orange), virement bancaire, PayPal et Western Union. Les détails figurent sur la facture.",
        ],
      },
      {
        q: ["Can I get a custom quote?", "Puis-je obtenir un devis personnalisé ?"],
        a: [
          "Absolutely. Contact me to describe your needs and I will provide a tailored quote with no obligation.",
          "Absolument. Contactez-moi avec vos besoins et je vous enverrai un devis sur mesure, sans engagement.",
        ],
      },
    ],
  },
  {
    name: ["Project Process", "Déroulement du projet"],
    items: [
      {
        q: ["How long does a typical project take?", "Quelle est la durée d'un projet ?"],
        a: [
          "Timelines vary: a logo takes 3-5 days; a 1-page website takes 7-14 days; a full e-commerce site or branding package takes 3-5 weeks.",
          "Cela varie : un logo prend 3-5 jours, un site 1 page 7-14 jours, un e-commerce ou une identité complète 3-5 semaines.",
        ],
      },
      {
        q: ["How many revisions are included?", "Combien de révisions sont incluses ?"],
        a: [
          "All plans include at least 3 rounds of revisions. Additional revisions are available at an hourly rate communicated upfront.",
          "Tous les forfaits incluent au moins 3 tours de révisions. Les révisions supplémentaires sont facturées à l'heure, tarif communiqué à l'avance.",
        ],
      },
      {
        q: ["Will I own the final files?", "Serai-je propriétaire des fichiers finaux ?"],
        a: [
          "Yes. Upon full payment, you receive complete ownership of all design files, source files, and website code.",
          "Oui. Au paiement complet, vous obtenez la pleine propriété des fichiers design, sources et du code du site.",
        ],
      },
    ],
  },
  {
    name: ["Support", "Support"],
    items: [
      {
        q: ["Do you offer post-launch support?", "Proposez-vous un support post-lancement ?"],
        a: [
          "Yes! My Premium plan includes 2 months of free post-launch support. All other plans include 30 days. Extended maintenance packages are available.",
          "Oui ! Le forfait Premium inclut 2 mois de support gratuit. Les autres forfaits en incluent 30 jours. Des packages de maintenance étendue sont disponibles.",
        ],
      },
      {
        q: ["How do I report a bug after launch?", "Comment signaler un bug après le lancement ?"],
        a: [
          "Email salahjuniorncham@gmail.com or WhatsApp +237 683 693 011. I respond to all support requests within 24 business hours.",
          "Écrivez à salahjuniorncham@gmail.com ou WhatsApp +237 683 693 011. Je réponds à toutes les demandes sous 24h ouvrées.",
        ],
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-dark !p-0 overflow-hidden mb-3">
      <button onClick={() => setOpen(!open)} className="w-full text-left p-5 flex items-center justify-between gap-4">
        <span className="text-white font-medium">{q}</span>
        <i className={`fa-solid fa-chevron-down text-[--brand] transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 text-sm text-slate-300 leading-relaxed">{a}</div>}
    </div>
  );
}

function FAQPage() {
  const { t, lang } = useLanguage();
  useSeo({
    title: {
      en: "FAQ – Web Development & Design Services | Salah Junior",
      fr: "FAQ – Services de Développement Web & Design | Salah Junior",
    },
    description: {
      en: "Frequently asked questions about web development, UI/UX design, pricing, timelines and support with Salah Junior.",
      fr: "Questions fréquemment posées sur le développement web, le design UI/UX, les tarifs, les délais et le support avec Salah Junior.",
    },
    path: "/faq",
  });
  const isFr = lang === "fr";
  useJsonLd("faq", {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: isFr ? "fr" : "en",
    mainEntity: categories.flatMap((c) =>
      c.items.map((it) => ({
        "@type": "Question",
        name: isFr ? it.q[1] : it.q[0],
        acceptedAnswer: { "@type": "Answer", text: isFr ? it.a[1] : it.a[0] },
      }))
    ),
  });
  return (
    <LegalLayout
      title={t("FAQ", "FAQ")}
      subtitle={t("Frequently Asked Questions", "Questions Fréquemment Posées")}
      updated={t("Last Updated: January 2026", "Dernière mise à jour : janvier 2026")}
    >
      {categories.map((c) => (
        <div key={c.name[0]} className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-5">{t(c.name[0], c.name[1])}</h2>
          {c.items.map((it) => <FAQItem key={it.q[0]} q={t(it.q[0], it.q[1])} a={t(it.a[0], it.a[1])} />)}
        </div>
      ))}
    </LegalLayout>
  );
}
