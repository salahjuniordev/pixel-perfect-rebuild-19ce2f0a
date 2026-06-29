import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/language";

export const blogPosts = [
  {
    slug: "how-i-build-full-stack-apps-for-african-clients",
    tag: "Web Development",
    title_en: "How I Build Full-Stack Apps for African Clients",
    title_fr: "Comment je construis des applications full-stack pour des clients africains",
    excerpt_en: "A behind-the-scenes look at my workflow: from client brief to deployed product — how I move fast, stay organized, and deliver clean full-stack builds without cutting corners.",
    excerpt_fr: "Coulisses de mon flux de travail : du brief client au produit déployé — comment je vais vite, reste organisé et livre des builds propres.",
    date: "March 20, 2026",
    read: "5 min read",
    img: "https://res.cloudinary.com/drmamswdc/image/upload/v1779906618/file_000000006c9071f483845b7f26fe30a7_jimvds.png",
  },
  {
    slug: "dark-mode-ui-african-saas",
    tag: "UI/UX Design",
    title_en: "Dark Mode UI: Why African SaaS Products Should Embrace It",
    title_fr: "Dark Mode UI : pourquoi les produits SaaS africains devraient l'adopter",
    excerpt_en: "Dark themes reduce eye strain under harsh lighting, save battery on OLED displays, and signal premium quality. Here is how to do it right.",
    excerpt_fr: "Les thèmes sombres réduisent la fatigue oculaire et économisent la batterie sur les OLED. Voici comment bien faire.",
    date: "February 14, 2026",
    read: "4 min read",
    img: "https://res.cloudinary.com/drmamswdc/image/upload/v1779906593/file_000000000dd471f494e7cd37eaac79a4_zt1xsn.png",
  },
  {
    slug: "building-ai-marketing-saas-cosmetics-cameroon",
    tag: "AI & Tools",
    title_en: "Building an AI Marketing SaaS for a Cosmetics Brand in Cameroon",
    title_fr: "Construire un SaaS marketing IA pour une marque de cosmétiques au Cameroun",
    excerpt_en: "From fal.ai image generation to Google Gemini captions, I walk through the full stack behind Maney Cosmetics AI Studio — and what I learned building it.",
    excerpt_fr: "De la génération d'images fal.ai aux légendes Google Gemini, je détaille la stack derrière Maney Cosmetics AI Studio.",
    date: "January 5, 2026",
    read: "7 min read",
    img: "https://res.cloudinary.com/drmamswdc/image/upload/v1779906593/file_00000000b818720aafa06ee3cd5def66_xvmwwa.png",
  },
];

export function Blog() {
  const { t, lang } = useLanguage();
  return (
    <section id="blog" className="section-padding bg-[#0a1120]">
      <div className="container-sj">
        <div className="sec-head text-center mb-14">
          <h6>{t("Blog", "Blog")}</h6>
          <h2>{t("Latest Articles", "Derniers Articles")}</h2>
          <div className="underline" />
          <p>{t("Thoughts on dev, design, and building products in Africa", "Réflexions sur le dev, le design et la construction de produits en Afrique")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((p) => (
            <article key={p.slug} className="card-dark !p-0 overflow-hidden flex flex-col">
              <img src={p.img} alt={lang === "en" ? p.title_en : p.title_fr} className="w-full aspect-video object-cover" />
              <div className="p-6 flex flex-col flex-1">
                <span className="inline-block text-xs text-[--brand] uppercase tracking-wider mb-3">{p.tag}</span>
                <h4 className="text-lg font-bold text-white mb-3 leading-snug">{lang === "en" ? p.title_en : p.title_fr}</h4>
                <p className="text-sm text-slate-400 mb-5 flex-1">{lang === "en" ? p.excerpt_en : p.excerpt_fr}</p>
                <div className="text-xs text-slate-500 flex items-center gap-3 mb-4">
                  <span><i className="fa-regular fa-calendar mr-1" />{p.date}</span>
                  <span><i className="fa-regular fa-clock mr-1" />{p.read}</span>
                </div>
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="btn-brand !py-2.5 !px-5 text-sm self-start">
                  {t("Read Article", "Lire l'Article")} <i className="fa-solid fa-arrow-right" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
