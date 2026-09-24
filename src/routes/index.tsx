import { createFileRoute } from "@tanstack/react-router";
import { LanguageProvider } from "@/lib/language";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Skills } from "@/components/site/Skills";
import { ToolsMarquee } from "@/components/site/ToolsMarquee";
import { Services } from "@/components/site/Services";
import { ClientsMarquee } from "@/components/site/ClientsMarquee";
import { Numbers } from "@/components/site/Numbers";
import { Portfolio } from "@/components/site/Portfolio";
import { Testimonials } from "@/components/site/Testimonials";
import { Blog } from "@/components/site/Blog";
import { Process } from "@/components/site/Process";
import { Newsletter } from "@/components/site/Newsletter";
import { QuoteWizard } from "@/components/site/QuoteWizard";
import { Ebooks } from "@/components/site/Ebooks";
import { Pricing } from "@/components/site/Pricing";
import { HomeFaq, homeFaqSchemas } from "@/components/site/HomeFaq";
import { GalleryStrip } from "@/components/site/GalleryStrip";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { BackToTop } from "@/components/site/BackToTop";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { useSeo } from "@/lib/use-seo";
import { asJsonLdScript, homeGraphs, twitterMeta, ogMeta, altLinks, SITE_ORIGIN } from "@/lib/seo-schemas";
import { fetchHomeData } from "@/lib/home-data";

const HOME_TITLE_EN = "Salah Junior | Full-Stack Web Developer in Yaoundé, Cameroon";
const HOME_DESC_EN =
  "Full-stack web developer in Yaoundé, Cameroon. I build fast, bilingual websites and web apps for businesses and NGOs. Fixed prices, delivery in 5 to 10 days.";
const HOME_TITLE_FR = "Salah Junior | Développeur Web Full-Stack à Yaoundé, Cameroun";
const HOME_DESC_FR =
  "Développeur web full-stack à Yaoundé, Cameroun. Je crée des sites et applications web rapides et bilingues pour entreprises et ONG. Prix fixes, livraison en 5 à 10 jours.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: HOME_TITLE_EN },
      { name: "description", content: HOME_DESC_EN },
      ...ogMeta({
        titleEn: HOME_TITLE_EN,
        descEn: HOME_DESC_EN,
        titleFr: HOME_TITLE_FR,
        descFr: HOME_DESC_FR,
        url: `${SITE_ORIGIN}/`,
        type: "website",
      }),
      ...twitterMeta({ title: HOME_TITLE_EN, description: HOME_DESC_EN, url: `${SITE_ORIGIN}/` }),
    ],
    links: altLinks("/"),
    scripts: [...homeGraphs(), ...homeFaqSchemas()].map(asJsonLdScript),
  }),
  loader: () => fetchHomeData(),
  component: Index,
});

function IndexInner() {
  const data = Route.useLoaderData();
  useSeo({
    title: { en: HOME_TITLE_EN, fr: HOME_TITLE_FR },
    description: { en: HOME_DESC_EN, fr: HOME_DESC_FR },
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
        <Services initial={data?.services} />
        <ClientsMarquee />
        <Process />
        <Numbers />
        <Portfolio initial={data?.projects} />
        <GalleryStrip />
        <Testimonials initial={data?.testimonials} />
        <Blog initial={data?.posts} />
        <Ebooks />
        <Pricing initial={data?.pricing} />
        <HomeFaq />
        <Contact />
        <Newsletter />
      </main>
      <Footer />
      <BackToTop />
      <WhatsAppFloat />
      <QuoteWizard />
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
