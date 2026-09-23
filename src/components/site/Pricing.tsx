import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

/**
 * French translations for plan content stored in the `pricing_tiers` table.
 * Falls back to the original string when no translation is registered.
 */
const FR_PLAN_TEXT: Record<string, string> = {
  // Plan names
  Starter: "Démarrage",
  Medium: "Standard",
  Enterprise: "Entreprise",
  // Periods
  "/ project": "/ projet",
  "per project": "par projet",
  "/ month": "/ mois",
  "per month": "par mois",
  // Descriptions
  "Perfect for individuals and small projects": "Parfait pour les particuliers et les petits projets",
  "Ideal for growing businesses and brands": "Idéal pour les entreprises et les marques en croissance",
  "Full-scale solution for serious businesses": "Solution complète pour les entreprises ambitieuses",
  // Features — Starter
  "1-Page Responsive Website": "Site web responsive d'une page",
  "Basic UI/UX Design": "Design UI/UX de base",
  "Mobile Optimized": "Optimisé pour mobile",
  "Contact Form": "Formulaire de contact",
  "5-Day Delivery": "Livraison en 5 jours",
  "SEO Optimization": "Optimisation SEO",
  // Features — Medium
  "Up to 5-Page Website": "Site web jusqu'à 5 pages",
  "Custom UI/UX Design": "Design UI/UX sur mesure",
  "Fully Responsive": "Entièrement responsive",
  "CMS Integration": "Intégration CMS",
  "10-Day Delivery": "Livraison en 10 jours",
  "E-Commerce Features": "Fonctionnalités e-commerce",
  // Features — Enterprise
  "Unlimited Pages": "Pages illimitées",
  "Full-Stack Development": "Développement full-stack",
  "E-Commerce Ready": "Prêt pour l'e-commerce",
  "Advanced SEO": "SEO avancé",
  "Custom Branding & Logo": "Branding et logo personnalisés",
  "2 Months Support": "2 mois de support",
  "Priority Delivery": "Livraison prioritaire",
};

/**
 * Flyer-design subscription plans (monthly). Content from the client's
 * official flyer, restyled to the site's design language. Bilingual.
 */
type FlyerPlan = {
  id: string;
  icon: string;
  name: [string, string];
  count: [string, string];
  price: string;
  period: [string, string];
  featured?: boolean;
  features: Array<[string, string]>;
  reward?: [string, string];
  rewardIcon?: string;
};

const FLYER_PLANS: FlyerPlan[] = [
  {
    id: "flyer-essential",
    icon: "fa-file-lines",
    name: ["Essential", "Essentiel"],
    count: ["10 flyers / month", "10 flyers / mois"],
    price: "15 000",
    period: ["FCFA / month", "FCFA / mois"],
    features: [
      ["10 flyers every month", "10 flyers chaque mois"],
      ["1 design request at a time", "1 demande de design à la fois"],
      ["Up to 2 revisions per flyer", "Jusqu'à 2 révisions par flyer"],
    ],
  },
  {
    id: "flyer-pro",
    icon: "fa-bolt",
    name: ["Pro", "Pro"],
    count: ["15 flyers / month", "15 flyers / mois"],
    price: "25 000",
    period: ["FCFA / month", "FCFA / mois"],
    featured: true,
    features: [
      ["15 flyers every month", "15 flyers chaque mois"],
      ["1 design request at a time", "1 demande de design à la fois"],
      ["Up to 2 revisions per flyer", "Jusqu'à 2 révisions par flyer"],
    ],
    rewardIcon: "fa-user-plus",
    reward: [
      "Refer 1 new subscriber — get 3 bonus flyers when they join",
      "Recommandez 1 nouvel abonné — obtenez 3 flyers bonus lorsqu'il s'abonne",
    ],
  },
  {
    id: "flyer-unlimited",
    icon: "fa-infinity",
    name: ["Unlimited", "Illimité"],
    count: ["Unlimited flyers", "Flyers illimités"],
    price: "60 000 – 100 000",
    period: ["FCFA / month", "FCFA / mois"],
    features: [
      ["Unlimited flyers (fair-use policy)", "Flyers illimités (politique d'utilisation équitable)"],
      ["1 design request at a time", "1 demande de design à la fois"],
      ["Up to 2 revisions per flyer", "Jusqu'à 2 révisions par flyer"],
    ],
    rewardIcon: "fa-users",
    reward: [
      "Refer up to 4 new subscribers — 4 successful referrals = 1 month FREE",
      "Recommandez jusqu'à 4 nouveaux abonnés — 4 parrainages réussis = 1 mois GRATUIT",
    ],
  },
];

/**
 * Perks bundled with every plan. Rendered as a distinct "Included with
 * every plan" block on each pricing card so they can't be missed.
 */
const PERK_KEYS = [
  { key: "email", icon: "fa-at", en: "Custom email address", fr: "Adresse e-mail personnalisée" },
  { key: "domain", icon: "fa-globe", en: "Domain name registration", fr: "Enregistrement du nom de domaine" },
  { key: "address", icon: "fa-location-dot", en: "Business address setup", fr: "Configuration de l'adresse commerciale" },
  { key: "flyers", icon: "fa-file-lines", en: "Flyers created for one month", fr: "Flyers créés pendant un mois" },
];

