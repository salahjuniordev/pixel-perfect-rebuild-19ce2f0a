/**
 * Per-service intake field schemas.
 *
 * Every service maps to one of a handful of "kinds" by title matching.
 * Each kind defines the extra fields a client should fill beyond the
 * common ones (name / email / phone / budget / deadline / message).
 *
 * Adding a field = edit here only. No migration, no admin form.
 */

export type IntakeFieldType = "text" | "textarea" | "select" | "checkbox";

export type IntakeField = {
  key: string;
  /** Bilingual label: [en, fr]. */
  label: [string, string];
  /** Bilingual placeholder/hint. */
  placeholder?: [string, string];
  type: IntakeFieldType;
  required?: boolean;
  /** For select: option values with bilingual labels. */
  options?: Array<{ value: string; label: [string, string] }>;
  /** Row layout hint: fields with half:true share a row. */
  half?: boolean;
};

export type IntakeKind = {
  key: string;
  /** Substrings (lowercase) matched against the service title. First match wins. */
  match: string[];
  fields: IntakeField[];
};

export const INTAKE_KINDS: IntakeKind[] = [
  {
    key: "web",
    match: ["web", "website", "site", "development", "développement", "e-commerce", "seo", "référencement"],
    fields: [
      {
        key: "project_type",
        label: ["Type of project", "Type de projet"],
        type: "select",
        required: true,
        options: [
          { value: "landing", label: ["Landing page (1 page)", "Landing page (1 page)"] },
          { value: "vitrine", label: ["Business website (multi-page)", "Site vitrine (multi-pages)"] },
          { value: "ecommerce", label: ["E-commerce / online store", "E-commerce / boutique en ligne"] },
          { value: "webapp", label: ["Web app / platform", "Application web / plateforme"] },
          { value: "redesign", label: ["Redesign of an existing site", "Refonte d'un site existant"] },
          { value: "other", label: ["Something else", "Autre chose"] },
        ],
      },
      {
        key: "current_site",
        label: ["Current website (if any)", "Site actuel (si existant)"],
        placeholder: ["https://… or “none”", "https://… ou « aucun »"],
        type: "text",
        half: true,
      },
      {
        key: "features",
        label: ["Key features needed", "Fonctionnalités principales"],
        placeholder: ["e.g. payments, booking, blog, admin panel…", "ex. paiements, réservation, blog, back-office…"],
        type: "textarea",
      },
      {
        key: "has_content",
        label: ["I already have my content (texts/images)", "J'ai déjà mon contenu (textes/images)"],
        type: "checkbox",
      },
    ],
  },
  {
    key: "design",
    match: ["ui/ux", "design", "graphic", "graphique", "maquette", "prototype"],
    fields: [
      {
        key: "deliverables",
        label: ["What should I design?", "Que dois-je designer ?"],
        type: "select",
        required: true,
        options: [
          { value: "logo", label: ["Logo", "Logo"] },
          { value: "identity", label: ["Full brand identity (logo + colors + guide)", "Identité complète (logo + couleurs + charte)"] },
          { value: "ui", label: ["UI design (app/website screens)", "Design UI (écrans app/site)"] },
          { value: "print", label: ["Print (flyers, posters, business cards)", "Print (flyers, affiches, cartes de visite)"] },
          { value: "social", label: ["Social media visuals", "Visuels réseaux sociaux"] },
          { value: "other", label: ["Something else", "Autre chose"] },
        ],
      },
      {
        key: "brand_assets",
        label: ["Existing brand assets (colors, fonts, logo…)", "Éléments de marque existants (couleurs, polices, logo…)"],
        placeholder: ["Describe them, or leave empty if starting fresh", "Décrivez-les, ou laissez vide si on part de zéro"],
        type: "textarea",
      },
      {
        key: "formats",
        label: ["Files needed at delivery", "Fichiers attendus à la livraison"],
        placeholder: ["e.g. PNG, SVG, PDF, source files…", "ex. PNG, SVG, PDF, fichiers sources…"],
        type: "text",
      },
    ],
  },
  {
    key: "branding",
    match: ["branding", "identity", "identité", "brand"],
    fields: [
      {
        key: "brand_stage",
        label: ["Where is your brand today?", "Où en est votre marque ?"],
        type: "select",
        required: true,
        options: [
          { value: "new", label: ["Starting from scratch", "Je pars de zéro"] },
          { value: "refresh", label: ["Rebranding / refresh", "Rebranding / modernisation"] },
          { value: "extend", label: ["Existing brand, extending materials", "Marque existante, à décliner"] },
        ],
      },
      {
        key: "brand_personality",
        label: ["Brand personality (3–5 words)", "Personnalité de la marque (3–5 mots)"],
        placeholder: ["e.g. bold, modern, trustworthy…", "ex. audacieux, moderne, fiable…"],
        type: "text",
        half: true,
      },
      {
        key: "audience",
        label: ["Target audience", "Public cible"],
        placeholder: ["Who are your customers?", "Qui sont vos clients ?"],
        type: "text",
        half: true,
      },
      {
        key: "inspiration",
        label: ["Brands you admire / references", "Marques que vous admirez / références"],
        type: "textarea",
      },
    ],
  },
  {
    key: "admin",
    match: ["office", "administration", "bureautique", "secretarial", "data"],
    fields: [
      {
        key: "task_type",
        label: ["Type of task", "Type de tâche"],
        type: "select",
        required: true,
        options: [
          { value: "documents", label: ["Document management", "Gestion documentaire"] },
          { value: "data_entry", label: ["Data entry", "Saisie de données"] },
          { value: "reporting", label: ["Reports / presentations", "Rapports / présentations"] },
          { value: "recurring", label: ["Recurring support", "Support récurrent"] },
          { value: "other", label: ["Something else", "Autre chose"] },
        ],
      },
      {
        key: "volume",
        label: ["Approximate volume / frequency", "Volume / fréquence approximative"],
        placeholder: ["e.g. 200 rows/week, 2 days per month…", "ex. 200 lignes/semaine, 2 jours/mois…"],
        type: "text",
        half: true,
      },
      {
        key: "tools",
        label: ["Tools you use", "Outils utilisés"],
        placeholder: ["e.g. Excel, Google Sheets, Word…", "ex. Excel, Google Sheets, Word…"],
        type: "text",
        half: true,
      },
    ],
  },
];

