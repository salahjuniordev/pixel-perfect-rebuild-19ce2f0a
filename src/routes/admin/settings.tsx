import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Field, inputCls } from "@/components/admin/FormModal";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/lib/activity";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/settings")({ component: SettingsAdmin });

type Settings = Tables<"site_settings">;

function SettingsAdmin() {
  const [s, setS] = useState<Partial<Settings> | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setS(data ?? { brand_name: "Salah Junior" }));
  }, []);

  if (!s) {
    return (
      <AdminShell title="Platform Settings" subtitle="Loading…">
        <div className="text-slate-400">Loading…</div>
      </AdminShell>
    );
  }

  const set = <K extends keyof Settings>(k: K, v: any) => setS({ ...s, [k]: v });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { id, created_at, updated_at, ...rest } = s as any;
    const op = id
      ? supabase.from("site_settings").update(rest).eq("id", id)
      : supabase.from("site_settings").insert(rest).select("*").single();
    const { error, data } = await op;
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
    logActivity("update", "site_settings", id ?? (data as any)?.id);
    if (data && !Array.isArray(data)) setS(data as any);
  };

  return (
    <AdminShell
      title="Platform Settings"
      subtitle="Branding, contact, and social links — applied site-wide"
    >
      <form onSubmit={submit} className="space-y-8 max-w-4xl">
        <Section title="Branding" icon="fa-palette">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Brand name">
              <input
                className={inputCls}
                value={s.brand_name ?? ""}
                onChange={(e) => set("brand_name", e.target.value)}
                required
              />
            </Field>
            <Field label="Tagline">
              <input
                className={inputCls}
                value={s.tagline ?? ""}
                onChange={(e) => set("tagline", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Logo">
            <MediaUpload
              value={s.logo_url}
              onChange={(url) => set("logo_url", url)}
              accept="image/*"
              label="Upload logo"
            />
          </Field>
          <Field label="Favicon">
            <MediaUpload
              value={s.favicon_url}
              onChange={(url) => set("favicon_url", url)}
              accept="image/*"
              label="Upload favicon"
            />
          </Field>
          <Field label="Resume / CV (PDF)">
            <MediaUpload
              value={s.resume_url}
              onChange={(url) => set("resume_url", url)}
              accept=".pdf,application/pdf"
              label="Upload resume"
            />
          </Field>
        </Section>

        <Section title="Hero & About" icon="fa-quote-left">
          <Field label="Hero title">
            <input
              className={inputCls}
              value={s.hero_title ?? ""}
              onChange={(e) => set("hero_title", e.target.value)}
            />
          </Field>
          <Field label="Hero subtitle">
            <input
              className={inputCls}
              value={s.hero_subtitle ?? ""}
              onChange={(e) => set("hero_subtitle", e.target.value)}
            />
          </Field>
          <Field label="About text">
            <textarea
              rows={4}
              className={inputCls}
              value={s.about_text ?? ""}
              onChange={(e) => set("about_text", e.target.value)}
            />
          </Field>
        </Section>

        <Section title="Contact" icon="fa-envelope">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email">
              <input
                className={inputCls}
                value={s.contact_email ?? ""}
                onChange={(e) => set("contact_email", e.target.value)}
              />
            </Field>
            <Field label="Phone">
              <input
                className={inputCls}
                value={s.contact_phone ?? ""}
                onChange={(e) => set("contact_phone", e.target.value)}
              />
            </Field>
            <Field label="WhatsApp">
              <input
                className={inputCls}
                value={s.whatsapp_number ?? ""}
                onChange={(e) => set("whatsapp_number", e.target.value)}
              />
            </Field>
            <Field label="Location">
              <input
                className={inputCls}
                value={s.location ?? ""}
                onChange={(e) => set("location", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section title="Social Links" icon="fa-share-nodes">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["social_github", "GitHub"],
              ["social_linkedin", "LinkedIn"],
              ["social_twitter", "Twitter / X"],
              ["social_instagram", "Instagram"],
              ["social_facebook", "Facebook"],
              ["social_youtube", "YouTube"],
            ].map(([k, label]) => (
              <Field key={k} label={label}>
                <input
                  className={inputCls}
                  value={(s as any)[k] ?? ""}
                  onChange={(e) => set(k as any, e.target.value)}
                />
              </Field>
            ))}
          </div>
        </Section>

        <Section title="Footer" icon="fa-shoe-prints">
          <Field label="Footer text">
            <textarea
              rows={2}
              className={inputCls}
              value={s.footer_text ?? ""}
              onChange={(e) => set("footer_text", e.target.value)}
            />
          </Field>
        </Section>

        <div className="sticky bottom-0 bg-[var(--ink)] py-4 -mx-2 px-2 border-t border-white/5 flex justify-end">
          <button disabled={saving} className="btn-brand !py-2.5 !px-6">
            <i className={`fa-solid ${saving ? "fa-spinner fa-spin" : "fa-floppy-disk"}`} />
            {saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
      </form>
    </AdminShell>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-[#0a1120] border border-white/5 p-6 space-y-4">
      <h3 className="text-white font-semibold flex items-center gap-2">
        <i className={`fa-solid ${icon} text-[var(--brand)]`} />
        {title}
      </h3>
      {children}
    </section>
  );
}
