import { useLanguage } from "@/lib/language";

const plans = [
  {
    icon: "fa-rocket", name: "Starter", desc_en: "Perfect for individuals and small projects", desc_fr: "Parfait pour les particuliers et les petits projets",
    price: "$149", per_en: "/ project", per_fr: "/ projet", featured: false,
    features: [
      { en: "1-Page Responsive Website", fr: "Site web responsive 1 page", on: true },
      { en: "Basic UI/UX Design", fr: "Design UI/UX de base", on: true },
      { en: "Mobile Optimized", fr: "Optimisé mobile", on: true },
      { en: "Contact Form", fr: "Formulaire de contact", on: true },
      { en: "5-Day Delivery", fr: "Livraison 5 jours", on: true },
      { en: "SEO Optimization", fr: "Optimisation SEO", on: true },
      { en: "CMS Integration", fr: "Intégration CMS", on: false },
    ],
  },
  {
    icon: "fa-layer-group", name: "Medium", desc_en: "Ideal for growing businesses and brands", desc_fr: "Idéal pour les entreprises et marques en croissance",
    price: "$399", per_en: "/ project", per_fr: "/ projet", featured: true,
    features: [
      { en: "Up to 5-Page Website", fr: "Site jusqu'à 5 pages", on: true },
      { en: "Custom UI/UX Design", fr: "Design UI/UX sur mesure", on: true },
      { en: "Fully Responsive", fr: "Entièrement responsive", on: true },
      { en: "SEO Optimization", fr: "Optimisation SEO", on: true },
      { en: "CMS Integration", fr: "Intégration CMS", on: true },
      { en: "10-Day Delivery", fr: "Livraison 10 jours", on: true },
      { en: "E-Commerce Features", fr: "Fonctions e-commerce", on: true },
    ],
  },
  {
    icon: "fa-crown", name: "Premium", desc_en: "Full-scale solution for serious businesses", desc_fr: "Solution complète pour entreprises sérieuses",
    price: "$799", per_en: "/ project", per_fr: "/ projet", featured: false,
    features: [
      { en: "Unlimited Pages", fr: "Pages illimitées", on: true },
      { en: "Full-Stack Development", fr: "Développement full-stack", on: true },
      { en: "E-Commerce Ready", fr: "E-commerce prêt", on: true },
      { en: "Advanced SEO", fr: "SEO avancé", on: true },
      { en: "Custom Branding & Logo", fr: "Branding & logo sur mesure", on: true },
      { en: "2 Months Support", fr: "2 mois de support", on: true },
      { en: "Priority Delivery", fr: "Livraison prioritaire", on: true },
    ],
  },
];

export function Pricing() {
  const { t, lang } = useLanguage();
  return (
    <section className="section-padding bg-paper">
      <div className="container-sj">
        <div className="sec-head text-center mb-14">
          <h6>{t("Pricing", "Tarifs")}</h6>
          <h2>{t("Pricing Plans", "Plans Tarifaires")}</h2>
          <div className="underline" />
          <p>{t("Transparent pricing for every stage of your project", "Tarification transparente pour chaque étape de votre projet")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {plans.map((p) => (
            <div key={p.name} className={`pricing-card ${p.featured ? "featured" : ""}`}>
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[--brand] text-white text-xs font-bold px-4 py-1 rounded-full">
                  {t("Most Popular", "Le Plus Populaire")}
                </span>
              )}
              <i className={`fa-solid ${p.icon} text-[--brand] text-3xl mb-4`} />
              <h3 className="text-2xl font-bold mb-1">{p.name}</h3>
              <p className="text-sm text-[#64748b] mb-6">{lang === "en" ? p.desc_en : p.desc_fr}</p>
              <div className="mb-6">
                <span className="price text-5xl font-bold">{p.price}</span>
                <span className="text-[#64748b] ml-2">{lang === "en" ? p.per_en : p.per_fr}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map((f, i) => (
                  <li key={i} className={`flex items-center gap-3 text-sm ${f.on ? "text-[--ink-3]" : "text-slate-400 line-through"}`}>
                    <i className={`fa-solid ${f.on ? "fa-check text-[--brand]" : "fa-xmark"}`} />
                    {lang === "en" ? f.en : f.fr}
                  </li>
                ))}
              </ul>
              <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                className={p.featured ? "btn-brand w-full justify-center" : "btn-outline-dark w-full justify-center"}>
                {t("Get Started", "Commencer")}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
