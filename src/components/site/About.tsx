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
    <section id="about" className="section-padding bg-white-sec">
      <div className="container-sj grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5">
          <div className="about-img-wrap">
            <img
              src="https://res.cloudinary.com/drmamswdc/image/upload/v1777468680/file_00000000cc7c720eb597618058b38454_kptzwi.png"
              alt="Salah Junior – Full-Stack Web Developer and UI/UX Designer based in Yaoundé Cameroon"
            />
          </div>
        </div>
        <div className="lg:col-span-7">
          <h3 className="text-[--brand] text-sm font-medium mb-3">{t("Hello, my name is", "Bonjour, je m'appelle")}</h3>
          <h2 className="text-4xl md:text-5xl font-bold text-[--ink] mb-3">Salah Junior</h2>
          <h4 className="text-xl text-[--ink-3] font-medium mb-6">
            {t("Web Developer And Graphic Designer", "Développeur Web et Designer Graphique")}
          </h4>
          <p className="text-[#64748b] mb-8 leading-relaxed">
            {t(
              "I'm Salah Junior — a full-stack developer and designer based in Yaoundé, Cameroon. I started building websites at 17, and what began as curiosity quickly became a craft. Three years later, I've worked with NGOs, logistics companies, and brands across Central Africa — turning ideas into digital products that actually work. I don't just write code. I think about the person on the other side of the screen.",
              "Je suis Salah Junior — développeur full-stack et designer basé à Yaoundé, au Cameroun. J'ai commencé à créer des sites web à 17 ans, et ce qui n'était qu'une curiosité est vite devenu un véritable métier. Trois ans plus tard, j'ai travaillé avec des ONG, des entreprises logistiques et des marques à travers l'Afrique Centrale — transformant des idées en produits numériques qui fonctionnent vraiment."
            )}
          </p>
          <div className="grid sm:grid-cols-2 gap-5 mb-8 pt-6 border-t border-[--line]">
            <Info label={t("My Name", "Mon Nom")} value="Salah Junior" icon="fa-user" />
            <Info label="Email" value="salahjuniorncham@gmail.com" icon="fa-envelope" href="mailto:salahjuniorncham@gmail.com" />
            <Info label={t("Address", "Adresse")} value="Emana, Yaoundé, CMR" icon="fa-location-dot" />
            <Info label={t("Date Of Birth", "Date de Naissance")} value="XXXX" icon="fa-crown" />
          </div>
          <div className="flex flex-wrap gap-4 mb-10">
            <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }} className="btn-dark">
              {t("Contact Me", "Contactez-Moi")}
            </a>
            <a href="/assets/my-resume.pdf" target="_blank" rel="noreferrer" className="btn-outline-dark">
              {t("My Resume", "Mon CV")}
            </a>
          </div>
          <h6 className="text-[--brand] text-xs uppercase tracking-[0.3em] mb-4 font-semibold">{t("My Interests", "Mes Intérêts")}</h6>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {interests.map((x) => (
              <div key={x.i} className="interest-card">
                <i className={`fa-solid ${x.i} text-[--brand] text-2xl mb-2`} />
                <div className="text-xs font-semibold tracking-wider text-[--ink]">{x.en}</div>
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
    <div className="about-info-row">
      <span className="icon"><i className={`fa-solid ${icon}`} /></span>
      <div>
        <span className="label">{label}</span>
        <span className="value">{value}</span>
      </div>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}
