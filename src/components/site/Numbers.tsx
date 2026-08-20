import { useLanguage } from "@/lib/language";

const stats = [
  { icon: "fa-heart", n: "50+", en: "Happy Clients", fr: "Clients Satisfaits" },
  { icon: "fa-layer-group", n: "25+", en: "Projects Completed", fr: "Projets Réalisés" },
  { icon: "fa-file-arrow-down", n: "70+", en: "Graphics Created", fr: "Visuels Créés" },
  { icon: "fa-shield", n: "90,000+", en: "Lines Of Code", fr: "Lignes de Code" },
];

export function Numbers() {
  const { t } = useLanguage();
  return (
    <section className="numbers-bg" style={{
      backgroundImage: "linear-gradient(rgba(15,23,42,0.92), rgba(15,23,42,0.92)), url('/img/dots.png')",
    }}>
      <div className="container-sj">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-white mb-10">
          {t("By the Numbers", "En Chiffres")}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.icon}>
              <i className={`fa-solid ${s.icon} text-[--brand] text-3xl mb-3`} />
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{s.n}</div>
              <div className="text-sm text-slate-400 uppercase tracking-wider">{t(s.en, s.fr)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
