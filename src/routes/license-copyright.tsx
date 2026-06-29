import { createFileRoute } from "@tanstack/react-router";
import { LanguageProvider } from "@/lib/language";
import { LegalLayout, LegalCard } from "@/components/site/LegalPage";

export const Route = createFileRoute("/license-copyright")({
  head: () => ({ meta: [{ title: "License & Copyright | Salah Junior" }] }),
  component: () => (
    <LanguageProvider>
      <LegalLayout title="License & Copyright" subtitle="Read these terms before reproducing or adapting any material from this site." updated="Effective: January 1, 2026">
        <LegalCard heading="01 — Ownership & Copyright">
          <p>All content on this website — including text, images, graphics, illustrations, UI/UX designs, source code, scripts, layouts, logos, and branding — is the exclusive intellectual property of <strong>Salah Junior Ncham</strong>, unless explicitly stated otherwise.</p>
          <blockquote className="border-l-2 border-[--brand] pl-4 italic">© 2024–2026 Salah Junior Ncham. All rights reserved worldwide. Unauthorized reproduction, distribution, or modification of any material on this website is strictly prohibited without prior written consent.</blockquote>
          <p>This copyright notice applies to all versions of this portfolio, including previous iterations, updates, and any derivative works created by the author.</p>
        </LegalCard>
        <LegalCard heading="02 — Code License">
          <p>The source code powering this portfolio (HTML, CSS, JavaScript) is <strong>not open-source</strong> and is not freely licensed for redistribution or commercial use without written permission.</p>
          <p className="font-semibold text-white mt-3">Permitted:</p>
          <ul className="list-none space-y-1">
            <li>✓ View source code for personal learning and educational study</li>
            <li>✓ Reference small snippets (≤ 20 lines) in tutorials with clear attribution</li>
            <li>✓ Fork or adapt with prior written permission from the author</li>
          </ul>
          <p className="font-semibold text-white mt-3">Not permitted:</p>
          <ul className="list-none space-y-1">
            <li>✗ Copy or clone the codebase as your own portfolio</li>
            <li>✗ Use the code in commercial products without a license agreement</li>
            <li>✗ Remove or obscure copyright notices and attributions</li>
          </ul>
        </LegalCard>
        <LegalCard heading="03 — Design & Creative License">
          <p>All UI/UX designs, graphics, illustrations, logos, and visual assets created by Salah Junior for client projects remain the property of the respective clients upon full payment, unless a separate licensing agreement specifies otherwise.</p>
          <p>Portfolio mockups and case studies displayed on this website are shown for <strong>demonstration purposes only</strong>. Client-specific materials are displayed with permission and may not be reproduced, modified, or distributed by third parties.</p>
          <blockquote className="border-l-2 border-[--brand] pl-4 italic">If you are a client seeking clarification on ownership of deliverables from a commissioned project, please refer to the signed contract or contact Salah Junior directly.</blockquote>
        </LegalCard>
        <LegalCard heading="04 — Permitted Uses">
          <p>The table below summarises what you may and may not do with material from this site.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs mt-3 border-collapse">
              <thead><tr className="border-b border-white/10 text-left text-slate-400">
                <th className="py-2 pr-3">Use case</th><th className="py-2 pr-3">Status</th><th className="py-2">Condition</th>
              </tr></thead>
              <tbody className="text-slate-300">
                {[
                  ["Viewing for personal inspiration", "Allowed", "No restrictions"],
                  ["Sharing the portfolio URL", "Allowed", "Link to the site directly"],
                  ["Educational reference with attribution", "Allowed", "Credit: Salah Junior / salahjuniordev.vercel.app"],
                  ["Press or media coverage", "Ask first", "Contact for approval before publishing"],
                  ["Commercial use of any asset", "Not allowed", "Written license required"],
                  ["Reproducing full pages or layouts", "Not allowed", "Copyright violation"],
                ].map((r) => (
                  <tr key={r[0]} className="border-b border-white/5">
                    <td className="py-2 pr-3">{r[0]}</td><td className="py-2 pr-3">{r[1]}</td><td className="py-2">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </LegalCard>
        <LegalCard heading="05 — Prohibited Uses">
          <p>The following activities are explicitly forbidden and may result in legal action:</p>
          <ul className="list-none space-y-1">
            <li>✗ Reproducing, distributing, or selling any content from this website without written permission</li>
            <li>✗ Using this portfolio's design or layout as a template for your own personal or commercial projects</li>
            <li>✗ Scraping, mirroring, or archiving content for redistribution</li>
            <li>✗ Presenting any content from this site as your own original work</li>
            <li>✗ Using the author's name, likeness, or brand for endorsement without consent</li>
            <li>✗ Submitting work displayed here to competitions, job applications, or platforms as your own</li>
            <li>✗ Attempting to bypass any access controls or security measures on this site</li>
          </ul>
        </LegalCard>
        <LegalCard heading="06 — Third-Party Assets & Attributions">
          <p>This website uses the following external resources, each under their own license:</p>
          <ul className="list-none space-y-1">
            <li>✓ <strong>Font Awesome 6.0</strong> — Icons under the FA Free License (CC BY 4.0 for icons, SIL OFL for fonts)</li>
            <li>✓ <strong>Google Fonts — Rubik</strong> — Typeface under the SIL Open Font License 1.1</li>
            <li>✓ <strong>Devicons</strong> — Technology logos under the MIT License</li>
            <li>✓ <strong>Cloudinary</strong> — Image hosting via Cloudinary's standard free plan terms</li>
            <li>✓ <strong>Vercel</strong> — Hosting under Vercel's standard Terms of Service</li>
          </ul>
          <p>Brand logos and trademarks (WordPress, Strapi, Adobe, Microsoft, etc.) are the property of their respective owners and appear here for identification only.</p>
        </LegalCard>
        <LegalCard heading="07 — DMCA & Copyright Takedowns">
          <p>If you believe content on this website infringes your copyright, send a notice to salahjuniorncham@gmail.com with the subject <strong>"DMCA Notice"</strong>. Include:</p>
          <ul className="list-none space-y-1">
            <li>✓ A description of the copyrighted work you claim has been infringed</li>
            <li>✓ The specific URL(s) where the alleged infringing material appears</li>
            <li>✓ Your contact information — name, email address, phone number</li>
            <li>✓ A statement that you have a good-faith belief the use is not authorised</li>
            <li>✓ Your electronic or physical signature</li>
          </ul>
          <blockquote className="border-l-2 border-[--brand] pl-4 italic">Valid takedown requests will receive a response within <strong>72 hours</strong>. If you find your own creative work used without proper credit on this site, reach out — it will be addressed promptly.</blockquote>
        </LegalCard>
        <LegalCard heading="Licensing enquiries">
          <p>Need to use content, commission original work, or request written permission for a specific use case?</p>
          <p>Email: <a href="mailto:salahjuniorncham@gmail.com" className="text-[--brand]">salahjuniorncham@gmail.com</a></p>
        </LegalCard>
      </LegalLayout>
    </LanguageProvider>
  ),
});
