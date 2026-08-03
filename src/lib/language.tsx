import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "fr";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; toggle: () => void; t: <T>(en: T, fr: T) => T };

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    try {
      const param = new URLSearchParams(window.location.search).get("lang");
      if (param === "en" || param === "fr") {
        setLang(param);
        return;
      }
      const saved = localStorage.getItem("sj-lang") as Lang | null;
      if (saved === "en" || saved === "fr") setLang(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("sj-lang", lang); } catch {}
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);
  const value: Ctx = {
    lang,
    setLang,
    toggle: () => setLang(lang === "en" ? "fr" : "en"),
    t: (en, fr) => (lang === "en" ? en : fr),
  };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be inside LanguageProvider");
  return ctx;
}
