import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language";

const links = [
  { id: "home", en: "Home", fr: "Accueil" },
  { id: "about", en: "About", fr: "À Propos" },
  { id: "services", en: "Services", fr: "Services" },
  { id: "portfolio", en: "Portfolio", fr: "Portfolio" },
  { id: "testimonials", en: "Reviews", fr: "Avis" },
  { id: "blog", en: "Blog", fr: "Blog" },
  { id: "contact", en: "Contact", fr: "Contact" },
];

export function Navbar() {
  const { lang, toggle, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

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

  return (
    <nav className="nav-shell">
      <div className="container-sj flex items-center justify-between py-4">
        <a href="/#home" onClick={(e) => { e.preventDefault(); go("home"); }} className="text-xl font-bold tracking-tight">
          <span className="logo-salah">Salah</span>
          <span className="logo-junior">Junior</span>
          <span className="logo-dev">Dev</span>
        </a>
        <div className={`${open ? "flex" : "hidden"} md:flex flex-col md:flex-row md:items-center md:gap-1 absolute md:static left-2 right-2 top-[calc(100%+8px)] md:top-auto bg-[#0f172a]/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-0 border md:border-0 border-white/10 rounded-2xl md:rounded-none py-4 md:py-0 px-6 md:px-0 shadow-xl md:shadow-none`}>
          {links.map((l) => (
            <a
              key={l.id}
              href={`/#${l.id}`}
              onClick={(e) => { e.preventDefault(); go(l.id); }}
              className={`nav-link ${active === l.id ? "active" : ""}`}
            >
              {t(l.en, l.fr)}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="lang-toggle" aria-label="Toggle language">
            <span className="lang-globe"><i className="fa-solid fa-globe" /></span>
            {lang === "en" ? "FR" : "EN"}
          </button>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            <span className="w-6 h-0.5 bg-white" />
            <span className="w-6 h-0.5 bg-white" />
            <span className="w-6 h-0.5 bg-white" />
          </button>
        </div>
      </div>
    </nav>
  );
}
