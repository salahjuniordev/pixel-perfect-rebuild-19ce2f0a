import { createFileRoute } from "@tanstack/react-router";
import { LanguageProvider } from "@/lib/language";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Skills } from "@/components/site/Skills";
import { ToolsMarquee } from "@/components/site/ToolsMarquee";
import { Services } from "@/components/site/Services";
import { Numbers } from "@/components/site/Numbers";
import { Portfolio } from "@/components/site/Portfolio";
import { Testimonials } from "@/components/site/Testimonials";
import { Blog } from "@/components/site/Blog";
import { Pricing } from "@/components/site/Pricing";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { BackToTop } from "@/components/site/BackToTop";
import { useSeo } from "@/lib/use-seo";
import { useJsonLd } from "@/lib/use-jsonld";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Salah Junior | Full-Stack Web Developer & UI/UX Designer – Yaoundé, Cameroon" },
      { name: "description", content: "Full-Stack Web Developer and UI/UX Designer based in Yaoundé, Cameroon. Turning ideas into digital reality." },
    ],
  }),
  component: Index,
});

function IndexInner() {
  useSeo({
    title: {
      en: "Salah Junior | Full-Stack Web Developer & UI/UX Designer – Yaoundé, Cameroon",
      fr: "Salah Junior | Développeur Web Full-Stack & Designer UI/UX – Yaoundé, Cameroun",
    },
    description: {
      en: "Full-Stack Web Developer and UI/UX Designer based in Yaoundé, Cameroon. Turning ideas into digital reality.",
      fr: "Développeur Web Full-Stack et Designer UI/UX basé à Yaoundé, Cameroun. Je transforme vos idées en réalité digitale.",
    },
    path: "/",
  });
  const { lang } = useLanguage();
  const origin = typeof window !== "undefined" ? window.location.origin : "https://faithful-update.lovable.app";
  const isFr = lang === "fr";
  useJsonLd("home", [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Salah Junior Ncham",
      alternateName: "Salah Junior",
      url: origin,
      image: `${origin}/logo.png`,
      jobTitle: isFr ? "Développeur Web Full-Stack & Designer UI/UX" : "Full-Stack Web Developer & UI/UX Designer",
      description: isFr
        ? "Développeur Web Full-Stack et Designer UI/UX basé à Yaoundé, Cameroun."
        : "Full-Stack Web Developer and UI/UX Designer based in Yaoundé, Cameroon.",
      email: "mailto:salahjuniorncham@gmail.com",
      telephone: "+237683693011",
      address: { "@type": "PostalAddress", addressLocality: "Yaoundé", addressCountry: "CM" },
      sameAs: [
        "https://github.com/salahjuniordev",
        "https://www.instagram.com/salahjuniordev",
        "https://www.facebook.com/salahjuniordev",
      ],
      knowsAbout: ["Web Development", "UI/UX Design", "Branding", "React", "TypeScript", "Supabase", "Figma"],
      knowsLanguage: ["en", "fr"],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Salah Junior Portfolio",
      url: origin,
      inLanguage: [isFr ? "fr" : "en", isFr ? "en" : "fr"],
      potentialAction: {
        "@type": "SearchAction",
        target: `${origin}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "SalahJuniorDev",
      url: origin,
      image: `${origin}/logo.png`,
      priceRange: "$$",
      areaServed: ["CM", "Africa", "Worldwide"],
      address: { "@type": "PostalAddress", addressLocality: "Yaoundé", addressCountry: "CM" },
      description: isFr
        ? "Services de développement web full-stack, design UI/UX, identité de marque et administration bureautique."
        : "Full-stack web development, UI/UX design, branding and office administration services.",
      serviceType: isFr
        ? ["Développement Web", "Design UI/UX", "Identité de Marque", "Design Graphique"]
        : ["Web Development", "UI/UX Design", "Branding", "Graphic Design"],
    },
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <ToolsMarquee />
        <Services />
        <Numbers />
        <Portfolio />
        <Testimonials />
        <Blog />
        <Pricing />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

function Index() {
  return (
    <LanguageProvider>
      <IndexInner />
    </LanguageProvider>
  );
}
