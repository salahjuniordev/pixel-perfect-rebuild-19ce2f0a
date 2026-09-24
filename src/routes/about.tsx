import { createFileRoute, Link } from "@tanstack/react-router";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { BackToTop } from "@/components/site/BackToTop";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { useSeo } from "@/lib/use-seo";
import {
  asJsonLdScript,
  legalPageSchemas,
  ogMeta,
  twitterMeta,
  altLinks,
  SITE_ORIGIN,
} from "@/lib/seo-schemas";

const PORTRAIT = "/assets/hero/hero-mobile-1.webp";

const ABOUT_TITLE_EN = "About Salah Junior – Full-Stack Web Developer & Designer";
const ABOUT_TITLE_FR = "À Propos de Salah Junior – Développeur Web Full-Stack & Designer";
const ABOUT_DESC_EN =
  "Meet Salah Junior: a full-stack web developer, UI/UX designer and brand designer based in Yaoundé, Cameroon, building fast, responsive, SEO-friendly websites and memorable brand identities for clients worldwide.";
const ABOUT_DESC_FR =
  "Découvrez Salah Junior : développeur web full-stack, designer UI/UX et designer de marque basé à Yaoundé, au Cameroun. Il conçoit des sites rapides, responsive et optimisés SEO ainsi que des identités de marque mémorables pour des clients partout dans le monde.";

const STORY: Array<[string, string]> = [
  [
    "I'm Salah Junior — a full-stack web developer, UI/UX designer and brand designer based in Yaoundé, Cameroon. I build the whole picture: the code that powers your product, the interface your users touch, and the visual identity that makes people remember you.",
    "Je suis Salah Junior — développeur web full-stack, designer UI/UX et designer de marque basé à Yaoundé, au Cameroun. Je construis l'ensemble : le code qui fait tourner votre produit, l'interface que vos utilisateurs touchent et l'identité visuelle qui vous rend mémorable.",
  ],
  [
    "I started building websites at 17, and what began as curiosity quickly became a craft. Three years later, I've worked with NGOs, logistics companies and brands across Central Africa — turning ideas into digital products that actually work. I don't just write code; I think about the person on the other side of the screen.",
    "J'ai commencé à créer des sites web à 17 ans, et ce qui n'était que curiosité est vite devenu un métier. Trois ans plus tard, j'ai travaillé avec des ONG, des entreprises logistiques et des marques à travers l'Afrique Centrale — en transformant des idées en produits numériques qui fonctionnent vraiment. Je ne me contente pas d'écrire du code : je pense toujours à la personne de l'autre côté de l'écran.",
  ],
  [
    "How I work: you deal directly with the developer — no agency layers, no lost messages. Every project follows the same path: a discovery call to define your goals, a custom design aligned with your brand, clean and maintainable code, then launch. Every website I deliver is fully responsive on phones, tablets and desktops, optimised for speed, and built with semantic HTML, meta tags and JSON-LD structured data so search engines can actually find and rank it.",
    "Ma façon de travailler : vous échangez directement avec le développeur — sans intermédiaire, sans message perdu. Chaque projet suit le même chemin : un appel de découverte pour définir vos objectifs, un design sur mesure aligné à votre marque, un code propre et maintenable, puis le lancement. Chaque site livré est entièrement responsive (mobile, tablette, desktop), optimisé pour la vitesse et construit avec du HTML sémantique, des balises meta et des données structurées JSON-LD pour être trouvé et bien classé par les moteurs de recherche.",
  ],
  [
    "I work in English and French, remotely with clients across Africa, Europe and beyond. Standard terms are simple: at least three revision rounds included, 50% upfront and 50% on delivery, and post-launch support so you're never left alone after going live.",
    "Je travaille en anglais et en français, à distance avec des clients en Afrique, en Europe et au-delà. Les conditions sont simples : au moins trois tours de révisions inclus, 50% d'acompte et 50% à la livraison, et un support après lancement pour que vous ne restiez jamais seul une fois en ligne.",
  ],
];

const INFO = [
  { icon: "fa-user", en: "MY NAME :", fr: "MON NOM :", value: "Salah Junior" },
  { icon: "fa-location-dot", en: "ADDRESS :", fr: "ADRESSE :", value: "Emana, Yaoundé, CMR" },
  { icon: "fa-envelope", en: "EMAIL :", fr: "E-MAIL :", value: "salahjuniorncham@gmail.com", href: "mailto:salahjuniorncham@gmail.com" },
  { icon: "fa-language", en: "LANGUAGES :", fr: "LANGUES :", value: "English · Français" },
];

