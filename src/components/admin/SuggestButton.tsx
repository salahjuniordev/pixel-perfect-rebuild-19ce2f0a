import { useState } from "react";
import { toast } from "sonner";
import { aiSuggestImage, aiSuggestText } from "@/lib/ai-suggest";

/**
 * ✨ Suggest — asks the AI (server-side, admin-gated) for a draft value
 * and fills the linked field. The result is always editable before save;
 * nothing is written to the DB until the user hits Save.
 */
export function SuggestButton({
  kind,
  imageUrl,
  context,
  onResult,
  label,
}: {
  /** For text drafts: "description" | "case_study" | "tags" | "excerpt" */
  kind?: string;
  /** For image drafts: a public image URL (caption + alt + size) */
  imageUrl?: string;
  /** Text context, e.g. "E-commerce website for a shoe store in Douala" */
  context?: string;
  onResult: (result: { text?: string; caption?: string; alt?: string; size?: "big" | "small" }) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (busy) return;
    setBusy(true);
    try {
      if (imageUrl) {
        const r = await aiSuggestImage({ data: { image_url: imageUrl } });
        onResult(r);
        toast.success("Suggestion ready — review and edit before saving");
      } else if (kind) {
        const r = await aiSuggestText({ data: { kind, context: context ?? "" } });
        onResult(r);
        toast.success("Suggestion ready — review and edit before saving");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Suggestion failed";
      toast.error(msg.includes("GROQ_API_KEY") ? "AI not configured: add GROQ_API_KEY in Settings → Environment" : msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={run}
      disabled={busy}
      title="AI draft — you review before saving"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border border-[var(--brand)]/40 text-[var(--brand)] bg-[var(--brand)]/10 hover:bg-[var(--brand)]/20 disabled:opacity-50 transition"
    >
      {busy ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-wand-magic-sparkles" />}
      {busy ? "Thinking…" : label ?? "Suggest"}
    </button>
  );
}
