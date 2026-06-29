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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Salah Junior | Full-Stack Web Developer & UI/UX Designer – Yaoundé, Cameroon" },
      { name: "description", content: "Full-Stack Web Developer and UI/UX Designer based in Yaoundé, Cameroon. Turning ideas into digital reality." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <LanguageProvider>
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
    </LanguageProvider>
  );
}