const INTERESTS = [
  { i: "fa-gamepad", en: "GAMING", fr: "JEU VIDÉO" },
  { i: "fa-code", en: "CODING", fr: "PROGRAMMATION" },
  { i: "fa-music", en: "MUSIC", fr: "MUSIQUE" },
  { i: "fa-video", en: "ANIME", fr: "ANIMÉ" },
];

const OFFERINGS = [
  {
    icon: "fa-code",
    en: ["Full-Stack Web Development", "Fast, responsive, SEO-friendly websites and web apps — from landing pages to full platforms, built with React, TypeScript and Supabase."],
    fr: ["Développement Web Full-Stack", "Sites et applications web rapides, responsive et optimisés SEO — de la landing page à la plateforme complète, avec React, TypeScript et Supabase."],
    href: "/#services",
  },
  {
    icon: "fa-pen-ruler",
    en: ["UI/UX Design", "Interfaces designed around real users: clear flows, accessible layouts and polished details that turn visitors into customers."],
    fr: ["Design UI/UX", "Des interfaces pensées pour de vrais utilisateurs : parcours clairs, mises en page accessibles et détails soignés qui transforment les visiteurs en clients."],
    href: "/#services",
  },
  {
    icon: "fa-palette",
    en: ["Graphic Design & Branding", "Logos, brand identities and visual systems that make your business look as professional as it is."],
    fr: ["Design Graphique & Branding", "Logos, identités de marque et systèmes visuels qui donnent à votre entreprise l'allure professionnelle qu'elle mérite."],
    href: "/#services",
  },
  {
    icon: "fa-file-invoice",
    en: ["Office Administration", "Reliable document management, data entry and back-office support so you can focus on running your business."],
    fr: ["Administration Bureautique", "Gestion documentaire fiable, saisie de données et support back-office pour que vous restiez concentré sur votre activité."],
    href: "/#services",
  },
];

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `${ABOUT_TITLE_EN} | Salah Junior` },
      { name: "description", content: ABOUT_DESC_EN },
      ...ogMeta({
        titleEn: ABOUT_TITLE_EN,
        descEn: ABOUT_DESC_EN,
        titleFr: ABOUT_TITLE_FR,
        descFr: ABOUT_DESC_FR,
        url: `${SITE_ORIGIN}/about`,
      }),
      ...twitterMeta({
        title: ABOUT_TITLE_EN,
        description: ABOUT_DESC_EN,
        url: `${SITE_ORIGIN}/about`,
      }),
    ],
    links: altLinks("/about"),
    scripts: legalPageSchemas({
      path: "/about",
      titleEn: "About Me",
      titleFr: "À Propos de Moi",
      descEn: ABOUT_DESC_EN,
      descFr: ABOUT_DESC_FR,
    }).map(asJsonLdScript),
  }),
  component: () => (
    <LanguageProvider>
      <AboutPage />
    </LanguageProvider>
  ),
});

