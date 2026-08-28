import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { BackToTop } from "@/components/site/BackToTop";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Service = Tables<"services"> & { slug?: string | null; price?: string | null };

export const Route = createFileRoute("/services/$id")({
  component: () => (
    <LanguageProvider>
      <ServiceDetailPage />
    </LanguageProvider>
  ),
});

function ServiceDetailPage() {
  const { t } = useLanguage();
  const { id } = Route.useParams();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  // Quote form state
  const [form, setForm] = useState({ name: "", email: "", details: "" });

  useEffect(() => {
    (async () => {
      setLoading(true);
      // Try slug first, then fall back to id
      let { data } = await supabase
        .from("services")
        .select("*")
        .eq("slug", id)
        .eq("published", true)
        .maybeSingle();

      if (!data) {
        const result = await supabase
          .from("services")
          .select("*")
          .eq("id", id)
          .eq("published", true)
          .maybeSingle();
        data = result.data;
      }

      if (!data) setMissing(true);
      else setService(data as Service);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-slate-400">
        <i className="fa-solid fa-spinner fa-spin text-[var(--brand)] text-2xl" />
      </div>
    );
  }

  if (missing || !service) throw notFound();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello Salah, I'm interested in your ${service!.title} service.%0A%0AName: ${form.name}%0AEmail: ${form.email}%0A%0ADetails: ${form.details}`;
    window.open(`https://wa.me/237683693011?text=${text}`, "_blank");
  };

  // Sample benefits and deliverables (will be enriched by admin content later)
  const benefits = [
    t("Fast, scalable, and modern solutions", "Solutions modernes, rapides et évolutives"),
    t("Tailored to your specific needs", "Adaptées à vos besoins spécifiques"),
    t("Ongoing support and maintenance", "Support et maintenance continus"),
    t("Clean code and best practices", "Code propre et bonnes pratiques"),
  ];

  const deliverables = [
    t("Responsive design", "Design responsive"),
    t("SEO optimization", "Optimisation SEO"),
    t("Performance optimization", "Optimisation des performances"),
    t("30-day post-launch support", "Support 30 jours après le lancement"),
  ];

  return (
    <>
      <Navbar />

      {/* Hero section */}
      <section className="svc-detail-hero">
        <div className="container-sj">
          <Link
            to="/"
            hash="services"
            className="text-sm text-[--brand] hover:underline mb-6 inline-flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left" /> {t("Back to Services", "Retour aux Services")}
          </Link>

          <h1 className="svc-detail-title">{service.title}</h1>
          <p className="svc-detail-tagline">{service.title}</p>
          <p className="svc-detail-desc">{service.description}</p>

          <div className="svc-detail-actions">
            <a href="#portfolio" className="svc-btn-primary">
              {t("View My Project", "Voir Mon Projet")}
            </a>
            <a href="#contact" className="svc-btn-outline">
              {t("Request a Quote", "Demander un Devis")}
            </a>
          </div>
        </div>
      </section>

      {/* Benefits + Deliverables */}
      <section className="svc-detail-body">
        <div className="container-sj">
          <div className="svc-detail-cols">
            <div>
              <h2 className="svc-detail-section-title">
                <i className="fa-solid fa-check-circle" />
                {t("What you get out of it", "Ce que vous obtenez")}
              </h2>
              <ul className="svc-detail-list">
                {benefits.map((b) => (
                  <li key={b}>
                    <i className="fa-solid fa-check" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="svc-detail-section-title">
                <i className="fa-solid fa-box-open" />
                {t("Deliverables", "Livrables")}
              </h2>
              <ul className="svc-detail-list">
                {deliverables.map((d) => (
                  <li key={d}>
                    <i className="fa-solid fa-check" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Quote */}
      <section className="svc-pricing-section">
        <div className="container-sj">
          <div className="svc-pricing-header">
            <div>
              <h2 className="svc-pricing-title">
                {t("Pricing", "Tarification")} <span>&</span> {t("Scope", "Périmètre")}
              </h2>
              <p className="svc-pricing-sub">
                {t(
                  "Transparent pricing, so you'll get no hidden surprises.",
                  "Tarification transparente, sans surprises cachées."
                )}
              </p>
            </div>
            <div className="svc-pricing-tabs">
              <button className="svc-pricing-tab active">{t("Basic", "Basique")}</button>
              <button className="svc-pricing-tab">{t("Standard", "Standard")}</button>
              <button className="svc-pricing-tab">{t("Premium", "Premium")}</button>
            </div>
          </div>

          <div className="svc-pricing-grid">
            {/* Pricing card */}
            <div className="svc-pricing-card">
              <h3 className="svc-pricing-card-name">{t("Basic Package", "Forfait Basique")}</h3>
              <p className="svc-pricing-card-price">
                {service.price ? (
                  <>
                    {t("Starting at", "À partir de")} <strong>{service.price}</strong> {t("project", "projet")}
                  </>
                ) : (
                  <span className="text-[--brand] font-semibold">{t("Contact for pricing", "Contacter pour tarification")}</span>
                )}
              </p>

              <h4>{t("Features", "Fonctionnalités")}</h4>
              <ul>
                <li><i className="fa-solid fa-check" /> {t("1 revision round", "1 tour de révision")}</li>
                <li><i className="fa-solid fa-check" /> {t("Responsive design", "Design responsive")}</li>
                <li><i className="fa-solid fa-check" /> {t("Basic SEO", "SEO basique")}</li>
                <li><i className="fa-solid fa-check" /> {t("Fast load", "Chargement rapide")}</li>
              </ul>

              <h4>{t("Estimated Scope", "Périmètre estimé")}</h4>
              <ul>
                <li><i className="fa-solid fa-check" /> {t("Landing page or simple site", "Page d'accueil ou site simple")}</li>
                <li><i className="fa-solid fa-check" /> {t("Up to 5 pages", "Jusqu'à 5 pages")}</li>
                <li><i className="fa-solid fa-check" /> {t("Contact form", "Formulaire de contact")}</li>
              </ul>
            </div>

            {/* Quote form */}
            <div className="svc-quote-card">
              <h3 className="svc-quote-title">
                <i className="fa-solid fa-paper-plane" />
                {t("Request a Quote", "Demander un Devis")}
              </h3>
              <p className="svc-quote-sub">
                {t(
                  "Tell me about your project and I'll get back to you within 24 hours.",
                  "Parlez-moi de votre projet et je vous répondrai sous 24 heures."
                )}
              </p>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="svc-quote-field"
                  placeholder={t("Your Name", "Votre Nom")}
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  type="email"
                  className="svc-quote-field"
                  placeholder={t("Email Address", "Adresse E-mail")}
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <textarea
                  className="svc-quote-field"
                  placeholder={t("Tell me about your project...", "Parlez-moi de votre projet...")}
                  rows={4}
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                />
                <button type="submit" className="svc-quote-submit">
                  <i className="fa-solid fa-paper-plane" />
                  {t("Submit Request", "Envoyer la Demande")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </>
  );
}
