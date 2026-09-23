import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  kindForService,
  INTAKE_BUDGETS,
  INTAKE_DEADLINES,
  type IntakeField,
} from "@/lib/intake-schema";

/**
 * Typed row for project_intake. The table is created by migration
 * 20260922120000_create_project_intake.sql; until Supabase typegen runs
 * against it, the generated Database type doesn't include it yet, so we
 * cast the builder (same approach as site_settings.intro_video_url in About.tsx).
 */
type IntakeInsert = {
  name: string;
  email: string;
  phone: string | null;
  service_id: string | null;
  service_title: string;
  budget: string | null;
  deadline: string | null;
  answers: Record<string, string | boolean>;
  message: string;
  honeypot: string;
};

const intakeTable = () =>
  (supabase.from("project_intake" as never) as unknown as {
    insert: (row: IntakeInsert) => Promise<{ error: { message: string } | null }>;
  });

type Translate = (en: string, fr: string) => string;

const inputCls =
  "w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[var(--brand)] transition-colors";

export function IntakeForm({ serviceId, serviceTitle, t }: {
  /** Null = general request from /start with no specific service. */
  serviceId: string | null;
  serviceTitle: string;
  t: Translate;
}) {
  const kind = useMemo(() => kindForService(serviceTitle), [serviceTitle]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    budget: "",
    deadline: "",
    message: "",
    honeypot: "",
  });
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAnswer = (key: string, value: string | boolean) =>
    setAnswers((a) => ({ ...a, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { error: err } = await intakeTable().insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        service_id: serviceId ?? null,
        service_title: serviceTitle,
        budget: form.budget || null,
        deadline: form.deadline || null,
        answers,
        message: form.message.trim(),
        honeypot: form.honeypot,
      });
      if (err) throw err;
      setDone(true);
    } catch {
      setError(
        t(
          "Something went wrong sending your request. Please try again or reach me directly on WhatsApp.",
          "Une erreur est survenue. Veuillez réessayer ou me contacter directement sur WhatsApp.",
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-3xl mx-auto text-center py-14">
        <div className="w-16 h-16 rounded-full bg-[var(--brand)]/15 grid place-items-center mx-auto mb-6">
          <i className="fa-solid fa-check text-[var(--brand)] text-2xl" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          {t("Request received!", "Demande bien reçue !")}
        </h3>
        <p className="text-slate-300 leading-relaxed max-w-xl mx-auto">
          {t(
            "Thank you — your project brief is in. I review every request personally and will get back to you within 24 hours with questions or a quote.",
            "Merci — votre brief est bien arrivé. J'étudie chaque demande personnellement et je reviens vers vous sous 24 heures avec des questions ou un devis.",
          )}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-3xl mx-auto space-y-5">
      {/* Honeypot — hidden from humans, catnip for bots */}
      <input
        type="text"
        name="company_website"
        value={form.honeypot}
        onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
        className="absolute opacity-0 pointer-events-none -z-10"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Contact */}
      <div>
        <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
          {t("1 · About you", "1 · Vous")}
        </h4>
        <div className="grid sm:grid-cols-3 gap-4">
          <input required minLength={2} maxLength={120} placeholder={t("Your name *", "Votre nom *")} className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required type="email" placeholder={t("Email *", "E-mail *")} className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="tel" placeholder={t("Phone / WhatsApp", "Téléphone / WhatsApp")} className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
      </div>

      {/* Budget & deadline */}
      <div>
        <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
          {t("2 · Budget & timeline", "2 · Budget & délai")}
        </h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <select className={inputCls} value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
            <option value="">{t("Budget range…", "Fourchette de budget…")}</option>
            {INTAKE_BUDGETS.map((b) => (
              <option key={b.value} value={b.value}>{t(b.label[0], b.label[1])}</option>
            ))}
          </select>
          <select className={inputCls} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })}>
            <option value="">{t("Deadline…", "Échéance…")}</option>
            {INTAKE_DEADLINES.map((d) => (
              <option key={d.value} value={d.value}>{t(d.label[0], d.label[1])}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Service-specific questions */}
      {kind.fields.length > 0 && (
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
            {t("3 · About the project", "3 · Le projet")}
          </h4>
          <div className="grid sm:grid-cols-2 gap-4">
            {kind.fields.map((f) => (
              <FieldInput key={f.key} field={f} value={answers[f.key]} onChange={(v) => setAnswer(f.key, v)} t={t} />
            ))}
          </div>
        </div>
      )}

      {/* Message */}
      <div>
        <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
          {t("4 · Anything else", "4 · Autre chose")}
        </h4>
        <textarea
          rows={4}
          maxLength={5000}
          placeholder={t(
            "Anything else I should know? (optional)",
            "Autre chose que je devrais savoir ? (optionnel)",
          )}
          className={inputCls}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation" /> {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="svc-detail-btn svc-detail-btn-primary w-full sm:w-auto disabled:opacity-50"
      >
        {busy ? (
          <><i className="fa-solid fa-spinner fa-spin" /> {t("Sending…", "Envoi…")}</>
        ) : (
          <><i className="fa-solid fa-paper-plane" /> {t("Send project request", "Envoyer ma demande")}</>
        )}
      </button>
    </form>
  );
}

function FieldInput({ field, value, onChange, t }: {
  field: IntakeField;
  value: string | boolean | undefined;
  onChange: (v: string | boolean) => void;
  t: Translate;
}) {
  const label = t(field.label[0], field.label[1]);
  const wrapper = field.type === "checkbox" ? "sm:col-span-2" : field.half ? "" : "sm:col-span-2";

  return (
    <div className={wrapper}>
      {field.type === "checkbox" ? (
        <label className="inline-flex items-center gap-3 text-sm text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 accent-[var(--brand)]"
          />
          {label}
        </label>
      ) : (
        <>
          <label className="block text-xs text-slate-400 mb-1.5">
            {label}{field.required && <span className="text-[var(--brand)]"> *</span>}
          </label>
          {field.type === "textarea" ? (
            <textarea
              rows={3}
              required={field.required}
              placeholder={field.placeholder ? t(field.placeholder[0], field.placeholder[1]) : ""}
              className={inputCls}
              value={typeof value === "string" ? value : ""}
              onChange={(e) => onChange(e.target.value)}
            />
          ) : field.type === "select" ? (
            <select
              required={field.required}
              className={inputCls}
              value={typeof value === "string" ? value : ""}
              onChange={(e) => onChange(e.target.value)}
            >
              <option value="">{t("Choose…", "Choisir…")}</option>
              {(field.options ?? []).map((o) => (
                <option key={o.value} value={o.value}>{t(o.label[0], o.label[1])}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              required={field.required}
              placeholder={field.placeholder ? t(field.placeholder[0], field.placeholder[1]) : ""}
              className={inputCls}
              value={typeof value === "string" ? value : ""}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </>
      )}
    </div>
  );
}
