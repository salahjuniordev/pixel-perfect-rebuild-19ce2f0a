import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useLanguage } from "@/lib/language";

const links = [
  { id: "home", en: "Home", fr: "Accueil" },
  { id: "about", en: "About", fr: "À Propos", href: "/about" },
  { id: "services", en: "Services", fr: "Services" },
  { id: "portfolio", en: "Portfolio", fr: "Portfolio" },
  { id: "testimonials", en: "Reviews", fr: "Avis" },
  { id: "blog", en: "Blog", fr: "Blog" },
  { id: "contact", en: "Contact", fr: "Contact" },
];

export function Navbar() {
  const navigate = useNavigate();
  const loc = useLocation();
  const { lang, toggle, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() =>
    typeof window !== "undefined" && window.location.pathname === "/about" ? "about" : "home"
  );

  useEffect(() => {
    const onScroll = () => {
      const sections = links.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
      const y = window.scrollY + 120;
      for (const s of sections) {
        if (s.offsetTop <= y && s.offsetTop + s.offsetHeight > y) {
          setActive(s.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: "smooth" });
    } else {
      window.location.href = `/#${id}`;
    }
    setOpen(false);
  };

  const goAbout = () => {
    setOpen(false);
    navigate({ to: "/about" });
  };

  return (
    <nav className="nav-shell" aria-label={t("Main", "Principal")}>
      <div className="container-sj flex items-center justify-between py-4">
        <a href="/#home" onClick={(e) => { e.preventDefault(); go("home"); }} className="flex items-center shrink-0">
          <img src="/logo.png" alt="Salah Junior Dev" width={42} height={42} decoding="async" className="site-logo md:w-14 md:h-14" />
        </a>
        <div className={`${open ? "flex" : "hidden"} md:flex flex-col md:flex-row md:items-center md:gap-1 absolute md:static left-2 right-2 top-[calc(100%+8px)] md:top-auto bg-[#07101f]/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-0 border md:border-0 border-white/10 rounded-2xl md:rounded-none py-4 md:py-0 px-6 md:px-0 shadow-xl md:shadow-none`}>
          {links.map((l) =>
            l.href ? (
              <a
                key={l.id}
                href={l.href}
                onClick={(e) => { e.preventDefault(); goAbout(); }}
                className={`nav-link ${active === l.id ? "active" : ""}`}
              >
                {t(l.en, l.fr)}
              </a>
            ) : (
              <a
                key={l.id}
                href={`/#${l.id}`}
                onClick={(e) => { e.preventDefault(); go(l.id); }}
                className={`nav-link ${active === l.id ? "active" : ""}`}
              >
                {t(l.en, l.fr)}
              </a>
            )
          )}
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/start"
            onClick={(e) => { e.preventDefault(); navigate({ to: "/start", search: { service: undefined } }); }}
            className={`hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              loc.pathname === "/start"
                ? "bg-[var(--brand-ink)] text-white"
                : "bg-[var(--brand)] text-[var(--ink)] hover:bg-[var(--brand-ink)] hover:text-white hover:-translate-y-0.5"
            }`}
          >
            <i className="fa-solid fa-rocket text-xs" aria-hidden="true" />
            {t("Start a Project", "Démarrer un Projet")}
          </a>
          <button onClick={toggle} className="lang-toggle" aria-label="Toggle language" title={lang === "en" ? "Switch to French" : "Passer en anglais"}>
            <span className={`lang-seg ${lang === "en" ? "active" : ""}`}>EN</span>
            <span className={`lang-seg ${lang === "fr" ? "active" : ""}`}>FR</span>
          </button>
          <button aria-label={t("Toggle menu", "Ouvrir le menu")}
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 p-2 bg-[#07101f] rounded-lg"
          >
            <span className="w-6 h-0.5 bg-white rounded-full" />
            <span className="w-6 h-0.5 bg-white rounded-full" />
          </button>
        </div>
      </div>
    </nav>
  );
}
