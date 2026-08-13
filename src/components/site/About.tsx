import { useLanguage } from "@/lib/language";

const portrait1 = "/assets/hero/hero-mobile-1.webp";
const portrait2 = "/assets/hero/hero-mobile-2.webp";

const interests = [
  { i: "fa-gamepad", en: "GAMING", fr: "JEU VIDÉO" },
  { i: "fa-code", en: "CODING", fr: "PROGRAMMATION" },
  { i: "fa-music", en: "MUSIC", fr: "MUSIQUE" },
  { i: "fa-video", en: "ANIME", fr: "ANIMÉ" },
];

export function About() {
  const { t } = useLanguage();
  return (
    <section id="about" className="about-section">
      <div className="about-dots-tl" aria-hidden />
      <div className="about-dots-br" aria-hidden />
      <div className="container-sj grid lg:grid-cols-12 gap-14 items-center relative">
        {/* Portrait with L-frame */}
        <div className="lg:col-span-5">
          <div className="about-portrait">
            <span className="about-frame" aria-hidden />
            <div className="about-flip">
              <div className="about-flip-inner">
                <div className="about-flip-face">
                  <img
                    src={portrait1}
                    alt="Salah Junior – Full-Stack Web Developer and UI/UX Designer based in Yaoundé Cameroon"
                    width={760}
                    height={950}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="about-flip-face about-flip-back">
                  <img
                    src={portrait2}
                    alt="Salah Junior – Web Developer and Graphic Designer portrait"
                    width={760}
                    height={950}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="lg:col-span-7">
          <h2 className="about-title">{t("About Me", "À Propos de Moi")}</h2>
          <p className="about-subtitle">
            {t("Web Developer And Graphic Designer", "Développeur Web et Designer Graphique")}
          </p>
          <p className="about-lead">
            {t(
              "I'm Salah Junior — a full-stack developer and designer based in Yaoundé, Cameroon. I started building websites at 17, and what began as curiosity quickly became a craft. Three years later, I've worked with NGOs, logistics companies, and brands across Central Africa — turning ideas into digital products that actually work. I don't just write code. I think about the person on the other side of the screen.",
              "Je suis Salah Junior, développeur full-stack et designer basé à Yaoundé, au Cameroun. Tout a commencé à 17 ans par pure curiosité pour le code.\n\nTrois ans plus tard, cette curiosité est devenue un vrai métier : j'accompagne aujourd'hui des ONG, des entreprises logistiques et des marques à travers l'Afrique Centrale, en transformant leurs idées en produits numériques qui fonctionnent vraiment. Je ne me contente pas d'écrire du code : je pense toujours à la personne qui se trouve de l'autre côté de l'écran."
            )}
          </p>

          <div className="about-divider" />

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7 mb-9">
            <Info label={t("MY NAME :", "MON NOM :")} value="Salah Junior" icon="fa-user" />
            <Info label={t("ADDRESS :", "ADRESSE :")} value="Emana,Yaounde,CMR" icon="fa-location-dot" />
            <Info label={t("EMAIL :", "E-MAIL :")} value="salahjuniorncham@gmail.com" icon="fa-envelope" href="mailto:salahjuniorncham@gmail.com" />
            <Info label={t("DATE OF BIRTH :", "DATE DE NAISSANCE :")} value="XXXX" icon="fa-crown" />
          </div>

          <div className="flex flex-wrap gap-4 mb-10">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="about-btn about-btn-primary"
            >
              {t("Contact Me", "Contactez-Moi")}
            </a>
            <a href="/assets/my-resume.pdf" target="_blank" rel="noreferrer" className="about-btn about-btn-primary">
              {t("My Resume", "Mon CV")}
            </a>
          </div>

          <h3 className="about-interests-title">{t("My Interests", "Mes Intérêts")}</h3>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {interests.map((x) => (
              <div key={x.i} className="about-interest">
                <span className="about-interest-icon">
                  <i className={`fa-solid ${x.i}`} />
                </span>
                <span className="about-interest-label">{t(x.en, x.fr)}</span>
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
    <div className="about-info">
      <div className="about-info-head">
        <span className="about-info-icon">
          <i className={`fa-solid ${icon}`} />
        </span>
        <span className="about-info-label">{label}</span>
      </div>
      <div className="about-info-value">{value}</div>
    </div>
  );
  return href ? (
    <a href={href} className="block hover:text-[--brand] transition-colors">
      {content}
    </a>
  ) : (
    content
  );
}
