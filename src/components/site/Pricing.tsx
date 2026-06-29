import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export function Pricing() {
  const { t } = useLanguage();
  const [plans, setPlans] = useState<Tables<"pricing_tiers">[]>([]);

  useEffect(() => {
    supabase
      .from("pricing_tiers")
      .select("*")
      .eq("published", true)
      .order("order_index", { ascending: true })
      .then(({ data }) => setPlans(data ?? []));
  }, []);

  return (
    <section className="section-padding">
      <div className="container-sj">
        <div className="sec-head text-center mb-14">
          <h6>{t("Pricing", "Tarifs")}</h6>
          <h2>{t("Pricing Plans", "Plans Tarifaires")}</h2>
          <div className="underline" />
          <p>{t("Transparent pricing for every stage of your project", "Tarification transparente pour chaque étape de votre projet")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((p) => {
            const features = Array.isArray(p.features) ? (p.features as string[]) : [];
            return (
              <div key={p.id} className={`pricing-card ${p.highlighted ? "featured" : ""}`}>
                {p.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[--brand] text-white text-xs font-bold px-4 py-1 rounded-full">
                    {t("Most Popular", "Le Plus Populaire")}
                  </span>
                )}
                <i className="fa-solid fa-crown text-[--brand] text-3xl mb-4" />
                <h3 className="text-2xl font-bold text-white mb-1">{p.name}</h3>
                <p className="text-sm text-slate-400 mb-6">{p.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">{p.price}</span>
                  <span className="text-slate-400 ml-2">{p.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-200">
                      <i className="fa-solid fa-check text-[--brand]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
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
