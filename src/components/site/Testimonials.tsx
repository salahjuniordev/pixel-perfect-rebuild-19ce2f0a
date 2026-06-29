import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language";

const items = [
  { quote_en: "Salah delivered a stunning website for our logistics company. The attention to detail and bilingual support were exactly what we needed. Highly professional!", quote_fr: "Salah a livré un site web magnifique pour notre société logistique. L'attention aux détails et le support bilingue étaient exactement ce qu'il nous fallait. Très professionnel !", stars: 5, name: "Kouamé Bernard", role_en: "CEO, Sea Bridge Logistics", role_fr: "PDG, Sea Bridge Logistics", initials: "KB", bg: "#0ea5e9" },
  { quote_en: "The AI marketing studio he built for our cosmetics brand is a game-changer. Flyer generation, captions, chatbot — all in one elegant tool. We love it!", quote_fr: "Le studio marketing IA qu'il a conçu pour notre marque de cosmétiques change la donne. Génération de flyers, légendes, chatbot — tout dans un outil élégant.", stars: 5, name: "Aïcha Ngo", role_en: "Founder, Maney Cosmetics", role_fr: "Fondatrice, Maney Cosmetics", initials: "AN", bg: "#be185d" },
  { quote_en: "He transformed our NGO's online presence completely. The donation system integrated with Mobile Money is seamless. Real dedication to our mission.", quote_fr: "Il a totalement transformé la présence en ligne de notre ONG. Le système de dons avec Mobile Money est parfaitement intégré.", stars: 4.5, name: "Marie Fomba", role_en: "Director, New Hope Orphanage", role_fr: "Directrice, New Hope Orphanage", initials: "MF", bg: "#059669" },
  { quote_en: "Fast, clean, and creative. Salah built my OSINT portfolio with a terminal dark aesthetic I didn't think was possible. Communication was excellent throughout.", quote_fr: "Rapide, propre et créatif. Salah a construit mon portfolio OSINT avec une esthétique terminal sombre que je pensais impossible.", stars: 5, name: "Moses Omaye", role_en: "OSINT Engineer, GiantbrainTech", role_fr: "Ingénieur OSINT, GiantbrainTech", initials: "MO", bg: "#6d28d9" },
  { quote_en: "Our academy's registration platform looks professional and works flawlessly. Students keep complimenting the design. Salah exceeded every expectation.", quote_fr: "La plateforme d'inscription de notre académie est professionnelle et fonctionne parfaitement. Salah a dépassé toutes les attentes.", stars: 5, name: "David Kamga", role_en: "Manager, HighUp Web Academy", role_fr: "Manager, HighUp Web Academy", initials: "DK", bg: "#d97706" },
  { quote_en: "Working with Salah felt like having a senior developer on our team. He understood our brand, anticipated our needs, and delivered ahead of schedule.", quote_fr: "Travailler avec Salah, c'était comme avoir un développeur senior dans l'équipe. Il a compris notre marque et livré en avance.", stars: 5, name: "Lionel Tchoupo", role_en: "Founder, E-Commerce Startup", role_fr: "Fondateur, Startup E-Commerce", initials: "LT", bg: "#b91c1c" },
];

function Stars({ n }: { n: number }) {
  const full = Math.floor(n); const half = n - full >= 0.5;
  return (
    <div className="flex gap-1 text-amber-400">
      {Array.from({ length: full }).map((_, i) => <i key={i} className="fa-solid fa-star" />)}
      {half && <i className="fa-solid fa-star-half-stroke" />}
    </div>
  );
}

export function Testimonials() {
  const { t, lang } = useLanguage();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, []);
  const it = items[i];
  return (
    <section id="testimonials" className="section-padding bg-ink-deep">
      <div className="container-sj">
        <div className="sec-head sec-head--dark text-center mb-14">
          <h6>{t("Reviews", "Avis")}</h6>
          <h2>{t("Client Testimonials", "Témoignages Clients")}</h2>
          <div className="underline" />
          <p>{t("What my clients say about working with me", "Ce que disent mes clients sur notre collaboration")}</p>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="testimonial-card text-center">
            <Stars n={it.stars} />
            <p className="text-lg md:text-xl text-slate-200 leading-relaxed my-6 italic">"{lang === "en" ? it.quote_en : it.quote_fr}"</p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full grid place-items-center text-white font-bold" style={{ background: it.bg }}>{it.initials}</div>
              <div className="text-left">
                <div className="font-bold text-white">{it.name}</div>
                <div className="text-xs text-slate-400">{lang === "en" ? it.role_en : it.role_fr}</div>
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