/** Fallback for services that match no kind above. */
const GENERIC_FIELDS: IntakeField[] = [
  {
    key: "context",
    label: ["Tell me about your project", "Parlez-moi de votre projet"],
    placeholder: ["Goals, audience, anything that helps…", "Objectifs, public, tout ce qui peut aider…"],
    type: "textarea",
  },
];

export function kindForService(title: string): IntakeKind {
  const t = (title || "").toLowerCase();
  for (const k of INTAKE_KINDS) {
    if (k.match.some((m) => t.includes(m))) return k;
  }
  return { key: "generic", match: [], fields: GENERIC_FIELDS };
}

export const INTAKE_BUDGETS: Array<{ value: string; label: [string, string] }> = [
  { value: "<100k", label: ["Under 100k FCFA", "Moins de 100k FCFA"] },
  { value: "100-300k", label: ["100k – 300k FCFA", "100k – 300k FCFA"] },
  { value: "300-700k", label: ["300k – 700k FCFA", "300k – 700k FCFA"] },
  { value: "700k+", label: ["700k+ FCFA", "700k+ FCFA"] },
  { value: "unsure", label: ["Not sure yet", "Je ne sais pas encore"] },
];

export const INTAKE_DEADLINES: Array<{ value: string; label: [string, string] }> = [
  { value: "rush", label: ["ASAP (rush)", "Au plus vite"] },
  { value: "1m", label: ["Within 1 month", "Sous 1 mois"] },
  { value: "3m", label: ["1–3 months", "1–3 mois"] },
  { value: "flexible", label: ["Flexible", "Flexible"] },
];

export const INTAKE_STATUS: Record<string, { label: string; cls: string }> = {
  new: { label: "New", cls: "bg-red-500/15 text-red-400" },
  in_review: { label: "In review", cls: "bg-amber-500/15 text-amber-400" },
  quoted: { label: "Quoted", cls: "bg-sky-500/15 text-sky-400" },
  won: { label: "Won", cls: "bg-emerald-500/15 text-emerald-400" },
  archived: { label: "Archived", cls: "bg-slate-500/15 text-slate-400" },
};
