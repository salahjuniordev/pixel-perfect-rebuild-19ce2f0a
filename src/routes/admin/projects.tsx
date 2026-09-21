import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";
import { FormModal, Field, inputCls } from "@/components/admin/FormModal";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { SuggestButton } from "@/components/admin/SuggestButton";
import { useCrud } from "@/lib/use-crud";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Row = Tables<"projects"> & {
  gallery?: { url: string; alt?: string }[] | null;
  featured?: boolean | null;
  client?: string | null;
  year?: string | null;
  tags?: string[] | null;
  cover_alt?: string | null;
};

// Local type — the generated supabase types may lag behind the project_categories migration.
type Category = {
  id: string;
  name: string;
  slug: string;
  has_link: boolean;
  order_index: number;
  published: boolean | null;
};

type GalleryItem = { url: string; alt?: string };

function toGallery(value: unknown): GalleryItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (v): v is GalleryItem => !!v && typeof v === "object" && typeof (v as any).url === "string",
  );
}

const empty: Partial<Row> = {
  title: "",
  description: "",
  category: "Web Development",
  image_url: "",
  link_url: "",
  order_index: 0,
  published: true,
  gallery: [],
  featured: false,
  tags: [],
};

export const Route = createFileRoute("/admin/projects")({ component: ProjectsAdmin });

function ProjectsAdmin() {
  const { rows, save, remove } = useCrud<Row>("projects", "order_index", true);
  const [editing, setEditing] = useState<Partial<Row> | null>(null);
  const [busy, setBusy] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    ((supabase as any)
      .from("project_categories"))
      .select("*")
      .order("order_index", { ascending: true })
      .then(({ data }: { data: unknown }) => setCategories((data as Category[]) ?? []));
  }, []);

  const editingCategory = categories.find((c) => c.name === editing?.category);
  // Web-type categories get a live link; visual categories get a gallery instead.
  const showLink = editingCategory ? editingCategory.has_link : true;
  const showGallery = editingCategory ? !editingCategory.has_link : false;

  return (
    <AdminShell
      title="Projects"
      subtitle="Curate your portfolio"
      actions={<button onClick={() => setEditing({ ...empty, order_index: rows.length + 1 })} className="btn-brand !py-2 !px-4 text-sm"><i className="fa-solid fa-plus" /> New Project</button>}
    >
      <CrudTable
        rows={rows}
        columns={[
          { key: "image_url", label: "", render: (r) => {
              const g = toGallery(r.gallery);
              const cover = r.image_url ?? g[0]?.url;
              return cover
                ? <img src={cover} alt="" className="h-12 w-20 object-cover rounded" />
                : <div className="h-12 w-20 rounded bg-white/5" />;
            } },
          { key: "title", label: "Title", render: (r) => (
              <div className="text-white font-medium">
                {r.title}
                {r.featured && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 uppercase tracking-wide">Featured</span>}
              </div>
            ) },
          { key: "category", label: "Category" },
          { key: "order_index", label: "Order" },
          { key: "published", label: "Status", render: (r) => (
            <span className={`text-xs px-2 py-1 rounded ${r.published ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400"}`}>{r.published ? "Live" : "Hidden"}</span>
          ) },
        ]}
        onEdit={setEditing}
        onDelete={(r) => remove(r.id)}
      />

      <FormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit Project" : "New Project"}
        busy={busy}
        onSubmit={async (e) => {
          e.preventDefault();
          if (!editing) return;
          setBusy(true);
          const payload = { ...editing };
          // Visual categories shouldn't keep a stale link; web categories shouldn't ship a gallery.
          if (showGallery) payload.link_url = null;
          if (!showGallery) payload.gallery = [];
          // Auto-slug from the title if empty so detail pages work.
          if (!payload.slug && payload.title) {
            payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
          }
          const ok = await save(payload as Row);
          setBusy(false);
          if (ok) setEditing(null);
        }}
      >
        {editing && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Title"><input required className={inputCls} value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
              <Field label="Category" hint={editingCategory ? (editingCategory.has_link ? "Web project — live link shown" : "Visual work — image gallery shown") : undefined}>
                <select
                  className={inputCls}
                  value={editing.category ?? ""}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                >
                  <option value="" disabled>Select a category…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Description" hint="Shown on featured cards and in search results">
              <div className="space-y-1.5">
                <textarea rows={3} className={inputCls} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <SuggestButton
                    kind="description"
                    context={`Project: ${editing.title ?? ""}${editing.category ? ` (${editing.category})` : ""}. Client: ${editing.client || "not specified"}.`}
                    onResult={(r) => r.text && setEditing((prev) => (prev ? { ...prev, description: r.text! } : prev))}
                    label="AI draft"
                  />
                  <span>uses the title, category & client above</span>
                </div>
              </div>
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Client" hint="Who it was for (optional)">
                <input className={inputCls} value={editing.client ?? ""} onChange={(e) => setEditing({ ...editing, client: e.target.value })} />
              </Field>
              <Field label="Year">
                <input className={inputCls} placeholder="2026" value={editing.year ?? ""} onChange={(e) => setEditing({ ...editing, year: e.target.value })} />
              </Field>
            </div>

            <Field label="Cover image" hint="Main image on the card">
              <MediaUpload value={editing.image_url} onChange={(url) => setEditing({ ...editing, image_url: url })} />
            </Field>
            <Field label="Cover alt text" hint="Describe the image for accessibility + Google Images (e.g. “L'Ours Blanc pressing website homepage”)">
              <input className={inputCls} value={editing.cover_alt ?? ""} onChange={(e) => setEditing({ ...editing, cover_alt: e.target.value })} />
            </Field>

            {showLink && (
              <Field label="Project URL" hint="Live site link — opens in a new tab">
                <input type="url" className={inputCls} value={editing.link_url ?? ""} onChange={(e) => setEditing({ ...editing, link_url: e.target.value })} />
              </Field>
            )}

            {showGallery && (
              <Field
                label={`Gallery (${toGallery(editing.gallery).length} images)`}
                hint="Upload each image of the design work — shown as a showcase on the project page"
              >
                <GalleryEditor
                  items={toGallery(editing.gallery)}
                  onChange={(gallery) => setEditing({ ...editing, gallery })}
                />
              </Field>
            )}

            <Field label="Tags" hint="Comma-separated, e.g. React, Supabase, Figma — shown as chips on featured cards">
              <div className="space-y-1.5">
                <input
                  className={inputCls}
                  value={(editing.tags ?? []).join(", ")}
                  onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                />
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <SuggestButton
                    kind="tags"
                    context={`Project: ${editing.title ?? ""}${editing.category ? ` (${editing.category})` : ""}. Description: ${editing.description || "n/a"}.`}
                    onResult={(r) =>
                      r.text &&
                      setEditing((prev) =>
                        prev ? { ...prev, tags: r.text!.split(",").map((s) => s.trim()).filter(Boolean) } : prev,
                      )
                    }
                    label="AI suggest"
                  />
                </div>
              </div>
            </Field>

            <Field label="Case Study (HTML — creates a detail page at /projects/slug)">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <SuggestButton
                    kind="case_study"
                    context={`Project: ${editing.title ?? ""}${editing.category ? ` (${editing.category})` : ""}. Client: ${editing.client || "independent"}. Description: ${editing.description || "n/a"}. Tags: ${(editing.tags ?? []).join(", ")}.`}
                    onResult={(r) => r.text && setEditing((prev) => (prev ? { ...prev, case_study: r.text! } as any : prev))}
                    label="AI draft case study"
                  />
                  <span>replaces the editor content — copy anything you want to keep first</span>
                </div>
                <textarea
                  rows={6}
                  className={inputCls}
                  placeholder={"<h2>The Problem</h2>\n<p>…</p>\n<h2>What I Built</h2>\n<p>…</p>"}
                  value={(editing as any).case_study ?? ""}
                  onChange={(e) => setEditing({ ...editing, case_study: e.target.value } as any)}
                />
              </div>
            </Field>

            <div className="grid sm:grid-cols-3 gap-4 items-end">
              <Field label="Order"><input type="number" className={inputCls} value={editing.order_index ?? 0} onChange={(e) => setEditing({ ...editing, order_index: Number(e.target.value) })} /></Field>
              <label className="inline-flex items-center gap-2 text-sm text-slate-300 pb-2.5">
                <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="accent-[var(--brand)]" />
                Featured (big card)
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-300 pb-2.5">
                <input type="checkbox" checked={!!editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="accent-[var(--brand)]" />
                Published
              </label>
            </div>
          </>
        )}
      </FormModal>
    </AdminShell>
  );
}

