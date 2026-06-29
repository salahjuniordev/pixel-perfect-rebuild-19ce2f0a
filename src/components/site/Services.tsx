import { useLanguage } from "@/lib/language";

const services = [
  { en: "Web Development", fr: "Développement Web", desc_en: "Building robust, scalable, and high-performance websites tailored to your business needs using modern technologies.", desc_fr: "Création de sites web robustes, évolutifs et performants adaptés aux besoins de votre entreprise avec les technologies modernes.", img: "/img/svg/monitor-with-html-css.svg", alt: "Web Development Service" },
  { en: "Graphics Design", fr: "Design Graphique", desc_en: "Creating compelling visual identities and marketing materials that resonate with your target audience and elevate your brand.", desc_fr: "Créer des identités visuelles convaincantes et des supports marketing qui résonnent avec votre public.", img: "/img/svg/graphic-design.svg", alt: "Graphics Design Service" },
  { en: "SEO Optimization", fr: "Optimisation SEO", desc_en: "Enhancing your digital presence through strategic search engine optimization to drive organic traffic and improve rankings.", desc_fr: "Améliorer votre présence numérique grâce à une optimisation stratégique pour les moteurs de recherche.", img: "/img/svg/seo.webp", alt: "SEO Optimization Service" },
  { en: "UI/UX Design", fr: "Design UI/UX", desc_en: "Designing intuitive and engaging user interfaces that provide seamless experiences across all digital platforms.", desc_fr: "Concevoir des interfaces utilisateur intuitives et engageantes pour toutes les plateformes numériques.", img: "/img/svg/ui-ux-web-design-concept.jpg", alt: "UI/UX Design Service" },
  { en: "Identity-Branding", fr: "Identité & Branding", desc_en: "Developing cohesive brand strategies and visual systems that define your unique value proposition in the market.", desc_fr: "Développer des stratégies de marque cohérentes et des systèmes visuels qui définissent votre proposition de valeur.", img: "/img/svg/digital-marketing-illustrations.jpg", alt: "Identity Branding Service" },
  { en: "Web Security", fr: "Sécurité Web", desc_en: "Implementing advanced security protocols to protect your digital assets and ensure a safe environment for your users.", desc_fr: "Mettre en œuvre des protocoles de sécurité avancés pour protéger vos actifs numériques.", img: "/img/svg/cyber-security-shield-icon.jpg", alt: "Web Security Service" },
];

export function Services() {
  const { t, lang } = useLanguage();
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
            <div key={s.en} className="service-card">
              <img src={s.img} alt={s.alt} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <h6 className="text-xl font-bold text-white mb-3">{lang === "en" ? s.en : s.fr}</h6>
              <p className="text-sm text-slate-400 leading-relaxed">{lang === "en" ? s.desc_en : s.desc_fr}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
