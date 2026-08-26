import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Service = Tables<"services"> & { slug?: string | null; price?: string | null };

export function Services({ initial }: { initial?: Tables<"services">[] }) {
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>(initial ?? []);

  useEffect(() => {
    // When the route loader already supplied data (SSR), don't refetch on the client.
    if (initial) return;
    supabase
      .from("services")
      .select("*, slug, price")
      .eq("published", true)
      .order("order_index", { ascending: true })
      .then(({ data }) => setServices((data as Service[]) ?? []));
  }, [initial]);

  if (services.length === 0) return null;

  return (
    <section id="services" className="services-section section-padding">
      <div className="container-sj">
        <div className="text-center mb-16">
          <p className="sec-head-eyebrow">{t("What I Offer", "Ce que j'offre")}</p>
          <h2 className="sec-head-title">{t("Services", "Services")}</h2>
          <div className="sec-head-line mx-auto mt-4" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <Link
              key={s.id}
              to="/services/$id"
              params={{ id: s.slug || s.id }}
              className="svc-new-card group"
            >
              <div className="svc-new-icon">
                <i className={`fa-solid ${s.icon}`} />
              </div>
              <h3 className="svc-new-title">{s.title}</h3>
              <p className="svc-new-desc">{s.description}</p>
              {s.price && (
                <p className="svc-new-price">
                  {t("From", "À partir de")} <span>{s.price}</span>
                </p>
              )}
              <span className="svc-new-cta">
                {t("Learn More", "En savoir plus")} <i className="fa-solid fa-arrow-right text-xs" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
