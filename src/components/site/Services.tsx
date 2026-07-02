import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export function Services() {
  const { t } = useLanguage();
  const [services, setServices] = useState<Tables<"services">[]>([]);

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .eq("published", true)
      .order("order_index", { ascending: true })
      .then(({ data }) => setServices(data ?? []));
  }, []);

  return (
    <section id="services" className="services-section">
      <div className="container-sj">
        <div className="services-head">
          <h2 className="services-title">{t("Services", "Services")}</h2>
          <div className="services-underline">
            <span /><span className="dot" /><span />
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {services.map((s) => (
            <div key={s.id} className="svc-card">
              <div className="svc-card-media">
                {s.image_url ? (
                  <img
                    src={s.image_url}
                    alt={s.title}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <i className={`fa-solid ${s.icon} text-[var(--brand)] text-6xl`} />
                )}
              </div>
              <div className="svc-card-body">
                <h6 className="svc-card-title">{s.title}</h6>
                <p className="svc-card-desc">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

