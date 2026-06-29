import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

function Stars({ n }: { n: number }) {
  const full = Math.floor(n); const half = n - full >= 0.5;
  return (
    <div className="flex justify-center gap-1 text-amber-400">
      {Array.from({ length: full }).map((_, i) => <i key={i} className="fa-solid fa-star" />)}
      {half && <i className="fa-solid fa-star-half-stroke" />}
    </div>
  );
}

const palette = ["#0ea5e9", "#be185d", "#059669", "#6d28d9", "#d97706", "#b91c1c"];

export function Testimonials() {
  const { t } = useLanguage();
  const [items, setItems] = useState<Tables<"testimonials">[]>([]);
  const [i, setI] = useState(0);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("order_index", { ascending: true })
      .then(({ data }) => setItems(data ?? []));
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    const id = setInterval(() => setI((p) => (p + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [items.length]);

  if (items.length === 0) return null;
  const it = items[i % items.length];
  const initials = it.name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  const bg = palette[i % palette.length];

  return (
    <section id="testimonials" className="section-padding bg-[#070d1a]">
      <div className="container-sj">
        <div className="sec-head text-center mb-14">
          <h6>{t("Reviews", "Avis")}</h6>
          <h2>{t("Client Testimonials", "Témoignages Clients")}</h2>
          <div className="underline" />
          <p>{t("What my clients say about working with me", "Ce que disent mes clients sur notre collaboration")}</p>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="testimonial-card text-center">
            <Stars n={it.rating} />
            <p className="text-lg md:text-xl text-slate-200 leading-relaxed my-6 italic">"{it.content}"</p>
            <div className="flex items-center justify-center gap-4">
              {it.avatar_url ? (
                <img src={it.avatar_url} alt={it.name} className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full grid place-items-center text-white font-bold" style={{ background: bg }}>{initials}</div>
              )}
              <div className="text-left">
                <div className="font-bold text-white">{it.name}</div>
                <div className="text-xs text-slate-400">{[it.role, it.company].filter(Boolean).join(", ")}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 mt-8">
            <button onClick={() => setI((i - 1 + items.length) % items.length)} className="w-10 h-10 rounded-full border border-white/20 text-white hover:bg-[--brand] hover:border-[--brand]">←</button>
            {items.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)} className={`w-2.5 h-2.5 rounded-full transition ${idx === i ? "bg-[--brand] w-6" : "bg-white/20"}`} />
            ))}
            <button onClick={() => setI((i + 1) % items.length)} className="w-10 h-10 rounded-full border border-white/20 text-white hover:bg-[--brand] hover:border-[--brand]">→</button>
          </div>
        </div>
      </div>
    </section>
  );
}
