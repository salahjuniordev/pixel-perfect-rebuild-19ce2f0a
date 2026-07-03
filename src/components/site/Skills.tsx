import { useLanguage } from "@/lib/language";

const devicon = (name: string) => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}`;

const webTech: Array<{ label: string; src?: string; badge?: string; bg?: string; color?: string }> = [
  { label: "HTML5", src: devicon("html5/html5-original.svg") },
  { label: "CSS3", src: devicon("css3/css3-original.svg") },
  { label: "JavaScript", badge: "JS", bg: "#f7df1e", color: "#000" },
  { label: "React", src: devicon("react/react-original.svg") },
  { label: "Next.js", badge: "N", bg: "#000", color: "#fff" },
  { label: "Tailwind CSS", src: devicon("tailwindcss/tailwindcss-original.svg") },
  { label: "Node Js", src: devicon("nodejs/nodejs-original.svg") },
  { label: "Express.js", badge: "eX", bg: "rgba(255,255,255,0.15)", color: "#fff" },
  { label: "MongoDB", src: devicon("mongodb/mongodb-original.svg") },
  { label: "Git", src: devicon("git/git-original.svg") },
  { label: "GitHub", src: devicon("github/github-original.svg") },
  { label: "Figma", src: devicon("figma/figma-original.svg") },
];

export function Skills() {
  const { t } = useLanguage();
  return (
    <section className="section-padding bg-[#0b1223]">
      <div className="container-sj">
        <div className="skills-head">
          <h2 className="skills-title">{t("My Skills", "Mes Compétences")}</h2>
          <span className="skills-underline" />
          <p className="skills-sub">{t("Technologies and tools I work with to bring ideas to life.", "Technologies et outils avec lesquels je travaille pour donner vie aux idées.")}</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Web Development */}
          <div className="card-blue">
            <h3 className="text-2xl font-bold mb-2">{t("Web Development", "Développement Web")}</h3>
            <p className="text-white/85 mb-6">
              {t("Building responsive, fast, and scalable websites and web applications.", "Création de sites web et d'applications réactifs, rapides et évolutifs.")}
            </p>
            <div className="grid grid-cols-3 gap-4">
              {webTech.map((x) => (
                <div key={x.label} className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
                  <div className="tech-badge" style={x.badge ? { background: x.bg, color: x.color } : undefined}>
                    {x.src ? <img src={x.src} alt={x.label} /> : x.badge}
                  </div>
                  <span className="text-sm font-medium text-white">{x.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* UI/UX */}
            <div className="card-dark">
              <h4 className="text-xl font-bold text-white mb-2">{t("UI/UX Design", "Design UI/UX")}</h4>
              <p className="text-slate-400 mb-4">
                {t("Designing intuitive and engaging user experiences that are both beautiful and functional.", "Concevoir des expériences utilisateur intuitives et engageantes à la fois belles et fonctionnelles.")}
              </p>
              <ul className="grid grid-cols-2 gap-2 text-sm text-slate-200">
                {["User Research", "Wireframing", "Prototyping", "Interaction Design", "Usability Testing"].map((u) => (
                  <li key={u} className="flex items-center gap-2"><i className="fa-solid fa-check text-[--brand] text-xs" />{u}</li>
                ))}
              </ul>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="card-dark !p-5">
                <h5 className="font-bold text-white mb-2">{t("Graphic Design", "Design Graphique")}</h5>
                <p className="text-xs text-slate-400 mb-3">{t("Creating visual content that communicates messages and builds strong brand identity.", "Création de contenu visuel qui communique et bâtit une identité de marque forte.")}</p>
                <div className="flex gap-2">
                  <Badge text="Ps" bg="#001e36" border="#31a8ff" />
                  <Badge text="Ai" bg="#1a0900" border="#ff9a00" />
                  <Badge text="Id" bg="#1b0030" border="#ff3d9a" />
                </div>
              </div>
              <div className="card-blue !p-5">
                <h5 className="font-bold mb-2">CMS</h5>
                <p className="text-xs text-white/85 mb-3">{t("Building and managing dynamic websites with powerful CMS platforms.", "Construction et gestion de sites dynamiques avec de puissantes plateformes CMS.")}</p>
                <div className="flex gap-2">
                  <div className="tech-badge"><img src={devicon("wordpress/wordpress-original.svg")} alt="WordPress" /></div>
                  <Badge text="WIX" bg="#0C6EFC" border="#0C6EFC" />
                </div>
              </div>
              <div className="card-dark !p-5">
                <h5 className="font-bold text-white mb-2">Microsoft Office</h5>
                <p className="text-xs text-slate-400 mb-3">{t("Productive and efficient in creating documents, presentations, and spreadsheets.", "Productif dans la création de documents, présentations et tableurs.")}</p>
                <div className="flex gap-2">
                  <Badge text="W" bg="#2B579A" border="#2B579A" />
                  <Badge text="X" bg="#1E7145" border="#1E7145" />
                  <Badge text="P" bg="#C43E1C" border="#C43E1C" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ text, bg, border }: { text: string; bg: string; border: string }) {
  return (
    <div className="tech-badge" style={{ background: bg, border: `2px solid ${border}`, color: "#fff" }}>{text}</div>
  );
}
