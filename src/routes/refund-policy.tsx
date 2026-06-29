import { createFileRoute } from "@tanstack/react-router";
import { LanguageProvider } from "@/lib/language";
import { LegalLayout, LegalCard } from "@/components/site/LegalPage";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({ meta: [{ title: "Refund Policy | Salah Junior" }] }),
  component: () => (
    <LanguageProvider>
      <LegalLayout title="Refund Policy" subtitle="How we handle refund requests" updated="Last Updated: January 2026">
        <LegalCard heading="Overview">
          <p>At SalahJuniorDev, I am committed to delivering exceptional digital solutions. This Refund Policy outlines the terms under which refunds may or may not be issued. By engaging my services, you agree to these terms.</p>
        </LegalCard>
        <LegalCard heading="Eligibility for Refunds">
          <p>Refunds may be considered if: the project has not yet started and you cancel within 48 hours of payment; I fail to deliver within the agreed timeframe without prior notice; the delivered work fundamentally fails to meet the agreed brief despite all revisions; or a technical error on my part caused loss or damage to your assets.</p>
        </LegalCard>
        <LegalCard heading="Non-Refundable Situations">
          <p>Refunds will <strong>not</strong> be issued if you change your mind after work starts; you have exhausted all revisions; delays are caused by your failure to provide content or approvals; work has been delivered as per the agreed brief; or third-party costs have already been incurred on your behalf.</p>
          <p><strong>Note:</strong> The 50% upfront deposit is non-refundable once work has commenced.</p>
        </LegalCard>
        <LegalCard heading="Refund Request Process">
          <p>To request a refund: email salahjuniorncham@gmail.com with subject <em>Refund Request - [Project Name]</em>, include your full name, project details, payment reference, and reason. I will review within 3-5 business days. Approved refunds are processed within 7-14 business days via the original payment method.</p>
        </LegalCard>
        <LegalCard heading="Contact">
          <p>Email: salahjuniorncham@gmail.com</p>
          <p>WhatsApp: +237 683 693 011</p>
          <p>Address: Yaoundé, Emana, Cameroon</p>
        </LegalCard>
      </LegalLayout>
    </LanguageProvider>
  ),
});
