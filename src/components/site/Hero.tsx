import { useEffect, useState, useMemo } from "react";
import { useLanguage } from "@/lib/language";

const portrait1 = "/hero-portrait.png";
const portrait2 = "/hero-portrait-2.png";

/** Types out `text` one character at a time once `start` is true. */
function useTyped(text: string, start: boolean, speed = 55) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
  }, [text, start]);
  useEffect(() => {
    if (!start || n >= text.length) return;
    const t = setTimeout(() => setN((v) => v + 1), speed);
    return () => clearTimeout(t);
  }, [n, start, text, speed]);
  return { shown: text.slice(0, n), done: start && n >= text.length };
}

const socials = [
  { i: "fa-instagram", href: "https://www.instagram.com/salahjuniordev?igsh=MWM2bW9xdmYzNWc2dg==", label: "Instagram" },
  { i: "fa-facebook-f", href: "https://www.facebook.com/profile.php?id=61586199631543", label: "Facebook" },
  { i: "fa-linkedin-in", href: "https://www.linkedin.com/in/salah-junior-987684398", label: "LinkedIn" },
  { i: "fa-github", href: "https://github.com/salahjuniordev", label: "GitHub" },
  { i: "fa-whatsapp", href: "https://wa.me/qr/T7MI47J4OXDWK1", label: "WhatsApp" },
];

const stack = [
  { src: "https://cdn.simpleicons.org/react/61DAFB", alt: "React" },
  { src: "https://cdn.simpleicons.org/nextdotjs/000000", alt: "Next.js" },
  { src: "https://cdn.simpleicons.org/javascript/F7DF1E", alt: "JavaScript" },
  { src: "https://cdn.simpleicons.org/mongodb/47A248", alt: "MongoDB" },
  { src: "https://cdn.simpleicons.org/tailwindcss/06B6D4", alt: "Tailwind CSS" },
];

export function Hero() {
  const { t } = useLanguage();
  const images = useMemo(() => [portrait1, portrait2], []);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images]);

  const greeting = t("Hello, I'm", "Bonjour, je suis");
  const name = "SalahJuniorDev";
  const bio = t(
    "I build modern, scalable, and user-friendly digital solutions that help brands and businesses grow in the digital world.",
    "Je crée des solutions digitales modernes, évolutives et intuitives qui aident les marques et les entreprises à grandir dans le monde digital.",
  );

  const [started, setStarted] = useState(false);
  useEffect(() => {
    const t0 = setTimeout(() => setStarted(true), 500);
    return () => clearTimeout(t0);
  }, []);

  const g = useTyped(greeting, started, 60);
  const nm = useTyped(name, g.done, 70);
  
  // Only use typewriter for top 3 lines on mobile to save vertical space/time if needed,
  // but let's keep it for bio too, just ensure it doesn't break layout.
  const bi = useTyped(bio, nm.done, 16);

  return (
    <header id="home" className="hero-v2">
      <div className="hero-v2-word" aria-hidden="true">
        DEVELOPER
      </div>

      <div className="hero-v2-inner">
        <div className="hero-v2-copy">
          <p className="hero-v2-hello">
            {g.shown}
            {!g.done && <span className="typed-cursor" />}
          </p>

          <h1 className="hero-v2-name">
            {nm.shown}
            {g.done && !nm.done && <span className="typed-cursor" />}
          </h1>

          <p className={`hero-v2-role ${nm.done ? "is-in" : ""}`}>
            {t("Full-Stack Developer & Digital Creator", "Développeur Full-Stack & Créateur Digital")}
          </p>

          <p className="hero-v2-bio">
            {bi.shown}
            {nm.done && !bi.done && <span className="typed-cursor" />}
          </p>

          <div className={`hero-v2-actions ${bi.done ? "is-in" : ""}`}>
            <a href="#portfolio" className="hero-v2-btn hero-v2-btn-primary">
              {t("View My Work", "Voir Mes Travaux")}
              <i className="fas fa-arrow-right" aria-hidden="true" />
            </a>
            <a href="/assets/my-resume.pdf" target="_blank" rel="noreferrer" className="hero-v2-btn hero-v2-btn-ghost">
              <i className="fas fa-download" aria-hidden="true" />
              {t("Download CV", "Télécharger CV")}
            </a>
          </div>


          <ul className={`hero-v2-stack ${bi.done ? "is-in" : ""}`}>
            {stack.map((s, i) => (
              <li key={s.alt} style={{ transitionDelay: `${120 * i}ms` }}>
                <img src={s.src} alt={s.alt} width={28} height={28} loading="lazy" decoding="async" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {images.map((img, index) => (
        <picture key={img} className={`hero-v2-portrait ${index === currentImageIndex ? "active" : ""}`}>
          <source srcSet={`${img}?w=1200&q=85 1x, ${img}?w=2400&q=85 2x`} />
          <img
            src={img}
            alt="Salah Junior, full-stack developer"
            width={1920}
            height={1080}
            fetchPriority={index === 0 ? "high" : "low"}
            decoding="async"
          />
        </picture>
      ))}

      <nav className={`hero-v2-social ${started ? "is-in" : ""}`} aria-label="Social profiles">
        {socials.map((s, i) => (
          <a
            key={s.i}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={s.label}
            style={{ transitionDelay: `${900 + 120 * i}ms` }}
          >
            <i className={`fab ${s.i}`} aria-hidden="true" />
          </a>
        ))}
      </nav>
    </header>
  );
}
