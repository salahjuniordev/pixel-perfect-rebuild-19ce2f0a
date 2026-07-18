import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/language";
import { useSiteSettings } from "@/lib/site-settings";
import { organizationSchema } from "@/lib/seo-schemas";

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
  const s = useSiteSettings();
  const phone = s?.contact_phone || "+237 683 693 011";
  const email = s?.contact_email || "salahjuniorncham@gmail.com";
  const location = s?.location || "Emana, Yaoundé, CMR";
  const brand = s?.brand_name || "Salah Junior";
  const socials = [
    { i: "fa-facebook-f", url: s?.social_facebook },
    { i: "fa-github", url: s?.social_github },
    { i: "fa-linkedin-in", url: s?.social_linkedin },
    { i: "fa-whatsapp", url: s?.whatsapp_number ? `https://wa.me/${s.whatsapp_number.replace(/[^0-9]/g, "")}` : null },
    { i: "fa-instagram", url: s?.social_instagram },
    { i: "fa-twitter", url: s?.social_twitter },
    { i: "fa-youtube", url: s?.social_youtube },
  ].filter((x) => x.url) as { i: string; url: string }[];
  return (
    <footer className="bg-[#070d1a] pt-20 pb-8 border-t border-white/5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema("en")) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema("fr")) }}
      />
      <div className="container-sj grid lg:grid-cols-3 gap-10">
        <div>
          <a href="/#home" className="inline-flex items-center gap-3 mb-5">
            <img src={s?.logo_url || "/logo.png"} alt={`${brand} Logo`} className="site-logo" />
          </a>
          <p className="text-sm text-slate-400 leading-relaxed mb-5">
            {s?.footer_text || t(
              "Turning ideas into digital reality — crafting responsive websites, polished interfaces, and memorable brand identities from Yaoundé, Cameroon.",
              "Transformer les idées en réalité digitale — créer des sites réactifs, des interfaces soignées et des identités de marque mémorables depuis Yaoundé, Cameroun."
            )}
          </p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><i className="fa-solid fa-mobile-screen text-[--brand] mr-2" /><a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a></li>
            <li><i className="fa-solid fa-envelope text-[--brand] mr-2" /><a href={`mailto:${email}`}>{email}</a></li>
            <li><i className="fa-solid fa-location-dot text-[--brand] mr-2" />{location}</li>
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
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {socials.map((sl) => (
            <a key={sl.i} href={sl.url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full grid place-items-center border border-white/15 text-slate-300 hover:bg-[--brand] hover:text-white hover:border-[--brand] transition">
              <i className={`fa-brands ${sl.i} text-xs`} />
            </a>
          ))}
        </div>
        <p className="text-xs text-slate-400 text-center">© {new Date().getFullYear()} <span className="text-white font-semibold">{brand}</span>. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
