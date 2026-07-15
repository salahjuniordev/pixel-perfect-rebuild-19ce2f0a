import { createFileRoute } from "@tanstack/react-router";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { LegalLayout, LegalCard } from "@/components/site/LegalPage";
import { useSeo } from "@/lib/use-seo";
import { useLegalJsonLd } from "@/lib/use-legal-jsonld";

export const Route = createFileRoute("/license-copyright")({
  head: () => ({ meta: [{ title: "License & Copyright | Salah Junior" }] }),
  component: () => (
    <LanguageProvider>
      <LicensePage />
    </LanguageProvider>
  ),
});

function LicensePage() {
  const { t } = useLanguage();
  useSeo({
    title: { en: "License & Copyright | Salah Junior", fr: "Licence & Droits d'Auteur | Salah Junior" },
    description: {
      en: "License terms and copyright policy for content, code and designs on Salah Junior's portfolio.",
      fr: "Conditions de licence et politique de droits d'auteur pour le contenu, le code et les designs du portfolio de Salah Junior.",
    },
    path: "/license-copyright",
  });
  useLegalJsonLd({
    id: "legal-license",
    path: "/license-copyright",
    titleEn: "License & Copyright",
    titleFr: "Licence & Droits d'Auteur",
    descEn: "License terms and copyright policy for content, code and designs on Salah Junior's portfolio.",
    descFr: "Conditions de licence et politique de droits d'auteur pour le contenu, le code et les designs du portfolio de Salah Junior.",
  });
  return (
    <LegalLayout
      title={t("License & Copyright", "Licence & Droits d'Auteur")}
      subtitle={t(
        "Read these terms before reproducing or adapting any material from this site.",
        "Lisez ces conditions avant de reproduire ou d'adapter tout élément de ce site."
      )}
      updated={t("Effective: January 1, 2026", "En vigueur : 1er janvier 2026")}
    >
      <LegalCard heading={t("01 — Ownership & Copyright", "01 — Propriété & Droits d'Auteur")}>
        <p>{t(
          "All content on this website — including text, images, graphics, illustrations, UI/UX designs, source code, scripts, layouts, logos, and branding — is the exclusive intellectual property of Salah Junior Ncham, unless explicitly stated otherwise.",
          "Tout le contenu de ce site — textes, images, graphismes, illustrations, designs UI/UX, code source, scripts, mises en page, logos et identité — est la propriété intellectuelle exclusive de Salah Junior Ncham, sauf mention explicite."
        )}</p>
        <blockquote className="border-l-2 border-[--brand] pl-4 italic">{t(
          "© 2024–2026 Salah Junior Ncham. All rights reserved worldwide. Unauthorized reproduction, distribution, or modification of any material on this website is strictly prohibited without prior written consent.",
          "© 2024–2026 Salah Junior Ncham. Tous droits réservés dans le monde entier. Toute reproduction, distribution ou modification non autorisée est strictement interdite sans consentement écrit préalable."
        )}</blockquote>
      </LegalCard>
      <LegalCard heading={t("02 — Code License", "02 — Licence du Code")}>
        <p>{t(
          "The source code powering this portfolio is not open-source and is not freely licensed for redistribution or commercial use without written permission.",
          "Le code source de ce portfolio n'est pas open-source et n'est pas libre de redistribution ou d'usage commercial sans autorisation écrite."
        )}</p>
        <p className="font-semibold text-white mt-3">{t("Permitted:", "Autorisé :")}</p>
        <ul className="list-none space-y-1">
          <li>✓ {t("View source code for personal learning and educational study", "Consulter le code source pour l'apprentissage personnel et éducatif")}</li>
          <li>✓ {t("Reference small snippets (≤ 20 lines) in tutorials with clear attribution", "Citer de petits extraits (≤ 20 lignes) dans des tutoriels avec attribution claire")}</li>
          <li>✓ {t("Fork or adapt with prior written permission from the author", "Forker ou adapter avec autorisation écrite préalable de l'auteur")}</li>
        </ul>
        <p className="font-semibold text-white mt-3">{t("Not permitted:", "Interdit :")}</p>
        <ul className="list-none space-y-1">
          <li>✗ {t("Copy or clone the codebase as your own portfolio", "Copier ou cloner le code comme votre propre portfolio")}</li>
          <li>✗ {t("Use the code in commercial products without a license agreement", "Utiliser le code dans des produits commerciaux sans accord de licence")}</li>
          <li>✗ {t("Remove or obscure copyright notices and attributions", "Retirer ou masquer les mentions de copyright et attributions")}</li>
        </ul>
      </LegalCard>
      <LegalCard heading={t("03 — Design & Creative License", "03 — Licence Design & Création")}>
        <p>{t(
          "All UI/UX designs, graphics, illustrations, logos, and visual assets created by Salah Junior for client projects remain the property of the respective clients upon full payment, unless a separate licensing agreement specifies otherwise.",
          "Tous les designs UI/UX, graphismes, illustrations, logos et éléments visuels créés pour des projets clients restent la propriété des clients concernés après paiement complet, sauf accord de licence distinct."
        )}</p>
      </LegalCard>
      <LegalCard heading={t("04 — DMCA & Takedowns", "04 — DMCA & Retraits")}>
        <p>{t(
          "If you believe content on this website infringes your copyright, send a notice to salahjuniorncham@gmail.com with the subject 'DMCA Notice'. Valid takedown requests will receive a response within 72 hours.",
          "Si vous estimez qu'un contenu enfreint vos droits, envoyez un avis à salahjuniorncham@gmail.com avec pour objet « DMCA Notice ». Toute demande valide reçoit une réponse sous 72 heures."
        )}</p>
      </LegalCard>
      <LegalCard heading={t("Licensing enquiries", "Demandes de licence")}>
        <p>{t(
          "Need to use content, commission original work, or request written permission for a specific use case?",
          "Besoin d'utiliser du contenu, de commander un travail original ou d'obtenir une autorisation écrite ?"
        )}</p>
        <p>Email: <a href="mailto:salahjuniorncham@gmail.com" className="text-[--brand]">salahjuniorncham@gmail.com</a></p>
      </LegalCard>
    </LegalLayout>
  );
}
