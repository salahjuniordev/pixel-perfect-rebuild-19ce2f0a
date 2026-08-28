import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export function Services({ initial }: { initial?: Tables<"services">[] }) {
  const { t } = useLanguage();
  const [services, setServices] = useState<Tables<"services">[]>(initial ?? []);

  useEffect(() => {
    if (initial) return;
    supabase
      .from("services")
      .select("*")
      .eq("published", true)
      .order("order_index", { ascending: true })
      .then(({ data }) => setServices(data ?? []));
  }, [initial]);

  return (
    <section id="services" className="services-section">
      <div className="container-sj">
        <div className="services-head">
          <h2 className="services-title">{t("Services", "Services")}</h2>
          <div className="services-underline">
            <span /><span className="dot" /><span />
          </div>
        </div>
        <div className="svc-grid">
          {services.map((s) => (
            <Link key={s.id} to="/services/$id" params={{ id: s.id }} className="svc-card-new svc-card-link">
              <div className="svc-icon-circle">
                <i className={`fa-solid ${s.icon || "fa-cube"}`} />
              </div>
              <h3 className="svc-card-new-title">{s.title}</h3>
              <p className="svc-card-new-desc">{s.description}</p>
              <span className="svc-card-cta">
                {t("Learn More", "En savoir plus")}
                <i className="fa-solid fa-arrow-right" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
