import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  kindForService,
  INTAKE_BUDGETS,
  INTAKE_DEADLINES,
  type IntakeField,
} from "@/lib/intake-schema";

/**
 * Typed insert for project_intake. The table is created by migration
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
    insert: (row: IntakeInsert) => Promise<{ error: { message: string; hint?: string | null } | null }>;
  });

type Translate = (en: string, fr: string) => string;

const inputCls =
  "w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[var(--brand)] transition-colors";
const errorCls =
  "w-full rounded-lg bg-red-500/10 border border-red-500/50 px-4 py-2.5 text-sm text-white placeholder:text-red-300/60 outline-none focus:border-red-400 transition-colors";

type Errors = Partial<Record<"name" | "email" | "phone" | "message" | string, string>>;

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
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<{ title: string; body: string } | null>(null);

  const setAnswer = (key: string, value: string | boolean) =>
    setAnswers((a) => ({ ...a, [key]: value }));

  /** Client-side mirror of the database guards — instant feedback, no wasted round-trip. */
  const validate = (): Errors => {
    const e: Errors = {};
    const name = form.name.trim();
    const email = form.email.trim();
    if (name.length < 2) e.name = t("Please enter your name (at least 2 characters).", "Veuillez saisir votre nom (au moins 2 caractères).");
    else if (name.length > 120) e.name = t("Name is too long (max 120).", "Le nom est trop long (max 120).");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = t("Please enter a valid email address.", "Veuillez saisir une adresse e-mail valide.");
    if (form.phone.trim() && form.phone.trim().length > 40) e.phone = t("Phone number is too long (max 40).", "Le numéro est trop long (max 40).");
    if (form.message.trim().length > 5000) e.message = t("Message is too long (max 5000 characters).", "Le message est trop long (max 5000 caractères).");
    for (const f of kind.fields) {
      if (f.type === "text" || f.type === "textarea") {
        const v = typeof answers[f.key] === "string" ? (answers[f.key] as string) : "";
        if (f.required && !v.trim()) e[f.key] = t("This field is required.", "Ce champ est requis.");
        else if (v.length > 1000) e[f.key] = t("Too long (max 1000 characters).", "Trop long (max 1000 caractères).");
      }
    }
    return e;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const fieldErrors = validate();
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      // Focus the first invalid field so the user can fix it immediately.
      const firstKey = Object.keys(fieldErrors)[0];
      document.getElementById(`intake-${firstKey}`)?.focus();
      return;
    }

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
    } catch (ex) {
      // Supabase throws a plain object (not an Error instance) — stringify safely.
      const msg = JSON.stringify(ex ?? {});
      if (msg.includes("INTAKE_RATE_LIMITED")) {
        setSubmitError({
          title: t("You've already sent a few requests.", "Vous avez déjà envoyé plusieurs demandes."),
          body: t(
            "For anti-spam, I limit requests to 3 per hour per email. Please try again a bit later — or message me directly on WhatsApp and I'll answer right away.",
            "Pour éviter le spam, les demandes sont limitées à 3 par heure et par e-mail. Réessayez un peu plus tard — ou écrivez-moi directement sur WhatsApp, je répondrai tout de suite.",
          ),
        });
      } else if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("network")) {
        setSubmitError({
          title: t("Connection problem.", "Problème de connexion."),
          body: t(
            "Your request couldn't reach the server. Check your internet connection and try again — your answers are still in the form.",
            "Votre demande n'a pas pu atteindre le serveur. Vérifiez votre connexion et réessayez — vos réponses sont toujours dans le formulaire.",
          ),
        });
      } else {
        setSubmitError({
          title: t("Your request couldn't be sent.", "Votre demande n'a pas pu être envoyée."),
          body: t(
            "Something went wrong on our side. Please try once more — if it still fails, message me on WhatsApp and I'll take it from there.",
            "Une erreur est survenue de notre côté. Réessayez une fois — si ça échoue encore, écrivez-moi sur WhatsApp et je prends le relais.",
          ),
        });
      }
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-3xl mx-auto text-center py-14" role="status">
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
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <a
            href="https://wa.me/237683693011"
            target="_blank"
            rel="noreferrer"
            className="svc-detail-btn svc-detail-btn-ghost !py-2.5"
          >
            <i className="fab fa-whatsapp" />
            {t("Need me faster? WhatsApp me", "Plus rapide ? WhatsApp")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="max-w-3xl mx-auto space-y-5">
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
          <Field id="intake-name" label={t("Your name *", "Votre nom *")} error={errors.name}>
            <input
              id="intake-name"
              type="text"
              minLength={2}
              maxLength={120}
              aria-invalid={!!errors.name}
              placeholder={t("Your name *", "Votre nom *")}
              className={errors.name ? errorCls : inputCls}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field id="intake-email" label={t("Email *", "E-mail *")} error={errors.email}>
            <input
              id="intake-email"
              type="email"
              aria-invalid={!!errors.email}
              placeholder={t("Email *", "E-mail *")}
              className={errors.email ? errorCls : inputCls}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field id="intake-phone" label={t("Phone / WhatsApp", "Téléphone / WhatsApp")} error={errors.phone}>
            <input
              id="intake-phone"
              type="tel"
              maxLength={40}
              aria-invalid={!!errors.phone}
              placeholder={t("Phone / WhatsApp", "Téléphone / WhatsApp")}
              className={errors.phone ? errorCls : inputCls}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
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
              <FieldInput
                key={f.key}
                field={f}
                id={`intake-${f.key}`}
                value={answers[f.key]}
                error={errors[f.key]}
                onChange={(v) => setAnswer(f.key, v)}
                t={t}
              />
            ))}
          </div>
        </div>
      )}

      {/* Message */}
      <div>
        <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
          {t("4 · Anything else", "4 · Autre chose")}
        </h4>
        <Field id="intake-message" label={t("Anything else I should know? (optional)", "Autre chose que je devrais savoir ? (optionnel)")} error={errors.message}>
          <textarea
            id="intake-message"
            rows={4}
            maxLength={5000}
            aria-invalid={!!errors.message}
            placeholder={t(
              "Anything else I should know? (optional)",
              "Autre chose que je devrais savoir ? (optionnel)",
            )}
            className={errors.message ? errorCls : inputCls}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </Field>
      </div>

      {/* Error summary */}
      {submitError && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4" role="alert">
          <p className="text-sm font-semibold text-red-300 flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation" /> {submitError.title}
          </p>
          <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">{submitError.body}</p>
          <a
            href="https://wa.me/237683693011"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[var(--brand)] hover:underline mt-3"
          >
            <i className="fab fa-whatsapp" /> {t("Or message me on WhatsApp", "Ou écrivez-moi sur WhatsApp")}
          </a>
        </div>
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

function Field({ id, label, error, children }: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs text-slate-400 mb-1.5">{label}</label>
      {children}
      {error && (
        <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1.5" role="alert">
          <i className="fa-solid fa-circle-exclamation" />{error}
        </p>
      )}
    </div>
  );
}

function FieldInput({ field, id, value, error, onChange, t }: {
  field: IntakeField;
  id: string;
  value: string | boolean | undefined;
  error?: string;
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
            id={id}
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 accent-[var(--brand)]"
          />
          {label}
        </label>
      ) : (
        <Field id={id} label={`${label}${field.required ? " *" : ""}`} error={error}>
          {field.type === "textarea" ? (
            <textarea
              id={id}
              rows={3}
              required={field.required}
              maxLength={1000}
              aria-invalid={!!error}
              placeholder={field.placeholder ? t(field.placeholder[0], field.placeholder[1]) : ""}
              className={error ? errorCls : inputCls}
              value={typeof value === "string" ? value : ""}
              onChange={(e) => onChange(e.target.value)}
            />
          ) : field.type === "select" ? (
            <select
              id={id}
              required={field.required}
              aria-invalid={!!error}
              className={error ? errorCls : inputCls}
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
              id={id}
              type="text"
              required={field.required}
              maxLength={1000}
              aria-invalid={!!error}
              placeholder={field.placeholder ? t(field.placeholder[0], field.placeholder[1]) : ""}
              className={error ? errorCls : inputCls}
              value={typeof value === "string" ? value : ""}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </Field>
      )}
    </div>
  );
}
