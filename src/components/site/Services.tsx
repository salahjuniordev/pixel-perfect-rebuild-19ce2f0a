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
    <section id="services" className="section-padding">
      <div className="container-sj">
        <div className="sec-head text-center mb-14">
          <h6>{t("What I Do", "Ce Que Je Fais")}</h6>
          <h2>{t("Services", "Services")}</h2>
          <div className="underline" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.id} className="service-card">
              {s.image_url ? (
                <img src={s.image_url} alt={s.title} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="h-20 w-20 mx-auto mb-4 rounded-2xl bg-[var(--brand)]/15 grid place-items-center text-[var(--brand)] text-3xl">
                  <i className={`fa-solid ${s.icon}`} />
                </div>
              )}
              <h6 className="text-xl font-bold text-white mb-3">{s.title}</h6>
              <p className="text-sm text-slate-400 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
