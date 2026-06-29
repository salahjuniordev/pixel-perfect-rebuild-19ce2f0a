import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language";

const words = {
  en: ["Salah Junior", "a Web Developer", "a Graphic Designer", "a UI/UX Designer", "an Office Administrator"],
  fr: ["Salah Junior", "Développeur Web", "Designer Graphique", "Designer UI/UX", "Administrateur Bureau"],
};

function Typewriter() {
  const { lang } = useLanguage();
  const [idx, setIdx] = useState(0);
  const [sub, setSub] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const list = words[lang];

  useEffect(() => { setIdx(0); setSub(0); setDeleting(false); }, [lang]);

  useEffect(() => {
    const current = list[idx % list.length];
    if (!deleting && sub === current.length) {
      const t = setTimeout(() => setDeleting(true), 1400);
      return () => clearTimeout(t);
    }
    if (deleting && sub === 0) {
      setDeleting(false);
      setIdx((idx + 1) % list.length);
      return;
    }
    const t = setTimeout(() => setSub(sub + (deleting ? -1 : 1)), deleting ? 50 : 90);
    return () => clearTimeout(t);
  }, [sub, deleting, idx, list]);

  const current = list[idx % list.length];
  return (
    <span style={{ color: "#0ea5e9" }}>
      {current.substring(0, sub)}
      <span className="typed-cursor" />
    </span>
  );
}

const socials = [
  { i: "fa-facebook-f", href: "https://www.facebook.com/profile.php?id=61586199631543" },
  { i: "fa-github", href: "https://github.com/salahjuniordev" },
  { i: "fa-linkedin-in", href: "https://www.linkedin.com/in/salah-junior-987684398" },
  { i: "fa-whatsapp", href: "https://wa.me/qr/T7MI47J4OXDWK1" },
  { i: "fa-instagram", href: "https://www.instagram.com/salahjuniordev?igsh=MWM2bW9xdmYzNWc2dg==" },
];

export function Hero() {
  const { t } = useLanguage();
  return (
    <header id="home" className="hero-bg">
      <div className="container-sj relative z-10 py-32 md:py-40">
        <h6 className="text-[--brand] text-sm uppercase tracking-[0.4em] font-medium mb-4">{t("Welcome", "Bienvenue")}</h6>
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
          <span>{t("I Am ", "Je Suis ")}</span>
          <Typewriter />
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mb-10">
          {t(
            "Turning ideas into digital reality , Frontend | Backend | Fullstack Magic .",
            "Transformer les idées en réalité digitale , Frontend | Backend | Magie Fullstack ."
          )}
        </p>
        <div className="flex flex-wrap items-center gap-6 mb-10">
          <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }} className="btn-brand">
            {t("Contact Me", "Contactez-Moi")}
          </a>
        </div>
        <div className="hero-social">
          {socials.map((s) => (
            <a key={s.i} href={s.href} target="_blank" rel="noreferrer" aria-label={s.i}>
              <i className={`fa-brands ${s.i}`} />
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
