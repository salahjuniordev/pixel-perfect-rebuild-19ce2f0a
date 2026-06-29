import { useLanguage } from "@/lib/language";

const interests = [
  { i: "fa-gamepad", en: "GAMING", fr: "JEU VIDÉO" },
  { i: "fa-code", en: "CODING", fr: "PROGRAMMATION" },
  { i: "fa-music", en: "MUSIC", fr: "MUSIQUE" },
  { i: "fa-video", en: "ANIME", fr: "ANIMÉ" },
];

export function About() {
  const { t } = useLanguage();
  return (
    <section id="about" className="section-padding bg-[#0a1120]">
      <div className="container-sj grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5">
          <div className="flip-card">
            <div className="flip-inner">
              <div className="flip-face">
                <img
                  src="https://res.cloudinary.com/drmamswdc/image/upload/v1777468680/file_00000000cc7c720eb597618058b38454_kptzwi.png"
                  alt="Salah Junior – Full-Stack Web Developer and UI/UX Designer based in Yaoundé Cameroon"
                />
              </div>
              <div className="flip-face flip-back">
                <img
                  src="https://res.cloudinary.com/drmamswdc/image/upload/v1777468784/file_00000000ee98722f978579295ecd7e04_dsleyd.png"
                  alt="Salah Junior – Web Developer and Graphic Designer portrait"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <h6 className="text-[--brand] text-xs uppercase tracking-[0.4em] mb-3">{t("About Me", "À Propos de Moi")}</h6>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t("Web Developer And Graphic Designer", "Développeur Web et Designer Graphique")}
          </h2>
          <p className="text-slate-300 mb-8 leading-relaxed">
            {t(
              "I'm Salah Junior — a full-stack developer and designer based in Yaoundé, Cameroon. I started building websites at 17, and what began as curiosity quickly became a craft. Three years later, I've worked with NGOs, logistics companies, and brands across Central Africa — turning ideas into digital products that actually work. I don't just write code. I think about the person on the other side of the screen.",
              "Je suis Salah Junior — développeur full-stack et designer basé à Yaoundé, au Cameroun. J'ai commencé à créer des sites web à 17 ans, et ce qui n'était qu'une curiosité est vite devenu un véritable métier. Trois ans plus tard, j'ai travaillé avec des ONG, des entreprises logistiques et des marques à travers l'Afrique Centrale — transformant des idées en produits numériques qui fonctionnent vraiment. Je ne fais pas que écrire du code. Je pense à la personne de l'autre côté de l'écran."
            )}
          </p>
          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            <Info label={t("My Name :", "Mon Nom :")} value="Salah Junior" icon="fa-user" />
            <Info label={t("Email :", "E-mail :")} value="salahjuniorncham@gmail.com" icon="fa-envelope" href="mailto:salahjuniorncham@gmail.com" />
            <Info label={t("Address :", "Adresse :")} value="Emana,Yaounde,CMR" icon="fa-location-dot" />
            <Info label={t("Date Of Birth :", "Date de Naissance :")} value="XXXX" icon="fa-crown" />
          </div>
          <div className="flex flex-wrap gap-4 mb-10">
            <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }} className="btn-brand">
              <i className="fa-solid fa-paper-plane" /> {t("Contact Me", "Contactez-Moi")}
            </a>
            <a href="/assets/my-resume.pdf" target="_blank" rel="noreferrer" className="btn-outline">
              <i className="fa-solid fa-file-lines" /> {t("My Resume", "Mon CV")}
            </a>
          </div>
          <h6 className="text-[--brand] text-xs uppercase tracking-[0.3em] mb-4">{t("My Interests", "Mes Intérêts")}</h6>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {interests.map((x) => (
              <div key={x.i} className="card-dark text-center !p-4">
                <i className={`fa-solid ${x.i} text-[--brand] text-2xl mb-2`} />
                <div className="text-xs font-semibold tracking-wider text-slate-200">{t(x.en, x.fr)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ label, value, icon, href }: { label: string; value: string; icon: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-3">
      <i className={`fa-solid ${icon} text-[--brand] mt-1`} />
      <div>
        <div className="text-xs text-slate-400 uppercase tracking-wider">{label}</div>
        <div className="text-slate-200">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} className="hover:text-[--brand]">{content}</a> : content;
}
