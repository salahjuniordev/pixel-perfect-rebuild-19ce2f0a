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
