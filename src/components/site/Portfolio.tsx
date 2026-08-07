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
    <section id="portfolio" className="projects-section">
      <div className="container-sj">
        <div className="services-head">
          <h2 className="services-title">{t("My Projects", "Mes Projets")}</h2>
          <div className="services-underline">
            <span />
            <i className="dot" />
            <i className="dot" />
            <span />
          </div>
          <p className="projects-sub">
            {t("A selection of work I'm proud of", "Une sélection de travaux dont je suis fier")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <a
              key={p.id}
              href={p.link_url ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="proj-card"
            >
              <div className="proj-card-media">
                {p.image_url && <img src={p.image_url} alt={p.title} />}
              </div>
              <div className="proj-card-body">
                <span className="proj-card-pill">{p.category}</span>
                <h3 className="proj-card-title">{p.title}</h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