function AboutPage() {
  const { t } = useLanguage();

  useSeo({
    title: { en: `${ABOUT_TITLE_EN} | Salah Junior`, fr: `${ABOUT_TITLE_FR} | Salah Junior` },
    description: { en: ABOUT_DESC_EN, fr: ABOUT_DESC_FR },
    path: "/about",
  });

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: "smooth" });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col">
        {/* Hero */}
        <header className="pt-32 pb-14 bg-[#07101f]">
          <div className="container-sj text-center">
            <nav aria-label={t("Breadcrumb", "Fil d'Ariane")} className="text-xs text-slate-400 mb-4">
              <Link to="/" className="hover:text-[--brand]">{t("Home", "Accueil")}</Link>
              <span className="mx-2">›</span>
              <span className="text-[--brand]">{t("About Me", "À Propos de Moi")}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              {t("About Me", "À Propos de Moi")}
            </h1>
            <p className="text-slate-300">
              {t(
                "Web Developer · UI/UX Designer · Brand Designer — Yaoundé, Cameroon",
                "Développeur Web · Designer UI/UX · Designer de Marque — Yaoundé, Cameroun",
              )}
            </p>
          </div>
        </header>

        <main className="flex-1 section-padding !pt-16">
          {/* Story */}
          <section className="about-section !pt-0">
            <div className="about-dots-tl" aria-hidden />
            <div className="about-dots-br" aria-hidden />
            <div className="container-sj grid lg:grid-cols-12 gap-14 items-start relative">
              <div className="lg:col-span-5">
                <div className="about-portrait lg:sticky lg:top-24">
                  <span className="about-frame" aria-hidden />
                  <img
                    src={PORTRAIT}
                    alt={t(
                      "Salah Junior – Full-Stack Web Developer and UI/UX Designer based in Yaoundé, Cameroon",
                      "Salah Junior – Développeur Web Full-Stack et Designer UI/UX basé à Yaoundé, Cameroun",
                    )}
                    width={760}
                    height={950}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              <div className="lg:col-span-7">
                <h2 className="about-title">{t("Hi, I'm Salah Junior.", "Bonjour, je suis Salah Junior.")}</h2>
                <div className="space-y-5 text-slate-300 leading-relaxed">
                  {STORY.map(([en, fr], i) => (
                    <p key={i}>{t(en, fr)}</p>
                  ))}
                </div>

                <div className="about-divider" />

                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7 mb-9">
                  {INFO.map((info) => (
                    <Info key={info.en} {...info} t={t} />
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 mb-12">
                  <button onClick={() => scrollTo("contact")} className="about-btn about-btn-primary">
                    {t("Contact Me", "Contactez-Moi")}
                  </button>
                  <a href="/assets/my-resume.pdf" target="_blank" rel="noreferrer" className="about-btn about-btn-primary">
                    {t("My Resume", "Mon CV")}
                  </a>
                  <button onClick={() => scrollTo("services")} className="svc-detail-btn svc-detail-btn-ghost">
                    {t("View Services", "Voir les Services")}
                  </button>
                </div>

                <h3 className="about-interests-title">{t("My Interests", "Mes Intérêts")}</h3>
                <div className="flex flex-wrap gap-x-8 gap-y-4">
                  {INTERESTS.map((x) => (
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

          {/* What I do */}
          <section className="svc-detail-section">
            <div className="container-sj">
              <h2 className="svc-detail-section-title">{t("What I Do", "Ce que je fais")}</h2>
              <p className="svc-detail-section-sub">
                {t(
                  "Four services, one standard: work I'm proud to put my name on.",
                  "Quatre services, une seule exigence : un travail dont je suis fier de signer mon nom.",
                )}
              </p>
              <div className="grid sm:grid-cols-2 gap-6 mt-10">
                {OFFERINGS.map((o) => (
                  <button
                    key={o.icon}
                    onClick={() => scrollTo("services")}
                    className="card-dark text-left p-7 hover:border-[--brand]/60 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[--brand]/10 border border-[--brand]/20 grid place-items-center mb-5 group-hover:bg-[--brand]/20 transition-colors">
                      <i className={`fa-solid ${o.icon} text-[--brand] text-lg`} />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{t(o.en[0], o.fr[0])}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{t(o.en[1], o.fr[1])}</p>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="svc-detail-section svc-detail-contact">
            <div className="container-sj text-center">
              <h2 className="svc-detail-section-title">
                {t("Let's build something together.", "Construisons quelque chose ensemble.")}
              </h2>
              <p className="svc-detail-section-sub">
                {t(
                  "Tell me about your project and I'll get back to you within 24 hours.",
                  "Parlez-moi de votre projet et je vous répondrai sous 24 heures.",
                )}
              </p>
              <div className="flex flex-wrap gap-4 justify-center mt-8">
                <a
                  href="/start"
                  className="svc-detail-btn svc-detail-btn-primary"
                >
                  <i className="fa-solid fa-rocket" />
                  {t("Start a Project", "Démarrer un Projet")}
                </a>
                <a
                  href="https://wa.me/237683693011"
                  target="_blank"
                  rel="noreferrer"
                  className="svc-detail-btn svc-detail-btn-ghost"
                >
                  <i className="fab fa-whatsapp" />
                  {t("Message me on WhatsApp", "Écrivez-moi sur WhatsApp")}
                </a>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
      <WhatsAppFloat />
      <BackToTop />
    </>
  );
}

function Info({
  icon,
  en,
  fr,
  value,
  href,
  t,
}: {
  icon: string;
  en: string;
  fr: string;
  value: string;
  href?: string;
  t: (en: string, fr: string) => string;
}) {
  const content = (
    <div className="about-info">
      <div className="about-info-head">
        <span className="about-info-icon">
          <i className={`fa-solid ${icon}`} />
        </span>
        <span className="about-info-label">{t(en, fr)}</span>
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
