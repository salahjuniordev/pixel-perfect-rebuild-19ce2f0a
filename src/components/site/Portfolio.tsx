import { useLanguage } from "@/lib/language";

const projects = [
  { title: "Genjutsu Studio", img: "https://res.cloudinary.com/drmamswdc/image/upload/v1777478691/Screenshot_2026-04-29_090314_frpcgx.png", url: "https://genjutsu-eight.vercel.app/" },
  { title: "HighUp Web Academy", img: "https://res.cloudinary.com/drmamswdc/image/upload/v1777479079/highupwebacademyregistration_magspf.png", url: "https://highupwebacademyregistration.vercel.app/" },
  { title: "Portfolio Website", img: "https://res.cloudinary.com/drmamswdc/image/upload/v1777480040/Damilola-John_kzf4q4.png", url: "https://damilolajohn-iota.vercel.app/" },
  { title: "L'Ours Blanc Max Clean Pressing", img: "https://res.cloudinary.com/drmamswdc/image/upload/v1777479826/L_Ours_Blanc_Max_Clean_Pressing_i1fhex.png", url: "https://loursblancmaxcleanpressing.vercel.app/" },
  { title: "Portfolio Website", img: "/img/portfolio/moses-omaye.png", url: "https://mosesomaye.netlify.app/" },
  { title: "Minader Cameroon", img: "https://res.cloudinary.com/drmamswdc/image/upload/v1777478241/Screenshot_2026-04-29_085241_qfdm9c.png", url: "https://minadarcm.vercel.app/?prac_n=16" },
];

export function Portfolio() {
  const { t } = useLanguage();
  return (
    <section id="portfolio" className="section-padding bg-[#0a1120]">
      <div className="container-sj">
        <div className="sec-head text-center mb-14">
          <h6>{t("Portfolio", "Portfolio")}</h6>
          <h2>{t("My Projects", "Mes Projets")}</h2>
          <div className="underline" />
          <p>{t("A selection of work I'm proud of", "Une sélection de travaux dont je suis fier")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <a key={i} href={p.url} target="_blank" rel="noreferrer" className="portfolio-card group">
              <img src={p.img} alt={p.title} />
              <div className="portfolio-overlay">
                <span className="text-xs text-[--brand] uppercase tracking-wider mb-1">Web Development</span>
                <h4 className="text-white font-bold text-lg mb-3">{p.title}</h4>
                <span className="text-sm text-slate-300 inline-flex items-center gap-2">
                  {t("View Project", "Voir le Projet")} <i className="fa-solid fa-arrow-right" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
