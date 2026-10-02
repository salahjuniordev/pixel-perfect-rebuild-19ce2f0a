import { useState } from "react";
import { useLanguage } from "@/lib/language";
import { useResolvedSite } from "@/lib/site-settings";

const serviceTypes = [
  { key: "website", icon: "fa-globe", en: "Website", fr: "Site Web" },
  { key: "ecommerce", icon: "fa-cart-shopping", en: "E-commerce", fr: "E-commerce" },
  { key: "design", icon: "fa-pen-ruler", en: "UI/UX / Branding", fr: "UI/UX / Branding" },
  { key: "other", icon: "fa-lightbulb", en: "Something else", fr: "Autre chose" },
];

const budgets = [
  { key: "<100k", label: { en: "Under 100k FCFA", fr: "Moins de 100k FCFA" } },
  { key: "100-300k", label: { en: "100k – 300k FCFA", fr: "100k – 300k FCFA" } },
  { key: "300-700k", label: { en: "300k – 700k FCFA", fr: "300k – 700k FCFA" } },
  { key: "700k+", label: { en: "700k+ FCFA", fr: "700k+ FCFA" } },
];

const deadlines = [
  { key: "rush", label: { en: "ASAP (rush)", fr: "Au plus vite" } },
  { key: "1m", label: { en: "Within 1 month", fr: "Sous 1 mois" } },
  { key: "flexible", label: { en: "Flexible", fr: "Flexible" } },
];

export function QuoteWizard() {
  const { t, lang } = useLanguage();
  const site = useResolvedSite();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");

  const reset = () => {
    setStep(0);
    setService("");
    setBudget("");
    setDeadline("");
  };

  const finish = () => {
    const svc = serviceTypes.find((s) => s.key === service);
    const b = budgets.find((x) => x.key === budget);
    const d = deadlines.find((x) => x.key === deadline);
    const msg = `${t("Hello Salah! I'd like a quote.", "Bonjour Salah ! Je voudrais un devis.")}\n\n• ${t("Project:", "Projet :")} ${svc ? t(svc.en, svc.fr) : "—"}\n• ${t("Budget:", "Budget :")} ${b ? b.label[lang === "fr" ? "fr" : "en"] : "—"}\n• ${t("Timeline:", "Délai :")} ${d ? d.label[lang === "fr" ? "fr" : "en"] : "—"}\n\n${t("Tell me more about the project:", "Dites-m'en plus sur le projet :")}`;
    window.open(`${site.whatsappUrl}?text=${encodeURIComponent(msg)}`, "_blank");
    setOpen(false);
    reset();
  };

  return (
    <>
      {/* Trigger button, stacked above WhatsApp float */}
      <button
        className="quote-wiz-fab"
        onClick={() => setOpen(true)}
        aria-label={t("Quick quote", "Devis rapide")}
        title={t("Get a quick quote", "Obtenir un devis rapide")}
      >
        <i className="fa-solid fa-bolt" />
      </button>

      {open && (
        <div className="qw-overlay" onClick={() => setOpen(false)}>
          <div className="qw-modal" onClick={(e) => e.stopPropagation()}>
            <button className="qw-close" onClick={() => { setOpen(false); reset(); }} aria-label={t("Close", "Fermer")}>
              <i className="fa-solid fa-xmark" />
            </button>

            <div className="qw-progress">
              {[0, 1, 2].map((i) => (
                <span key={i} className={`qw-dot ${i <= step ? "on" : ""}`} />
              ))}
              <span className="qw-step-label">
                {t("Step", "Étape")} {step + 1}/3
              </span>
            </div>

            {step === 0 && (
              <>
                <h3 className="qw-title">{t("What do you need?", "De quoi avez-vous besoin ?")}</h3>
                <div className="qw-grid">
                  {serviceTypes.map((s) => (
                    <button
                      key={s.key}
                      className={`qw-option ${service === s.key ? "selected" : ""}`}
                      onClick={() => { setService(s.key); setStep(1); }}
                    >
                      <i className={`fa-solid ${s.icon}`} />
                      {t(s.en, s.fr)}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h3 className="qw-title">{t("What's your budget?", "Quel est votre budget ?")}</h3>
                <div className="qw-grid qw-grid-col">
                  {budgets.map((b) => (
                    <button
                      key={b.key}
                      className={`qw-option ${budget === b.key ? "selected" : ""}`}
                      onClick={() => { setBudget(b.key); setStep(2); }}
                    >
                      <i className="fa-solid fa-wallet" />
                      {b.label[lang === "fr" ? "fr" : "en"]}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="qw-title">{t("When do you need it?", "Pour quand ?")}</h3>
                <div className="qw-grid qw-grid-col">
                  {deadlines.map((d) => (
                    <button
                      key={d.key}
                      className={`qw-option ${deadline === d.key ? "selected" : ""}`}
                      onClick={() => { setDeadline(d.key); finish(); }}
                    >
                      <i className="fa-solid fa-calendar-check" />
                      {d.label[lang === "fr" ? "fr" : "en"]}
                    </button>
                  ))}
                </div>
                <button className="qw-back" onClick={() => setStep(1)}>
                  <i className="fa-solid fa-arrow-left" /> {t("Back", "Retour")}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
