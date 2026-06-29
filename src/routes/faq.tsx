import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LanguageProvider } from "@/lib/language";
import { LegalLayout } from "@/components/site/LegalPage";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ – Web Development & Design Services | Salah Junior" }] }),
  component: FAQPage,
});

const categories = [
  { name: "General", items: [
    { q: "What services does Salah Junior offer?", a: "I offer Full-Stack Web Development, UI/UX Design, Graphic Design, Branding and Identity, and Office Administration. Whether you need a complete website, a logo, or a full digital strategy, I have you covered." },
    { q: "How do I get started with a project?", a: "Reach out via the Contact section on my portfolio or send me a WhatsApp message. I will review your requirements and respond within 24 hours to schedule a discovery call." },
    { q: "Do you work with clients outside Cameroon?", a: "Yes! I work with clients globally via email, WhatsApp, and video calls. I have delivered projects for clients across Africa, Europe, and beyond." },
  ]},
  { name: "Pricing & Payment", items: [
    { q: "What are your payment terms?", a: "I require 50% upfront before work begins and 50% upon project completion. For larger projects, milestone-based payment can be arranged." },
    { q: "What payment methods do you accept?", a: "I accept Mobile Money (MTN and Orange), Bank Transfer, PayPal, and Western Union. Details are shared on your invoice." },
    { q: "Can I get a custom quote?", a: "Absolutely. Contact me to describe your needs and I will provide a tailored quote with no obligation." },
  ]},
  { name: "Project Process", items: [
    { q: "How long does a typical project take?", a: "Timelines vary: a logo takes 3-5 days; a 1-page website takes 7-14 days; a full e-commerce site or branding package takes 3-5 weeks." },
    { q: "How many revisions are included?", a: "All plans include at least 3 rounds of revisions. Additional revisions are available at an hourly rate communicated upfront." },
    { q: "Will I own the final files?", a: "Yes. Upon full payment, you receive complete ownership of all design files, source files, and website code." },
  ]},
  { name: "Support", items: [
    { q: "Do you offer post-launch support?", a: "Yes! My Premium plan includes 2 months of free post-launch support. All other plans include 30 days. Extended maintenance packages are available." },
    { q: "How do I report a bug after launch?", a: "Email salahjuniorncham@gmail.com or WhatsApp +237 683 693 011. I respond to all support requests within 24 business hours." },
  ]},
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-dark !p-0 overflow-hidden mb-3">
      <button onClick={() => setOpen(!open)} className="w-full text-left p-5 flex items-center justify-between gap-4">
        <span className="text-white font-medium">{q}</span>
        <i className={`fa-solid fa-chevron-down text-[--brand] transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 text-sm text-slate-300 leading-relaxed">{a}</div>}
    </div>
  );
}

function FAQPage() {
  return (
    <LanguageProvider>
      <LegalLayout title="FAQ" subtitle="Frequently Asked Questions" updated="Last Updated: January 2026">
        {categories.map((c) => (
          <div key={c.name} className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-5">{c.name}</h2>
            {c.items.map((it) => <FAQItem key={it.q} {...it} />)}
          </div>
        ))}
      </LegalLayout>
    </LanguageProvider>
  );
}