/** Multi-image list with per-image alt text and reordering, for visual-work categories. */
function GalleryEditor({ items, onChange }: { items: GalleryItem[]; onChange: (items: GalleryItem[]) => void }) {
  const update = (i: number, patch: Partial<GalleryItem>) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2 bg-[#07101f] border border-white/10 rounded-lg p-2">
          <img src={item.url} alt="" className="h-14 w-20 object-cover rounded" />
          <div className="flex-1 space-y-2">
            <input
              className={inputCls}
              placeholder="Alt text (what crawlers and screen readers read)"
              value={item.alt ?? ""}
              onChange={(e) => update(i, { alt: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <button type="button" className="text-slate-400 hover:text-white disabled:opacity-30" disabled={i === 0} onClick={() => {
              const next = [...items]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; onChange(next);
            }} aria-label="Move up"><i className="fa-solid fa-arrow-up" /></button>
            <button type="button" className="text-slate-400 hover:text-white disabled:opacity-30" disabled={i === items.length - 1} onClick={() => {
              const next = [...items]; [next[i + 1], next[i]] = [next[i], next[i + 1]]; onChange(next);
            }} aria-label="Move down"><i className="fa-solid fa-arrow-down" /></button>
            <button type="button" className="text-red-400 hover:text-red-300" onClick={() => onChange(items.filter((_, idx) => idx !== i))} aria-label="Remove"><i className="fa-solid fa-trash" /></button>
          </div>
        </div>
      ))}
      <MediaUpload
        label="Add image to gallery"
        onChange={(url) => onChange([...items, { url, alt: "" }])}
      />
    </div>
  );
}
