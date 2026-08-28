import { createFileRoute, notFound } from "@tanstack/react-router";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { BackToTop } from "@/components/site/BackToTop";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Service = Tables<"services">;

async function loadService(id: string): Promise<Service | null> {
  try {
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .eq("published", true)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/services/$id")({
  loader: async ({ params }) => ({ service: await loadService(params.id) }),
  component: () => (
    <LanguageProvider>
      <ServiceDetailPage />
    </LanguageProvider>
  ),
});

function ServiceDetailPage() {
  const { service } = Route.useLoaderData();
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  if (!service) {
    throw notFound();
  }

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = "237683693011";
    const text = encodeURIComponent(
      `Hello Salah, I'm interested in your ${service!.title} service.\n\nName: ${form.name}\nEmail: ${form.email}\n\nProject details:\n${form.message}`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main className="svc-detail-page">
        {/* Hero */}
        <section className="svc-detail-hero">
          <div className="container-sj">
            <a href="/" className="svc-detail-back">
              <i className="fa-solid fa-arrow-left" />
              {t("All Services", "Tous les Services")}
            </a>
            <div className="svc-detail-hero-inner">
              <div className="svc-detail-icon-wrap">
                <i className={`fa-solid ${service.icon || "fa-cube"}`} />
              </div>
              <h1 className="svc-detail-title">{service.title}</h1>
              {service.description && (
                <p className="svc-detail-desc">{service.description}</p>
              )}
              <div className="svc-detail-actions">
                <a
                  href={`https://wa.me/237683693011?text=${encodeURIComponent(`Hello Salah, I'm interested in your ${service.title} service.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="svc-detail-btn svc-detail-btn-primary"
                >
                  <i className="fab fa-whatsapp" />
                  {t("Get a Quote", "Demander un Devis")}
                </a>
                <a href="/" className="svc-detail-btn svc-detail-btn-ghost">
                  <i className="fa-solid fa-arrow-left" />
                  {t("View All Services", "Voir Tous les Services")}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="svc-detail-section">
          <div className="container-sj">
            <div className="svc-detail-grid">
              <div className="svc-detail-card">
                <div className="svc-detail-card-icon">
                  <i className="fa-solid fa-check" />
                </div>
                <h3>{t("What's Included", "Ce qui est inclus")}</h3>
                <ul className="svc-detail-list">
                  <li><i className="fa-solid fa-check-circle" /> {t("Professional consultation", "Consultation professionnelle")}</li>
                  <li><i className="fa-solid fa-check-circle" /> {t("Custom design & development", "Conception et développement sur mesure")}</li>
                  <li><i className="fa-solid fa-check-circle" /> {t("Responsive & mobile-ready", "Responsive et prêt pour mobile")}</li>
                  <li><i className="fa-solid fa-check-circle" /> {t("Revision rounds included", "Cycles de révision inclus")}</li>
                  <li><i className="fa-solid fa-check-circle" /> {t("Final delivery & handoff", "Livraison et transfert finaux")}</li>
                </ul>
              </div>
              <div className="svc-detail-card">
                <div className="svc-detail-card-icon">
                  <i className="fa-solid fa-clock" />
                </div>
                <h3>{t("Timeline", "Délai")}</h3>
                <ul className="svc-detail-list">
                  <li><i className="fa-solid fa-check-circle" /> {t("Typical delivery: 3–7 business days", "Livraison typique : 3–7 jours ouvrables")}</li>
                  <li><i className="fa-solid fa-check-circle" /> {t("Rush delivery available", "Livraison express disponible")}</li>
                  <li><i className="fa-solid fa-check-circle" /> {t("Milestone check-ins", "Points d'étape réguliers")}</li>
                  <li><i className="fa-solid fa-check-circle" /> {t("Post-launch support", "Support après lancement")}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="svc-detail-section svc-detail-contact">
          <div className="container-sj">
            <h2 className="svc-detail-section-title">
              {t("Ready to Start?", "Prêt à commencer ?")}
            </h2>
            <p className="svc-detail-section-sub">
              {t(
                "Tell me about your project and I'll get back to you within 24 hours.",
                "Parlez-moi de votre projet et je vous répondrai sous 24 heures."
              )}
            </p>
            {submitted ? (
              <div className="svc-detail-success">
                <i className="fa-solid fa-check-circle" />
                <p>{t("Opening WhatsApp...", "Ouverture de WhatsApp...")}</p>
              </div>
            ) : (
              <form className="svc-detail-form" onSubmit={handleContact}>
                <div className="svc-detail-form-row">
                  <input
                    type="text"
                    required
                    placeholder={t("Your name", "Votre nom")}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="svc-detail-input"
                  />
                  <input
                    type="email"
                    required
                    placeholder={t("Email address", "Adresse email")}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="svc-detail-input"
                  />
                </div>
                <textarea
                  required
                  rows={5}
                  placeholder={t("Tell me about your project...", "Parlez-moi de votre projet...")}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="svc-detail-input"
                />
                <button type="submit" className="svc-detail-btn svc-detail-btn-primary">
                  <i className="fab fa-whatsapp" />
                  {t("Send via WhatsApp", "Envoyer via WhatsApp")}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <BackToTop />
    </>
  );
}
