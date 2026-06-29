import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/language";

const quick = [
  { id: "home", en: "Home", fr: "Accueil" },
  { id: "about", en: "About Me", fr: "À Propos" },
  { id: "services", en: "Services", fr: "Services" },
  { id: "portfolio", en: "Portfolio", fr: "Portfolio" },
  { id: "testimonials", en: "Reviews", fr: "Avis" },
  { id: "blog", en: "Blog", fr: "Blog" },
  { id: "contact", en: "Contact", fr: "Contact" },
];

const legal = [
  { to: "/faq", label: "FAQs" },
  { to: "/license-copyright", label: "License & Copyright" },
  { to: "/refund-policy", label: "Refund Policy" },
  { to: "/terms-conditions", label: "Terms & Conditions" },
];

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#070d1a] pt-20 pb-8 border-t border-white/5">
      <div className="container-sj grid lg:grid-cols-3 gap-10">
        <div>
          <a href="/#home" className="inline-flex items-center gap-3 mb-5">
            <img src="/img/fav-icon/favicon.png" alt="SalahJuniorDev Logo" className="w-16 h-16 rounded-full" />
          </a>
          <p className="text-sm text-slate-400 leading-relaxed mb-5">
            {t(
              "Turning ideas into digital reality — crafting responsive websites, polished interfaces, and memorable brand identities from Yaoundé, Cameroon.",
              "Transformer les idées en réalité digitale — créer des sites réactifs, des interfaces soignées et des identités de marque mémorables depuis Yaoundé, Cameroun."
            )}
          </p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><i className="fa-solid fa-mobile-screen text-[--brand] mr-2" /><a href="tel:+237683693011">+237 683 693 011</a></li>
            <li><i className="fa-solid fa-envelope text-[--brand] mr-2" /><a href="mailto:salahjuniorncham@gmail.com">salahjuniorncham@gmail.com</a></li>
            <li><i className="fa-solid fa-location-dot text-[--brand] mr-2" />Emana, Yaoundé, CMR</li>
          </ul>
        </div>
        <div>
          <h6 className="text-white font-bold mb-5">{t("Quick Links", "Liens Rapides")}</h6>
          <ul className="grid grid-cols-2 gap-2 text-sm text-slate-300">
            {quick.map((l) => (
              <li key={l.id}>
                <a href={`/#${l.id}`} className="hover:text-[--brand] inline-flex items-center gap-2">
                  <i className="fa-solid fa-angle-right text-[--brand] text-xs" />{t(l.en, l.fr)}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h6 className="text-white font-bold mb-5">{t("Legal & Policies", "Légal & Politiques")}</h6>
          <ul className="space-y-2 text-sm text-slate-300">
            {legal.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-[--brand] inline-flex items-center gap-2">
                  <i className="fa-solid fa-angle-right text-[--brand] text-xs" />{l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container-sj mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {[
            { i: "fa-facebook-f", url: "https://www.facebook.com/profile.php?id=61586199631543" },
            { i: "fa-github", url: "https://github.com/salahjuniordev" },
            { i: "fa-linkedin-in", url: "https://www.linkedin.com/in/salah-junior-987684398/" },
            { i: "fa-whatsapp", url: "https://wa.me/qr/T7MI47J4OXDWK1" },
            { i: "fa-instagram", url: "https://www.instagram.com/xeoncore2/" },
          ].map((s) => (
            <a key={s.i} href={s.url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full grid place-items-center border border-white/15 text-slate-300 hover:bg-[--brand] hover:text-white hover:border-[--brand] transition">
              <i className={`fa-brands ${s.i} text-xs`} />
            </a>
          ))}
        </div>
        <p className="text-xs text-slate-400">© 2026 <span className="text-white font-semibold">Salah Junior</span>. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
