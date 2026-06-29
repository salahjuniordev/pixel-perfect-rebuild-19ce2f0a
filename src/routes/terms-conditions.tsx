import { createFileRoute } from "@tanstack/react-router";
import { LanguageProvider } from "@/lib/language";
import { LegalLayout, LegalCard } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms-conditions")({
  head: () => ({ meta: [{ title: "Terms & Conditions | Salah Junior" }] }),
  component: () => (
    <LanguageProvider>
      <LegalLayout title="Terms & Conditions" subtitle="Please read carefully before engaging our services" updated="Last Updated: January 2026">
        <LegalCard heading="1. Acceptance of Terms">
          <p>By engaging SalahJuniorDev for any service via my portfolio, WhatsApp, email, or verbal agreement, you confirm you have read and agree to be bound by these Terms and Conditions. I reserve the right to update these terms at any time.</p>
        </LegalCard>
        <LegalCard heading="2. Services Provided">
          <p>I provide: Full-Stack Website Design and Development, Graphic Design and Print Materials, UI/UX Design, Branding and Visual Identity, Social Media Content Design, and Office Administration Solutions. The specific scope will be agreed in writing before commencement.</p>
        </LegalCard>
        <LegalCard heading="3. Client Responsibilities">
          <p>Clients are responsible for providing accurate briefs and content; responding to feedback requests on time; ensuring all materials provided are legally owned or licensed; and paying invoices as per the agreed schedule. Delays caused by client inaction will not count against my deadlines.</p>
        </LegalCard>
        <LegalCard heading="4. Payment Terms">
          <p>All projects require a <strong>50% deposit</strong> before work commences. The remaining 50% is due upon completion before final files are delivered. Invoices are payable within 7 days. Late payments may incur a 5% monthly surcharge. Prices are quoted in USD or XAF as agreed.</p>
        </LegalCard>
        <LegalCard heading="5. Intellectual Property">
          <p>Upon full payment, the client receives ownership of all custom work. I retain the right to display the work in my portfolio and use it as a case study (client name withheld if requested). Third-party assets remain subject to their respective licenses.</p>
        </LegalCard>
        <LegalCard heading="6. Confidentiality">
          <p>Both parties agree to keep confidential any proprietary information shared during the project. I will not share your business information, strategies, or data with third parties without your explicit written consent.</p>
        </LegalCard>
        <LegalCard heading="7. Limitation of Liability">
          <p>I shall not be liable for any indirect, incidental, or consequential damages. My maximum liability is limited to the amount paid by the client for the specific project in question.</p>
        </LegalCard>
        <LegalCard heading="8. Termination">
          <p>Either party may terminate a project with written notice. The client owes payment for all work completed to date. The deposit is non-refundable once work has started. Work-in-progress files are delivered upon full payment of outstanding amounts.</p>
        </LegalCard>
        <LegalCard heading="9. Governing Law">
          <p>These Terms are governed by the laws of the Republic of Cameroon. Disputes shall first be resolved through good-faith negotiation, and if unresolved, through the courts of Yaoundé, Cameroon.</p>
        </LegalCard>
        <LegalCard heading="10. Contact">
          <p>Email: salahjuniorncham@gmail.com</p>
          <p>WhatsApp: +237 683 693 011</p>
          <p>Address: Yaoundé, Emana, Cameroon</p>
        </LegalCard>
      </LegalLayout>
    </LanguageProvider>
  ),
});
