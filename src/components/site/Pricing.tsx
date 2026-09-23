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
                <ul className="space-y-3 mb-8">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-200">
                      <i className="fa-solid fa-check text-[--brand]" />
                      {tx(f)}
                    </li>
                  ))}
                </ul>
                <a
                  href={`/start?service=pricing:${encodeURIComponent(p.name)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate({ to: "/start", search: { service: `pricing:${p.name}` } });
                  }}
                  className={p.highlighted ? "btn-brand w-full justify-center" : "btn-outline w-full justify-center"}>
                  {t("Get Started", "Commencer")}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
