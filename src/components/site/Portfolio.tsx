import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export function Portfolio() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Tables<"projects">[]>([]);

  useEffect(() => {
    supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("order_index", { ascending: true })
      .then(({ data }) => setProjects(data ?? []));
  }, []);

  return (
    <section id="portfolio" className="section-padding bg-[#0a1120]">
      <div className="container-sj">
        <div className="sec-head text-center mb-14">
          <h6>{t("Portfolio", "Portfolio")}</h6>
          <h2>{t("My Projects", "Mes Projets")}</h2>
          <div className="underline" />
          <p>{t("A selection of work I'm proud of", "Une sélection de travaux dont je suis fier")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <a key={p.id} href={p.link_url ?? "#"} target="_blank" rel="noreferrer" className="portfolio-card group">
              {p.image_url && <img src={p.image_url} alt={p.title} />}
              <div className="portfolio-overlay">
                <span className="text-xs text-[--brand] uppercase tracking-wider mb-1">{p.category}</span>
                <h4 className="text-white font-bold text-lg mb-3">{p.title}</h4>
                <span className="text-sm text-slate-300 inline-flex items-center gap-2">
                  {t("View Project", "Voir le Projet")} <i className="fa-solid fa-arrow-right" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
