import { createFileRoute } from "@tanstack/react-router";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { LegalLayout, LegalCard } from "@/components/site/LegalPage";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({ meta: [{ title: "Refund Policy | Salah Junior" }] }),
  component: () => (
    <LanguageProvider>
      <RefundPage />
    </LanguageProvider>
  ),
});

function RefundPage() {
  const { t } = useLanguage();
  return (
    <LegalLayout
      title={t("Refund Policy", "Politique de Remboursement")}
      subtitle={t("How we handle refund requests", "Comment sont traitées les demandes de remboursement")}
      updated={t("Last Updated: January 2026", "Dernière mise à jour : janvier 2026")}
    >
      <LegalCard heading={t("Overview", "Vue d'ensemble")}>
        <p>{t(
          "At SalahJuniorDev, I am committed to delivering exceptional digital solutions. This Refund Policy outlines the terms under which refunds may or may not be issued. By engaging my services, you agree to these terms.",
          "Chez SalahJuniorDev, je m'engage à livrer des solutions digitales exceptionnelles. Cette politique précise les conditions dans lesquelles un remboursement peut ou non être accordé. En engageant mes services, vous acceptez ces conditions."
        )}</p>
      </LegalCard>
      <LegalCard heading={t("Eligibility for Refunds", "Conditions d'éligibilité")}>
        <p>{t(
          "Refunds may be considered if: the project has not yet started and you cancel within 48 hours of payment; I fail to deliver within the agreed timeframe without prior notice; the delivered work fundamentally fails to meet the agreed brief despite all revisions; or a technical error on my part caused loss or damage to your assets.",
          "Un remboursement peut être envisagé si : le projet n'a pas commencé et vous annulez dans les 48h suivant le paiement ; je ne livre pas dans le délai convenu sans préavis ; le travail livré ne correspond fondamentalement pas au brief malgré les révisions ; ou une erreur technique de ma part cause une perte ou un dommage."
        )}</p>
      </LegalCard>
      <LegalCard heading={t("Non-Refundable Situations", "Situations non remboursables")}>
        <p>{t(
          "Refunds will not be issued if you change your mind after work starts; you have exhausted all revisions; delays are caused by your failure to provide content or approvals; work has been delivered as per the agreed brief; or third-party costs have already been incurred on your behalf.",
          "Aucun remboursement si : vous changez d'avis après le démarrage ; vous avez épuisé les révisions ; les retards viennent de votre côté (contenus ou validations) ; le travail a été livré conformément au brief ; ou des coûts tiers ont déjà été engagés pour votre compte."
        )}</p>
        <p><strong>{t(
          "Note: The 50% upfront deposit is non-refundable once work has commenced.",
          "Note : l'acompte de 50% n'est pas remboursable dès que le travail a commencé."
        )}</strong></p>
      </LegalCard>
      <LegalCard heading={t("Refund Request Process", "Procédure de Demande")}>
        <p>{t(
          "To request a refund: email salahjuniorncham@gmail.com with subject 'Refund Request - [Project Name]', include your full name, project details, payment reference, and reason. I will review within 3-5 business days. Approved refunds are processed within 7-14 business days via the original payment method.",
          "Pour demander un remboursement : envoyez un email à salahjuniorncham@gmail.com avec pour objet « Refund Request - [Nom du projet] », en indiquant votre nom complet, les détails du projet, la référence de paiement et la raison. Je réponds sous 3 à 5 jours ouvrés. Les remboursements approuvés sont traités sous 7 à 14 jours ouvrés via le moyen de paiement d'origine."
        )}</p>
      </LegalCard>
      <LegalCard heading={t("Contact", "Contact")}>
        <p>Email: salahjuniorncham@gmail.com</p>
        <p>WhatsApp: +237 683 693 011</p>
        <p>{t("Address: Yaoundé, Emana, Cameroon", "Adresse : Yaoundé, Emana, Cameroun")}</p>
      </LegalCard>
    </LegalLayout>
  );
}
