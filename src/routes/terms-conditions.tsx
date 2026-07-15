import { createFileRoute } from "@tanstack/react-router";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { LegalLayout, LegalCard } from "@/components/site/LegalPage";
import { useSeo } from "@/lib/use-seo";
import { useLegalJsonLd } from "@/lib/use-legal-jsonld";

export const Route = createFileRoute("/terms-conditions")({
  head: () => ({ meta: [{ title: "Terms & Conditions | Salah Junior" }] }),
  component: () => (
    <LanguageProvider>
      <TermsPage />
    </LanguageProvider>
  ),
});

function TermsPage() {
  const { t } = useLanguage();
  useSeo({
    title: { en: "Terms & Conditions | Salah Junior", fr: "Conditions Générales | Salah Junior" },
    description: {
      en: "Terms and conditions for engaging Salah Junior's web development, design, and branding services.",
      fr: "Conditions générales pour l'engagement des services de développement web, design et branding de Salah Junior.",
    },
    path: "/terms-conditions",
  });
  return (
    <LegalLayout
      title={t("Terms & Conditions", "Conditions Générales")}
      subtitle={t("Please read carefully before engaging our services", "Veuillez lire attentivement avant d'engager mes services")}
      updated={t("Last Updated: January 2026", "Dernière mise à jour : janvier 2026")}
    >
      <LegalCard heading={t("1. Acceptance of Terms", "1. Acceptation des Conditions")}>
        <p>{t(
          "By engaging SalahJuniorDev for any service via my portfolio, WhatsApp, email, or verbal agreement, you confirm you have read and agree to be bound by these Terms and Conditions. I reserve the right to update these terms at any time.",
          "En engageant SalahJuniorDev pour un service via mon portfolio, WhatsApp, email ou accord verbal, vous confirmez avoir lu et accepté ces Conditions Générales. Je me réserve le droit de les mettre à jour à tout moment."
        )}</p>
      </LegalCard>
      <LegalCard heading={t("2. Services Provided", "2. Services Proposés")}>
        <p>{t(
          "I provide: Full-Stack Website Design and Development, Graphic Design and Print Materials, UI/UX Design, Branding and Visual Identity, Social Media Content Design, and Office Administration Solutions. The specific scope will be agreed in writing before commencement.",
          "Je propose : la conception et le développement web full-stack, le design graphique et les supports imprimés, le design UI/UX, l'identité de marque, la création de contenus pour réseaux sociaux et l'administration bureautique. Le périmètre exact sera défini par écrit avant le démarrage."
        )}</p>
      </LegalCard>
      <LegalCard heading={t("3. Client Responsibilities", "3. Responsabilités du Client")}>
        <p>{t(
          "Clients are responsible for providing accurate briefs and content; responding to feedback requests on time; ensuring all materials provided are legally owned or licensed; and paying invoices as per the agreed schedule. Delays caused by client inaction will not count against my deadlines.",
          "Le client est responsable de fournir des briefs et contenus précis ; de répondre aux demandes de feedback à temps ; de garantir la propriété ou la licence des éléments fournis ; et de régler les factures selon l'échéancier convenu. Les retards dus à l'inaction du client ne sont pas imputables à mes délais."
        )}</p>
      </LegalCard>
      <LegalCard heading={t("4. Payment Terms", "4. Conditions de Paiement")}>
        <p>{t(
          "All projects require a 50% deposit before work commences. The remaining 50% is due upon completion before final files are delivered. Invoices are payable within 7 days. Late payments may incur a 5% monthly surcharge. Prices are quoted in USD or XAF as agreed.",
          "Tous les projets nécessitent un acompte de 50% avant le démarrage. Les 50% restants sont dus à la livraison avant remise des fichiers finaux. Les factures sont payables sous 7 jours. Un retard peut entraîner une majoration mensuelle de 5%. Prix libellés en USD ou XAF selon accord."
        )}</p>
      </LegalCard>
      <LegalCard heading={t("5. Intellectual Property", "5. Propriété Intellectuelle")}>
        <p>{t(
          "Upon full payment, the client receives ownership of all custom work. I retain the right to display the work in my portfolio and use it as a case study (client name withheld if requested). Third-party assets remain subject to their respective licenses.",
          "Au paiement complet, le client reçoit la propriété du travail sur mesure. Je conserve le droit d'exposer le travail dans mon portfolio et de l'utiliser comme étude de cas (nom du client masqué sur demande). Les éléments tiers restent soumis à leurs licences respectives."
        )}</p>
      </LegalCard>
      <LegalCard heading={t("6. Confidentiality", "6. Confidentialité")}>
        <p>{t(
          "Both parties agree to keep confidential any proprietary information shared during the project. I will not share your business information, strategies, or data with third parties without your explicit written consent.",
          "Les deux parties s'engagent à garder confidentielles les informations propriétaires partagées durant le projet. Je ne partagerai aucune information, stratégie ou donnée métier avec des tiers sans votre accord écrit explicite."
        )}</p>
      </LegalCard>
      <LegalCard heading={t("7. Limitation of Liability", "7. Limitation de Responsabilité")}>
        <p>{t(
          "I shall not be liable for any indirect, incidental, or consequential damages. My maximum liability is limited to the amount paid by the client for the specific project in question.",
          "Je ne saurais être tenu responsable de dommages indirects, accessoires ou consécutifs. Ma responsabilité maximale est limitée au montant payé par le client pour le projet concerné."
        )}</p>
      </LegalCard>
      <LegalCard heading={t("8. Termination", "8. Résiliation")}>
        <p>{t(
          "Either party may terminate a project with written notice. The client owes payment for all work completed to date. The deposit is non-refundable once work has started. Work-in-progress files are delivered upon full payment of outstanding amounts.",
          "Chaque partie peut résilier un projet par notification écrite. Le client doit le paiement de tout travail effectué à ce jour. L'acompte n'est pas remboursable dès que le travail a commencé. Les fichiers en cours sont livrés après règlement complet des sommes dues."
        )}</p>
      </LegalCard>
      <LegalCard heading={t("9. Governing Law", "9. Loi Applicable")}>
        <p>{t(
          "These Terms are governed by the laws of the Republic of Cameroon. Disputes shall first be resolved through good-faith negotiation, and if unresolved, through the courts of Yaoundé, Cameroon.",
          "Ces Conditions sont régies par les lois de la République du Cameroun. Les litiges seront d'abord résolus par négociation de bonne foi et, à défaut, devant les tribunaux de Yaoundé, Cameroun."
        )}</p>
      </LegalCard>
      <LegalCard heading={t("10. Contact", "10. Contact")}>
        <p>Email: salahjuniorncham@gmail.com</p>
        <p>WhatsApp: +237 683 693 011</p>
        <p>{t("Address: Yaoundé, Emana, Cameroon", "Adresse : Yaoundé, Emana, Cameroun")}</p>
      </LegalCard>
    </LegalLayout>
  );
}
