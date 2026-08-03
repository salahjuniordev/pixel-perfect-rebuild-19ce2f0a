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
import { asJsonLdScript, homeGraphs, twitterMeta, ogMeta, altLinks, SITE_ORIGIN } from "@/lib/seo-schemas";

const HOME_TITLE_EN =
  "Salah Junior | Full-Stack Web Developer & UI/UX Designer – Yaoundé, Cameroon";
const HOME_DESC_EN =
  "Full-Stack Web Developer and UI/UX Designer based in Yaoundé, Cameroon. Turning ideas into digital reality.";
const HOME_TITLE_FR =
  "Salah Junior | Développeur Web Full-Stack & Designer UI/UX – Yaoundé, Cameroun";
const HOME_DESC_FR =
  "Développeur Web Full-Stack et Designer UI/UX basé à Yaoundé, Cameroun. Je transforme vos idées en réalité digitale.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: HOME_TITLE_EN },
      { name: "description", content: HOME_DESC_EN },
      ...ogMeta({
        titleFr: HOME_TITLE_FR,
        descFr: HOME_DESC_FR,
        url: `${SITE_ORIGIN}/`,
        type: "website",
      }),
      ...twitterMeta({ title: HOME_TITLE_EN, description: HOME_DESC_EN, url: `${SITE_ORIGIN}/` }),
    ],
    links: altLinks("/"),
    scripts: homeGraphs().map(asJsonLdScript),
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