export function Pricing({ initial }: { initial?: Tables<"pricing_tiers">[] }) {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const tx = (s: string | null | undefined) =>
    lang === "fr" && s ? (FR_PLAN_TEXT[s] ?? s) : (s ?? "");
  const [plans, setPlans] = useState<Tables<"pricing_tiers">[]>(initial ?? []);

  useEffect(() => {
    if (initial) return;
    supabase
      .from("pricing_tiers")
      .select("*")
      .eq("published", true)
      .order("order_index", { ascending: true })
      .then(({ data }) => setPlans(data ?? []));
  }, [initial]);

  return (
    <section className="section-padding">
      <div className="container-sj">
        <div className="sec-head text-center mb-14">
          <p className="eyebrow">{t("Pricing", "Tarifs")}</p>
          <h2>{t("Pricing Plans", "Plans Tarifaires")}</h2>
          <div className="underline" />
          <p>{t("Transparent pricing for every stage of your project", "Tarification transparente pour chaque étape de votre projet")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((p, idx) => {
            const features = Array.isArray(p.features) ? (p.features as string[]) : [];
            const name = (p.name || "").toLowerCase();
            const icon = name.includes("premium") || name.includes("prem") || name.includes("enterprise") || name.includes("entreprise")
              ? "fa-crown"
              : name.includes("medium") || name.includes("moyen") || name.includes("pro")
              ? "fa-star"
              : name.includes("starter") || name.includes("basic") || name.includes("début")
              ? "fa-rocket"
              : ["fa-rocket", "fa-star", "fa-crown"][idx] || "fa-gem";
            return (
              <div key={p.id} className={`pricing-card ${p.highlighted ? "featured" : ""}`}>
                {p.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[--brand] text-white text-xs font-bold px-4 py-1 rounded-full">
                    {t("Most Popular", "Le Plus Populaire")}
                  </span>
                )}
                <i className={`fa-solid ${icon} text-[--brand] text-3xl mb-4`} />

                <h3 className="text-2xl font-bold text-white mb-1">{tx(p.name)}</h3>
                <p className="text-sm text-slate-400 mb-6">{tx(p.description)}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">{p.price}</span>
                  <span className="text-slate-400 ml-2">{tx(p.period)}</span>
                </div>
                <ul className="space-y-3 mb-4">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-200">
                      <i className="fa-solid fa-check text-[--brand]" />
                      {tx(f)}
                    </li>
                  ))}
                </ul>
                {/* Included with every plan */}
                <div className="mb-8 rounded-xl border border-[--brand]/20 bg-[--brand]/[0.04] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[--brand] mb-2.5">
                    <i className="fa-solid fa-gift mr-1.5" />
                    {t("Included with every plan", "Inclus avec chaque forfait")}
                  </p>
                  <ul className="space-y-2">
                    {PERK_KEYS.map((k) => (
                      <li key={k.key} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <i className={`fa-solid ${k.icon} text-[--brand] text-xs w-4 text-center`} />
                        {t(k.en, k.fr)}
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={`/start?service=pricing:${encodeURIComponent(p.name)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate({ to: "/start", search: { service: `pricing:${p.name}` } });
                  }}
                  className={p.highlighted ? "btn-brand w-full justify-center" : "btn-outline w-full justify-center"}>
                  {t("Get Started", "Commencer")}
                </a>            </div>
          );
        })}
        </div>

        {/* Flyer design subscriptions (monthly) */}
        <div className="mt-20">
          <div className="sec-head text-center mb-12">
            <p className="eyebrow">{t("Graphic Design", "Design Graphique")}</p>
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              {t("Flyer Design Subscriptions", "Abonnements Design de Flyers")}
            </h3>
            <div className="underline" />
            <p>
              {t(
                "Subscribe every month. Get your flyers when you need them. Refer friends and earn rewards.",
                "Abonnez-vous chaque mois. Obtenez vos flyers quand vous en avez besoin. Recommandez des amis et gagnez des récompenses.",
              )}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FLYER_PLANS.map((p) => (
              <div key={p.id} className={`pricing-card ${p.featured ? "featured" : ""}`}>
                {p.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[--brand] text-white text-xs font-bold px-4 py-1 rounded-full">
                    {t("Most Popular", "Le Plus Populaire")}
                  </span>
                )}
                <i className={`fa-solid ${p.icon} text-[--brand] text-3xl mb-4`} />
                <h3 className="text-2xl font-bold text-white mb-1">{t(p.name[0], p.name[1])}</h3>
                <p className="text-sm text-[--brand] font-medium mb-6">{t(p.count[0], p.count[1])}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{p.price}</span>
                  <span className="text-slate-400 ml-2">{t(p.period[0], p.period[1])}</span>
                </div>
                <ul className="space-y-3 mb-4">
                  {p.features.map(([en, fr], i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-200">
                      <i className="fa-solid fa-check text-[--brand]" />
                      {t(en, fr)}
                    </li>
                  ))}
                </ul>
                {p.reward ? (
                  <div className="mb-8 rounded-xl border border-[--brand]/25 bg-[--brand]/[0.05] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[--brand] mb-1.5">
                      <i className={`fa-solid ${p.rewardIcon} mr-1.5`} />
                      {t("Referral reward", "Récompense de parrainage")}
                    </p>
                    <p className="text-sm text-slate-200 leading-relaxed">{t(p.reward[0], p.reward[1])}</p>
                  </div>
                ) : (
                  <div className="mb-8 flex items-center gap-2.5 text-sm text-slate-500">
                    <i className="fa-solid fa-circle-xmark" />
                    {t("No referral rewards", "Aucune récompense de parrainage")}
                  </div>
                )}
                <a
                  href={`/start?service=pricing:${encodeURIComponent(`Flyer ${p.name[0]}`)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate({ to: "/start", search: { service: `pricing:Flyer ${p.name[0]}` } });
                  }}
                  className={p.featured ? "btn-brand w-full justify-center" : "btn-outline w-full justify-center"}>
                  {t("Subscribe", "S'abonner")}
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-500 mt-6">
            {t(
              "Plans are billed monthly. Unused flyers do not roll over.",
              "Les forfaits sont facturés chaque mois. Les flyers non utilisés ne sont pas reportés.",
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
