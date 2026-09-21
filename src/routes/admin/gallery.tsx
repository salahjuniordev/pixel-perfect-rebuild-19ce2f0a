import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";
import { FormModal, Field, inputCls } from "@/components/admin/FormModal";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { SuggestButton } from "@/components/admin/SuggestButton";
import { useCrud } from "@/lib/use-crud";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Row = {
  id: string;
  url: string;
  alt: string | null;
  caption: string | null;
  size: "big" | "small";
  link_url: string | null;
  order_index: number;
  published: boolean;
};

const empty: Partial<Row> = {
  url: "",
  alt: "",
  caption: "",
  size: "small",
  link_url: "",
  order_index: 0,
  published: true,
};

export const Route = createFileRoute("/admin/gallery")({ component: GalleryAdmin });

function GalleryAdmin() {
  const { rows, save, remove } = useCrud<Row>("gallery_items", "order_index", true);
  const [editing, setEditing] = useState<Partial<Row> | null>(null);
  const [busy, setBusy] = useState(false);
  const bigCount = rows.filter((r) => r.size === "big").length;
  const smallCount = rows.length - bigCount;

  return (
    <AdminShell
      title="Design Gallery"
      subtitle="Images for the scrolling homepage gallery — tag each as Big or Small"
      actions={<button onClick={() => setEditing({ ...empty, order_index: rows.length + 1 })} className="btn-brand !py-2 !px-4 text-sm"><i className="fa-solid fa-plus" /> New Image</button>}
    >
      <div className="flex gap-3 mb-4 text-xs text-slate-400">
        <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">
          <i className="fa-solid fa-up-right-and-down-left-from-center mr-1.5 text-emerald-400" />{bigCount} big
        </span>
        <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">
          <i className="fa-solid fa-down-left-and-up-right-to-center mr-1.5 text-sky-400" />{smallCount} small
        </span>
        <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">
          <i className="fa-solid fa-circle-info mr-1.5" />section shows once you have 3+ published
        </span>
      </div>

      <CrudTable
        rows={rows}
        columns={[
          { key: "url", label: "", render: (r) => r.url
              ? <img src={r.url} alt="" className="h-12 w-20 object-cover rounded" />
              : <div className="h-12 w-20 rounded bg-white/5" /> },
          { key: "caption", label: "Caption", render: (r) => <div className="text-white font-medium">{r.caption || "—"}</div> },
          { key: "size", label: "Size", render: (r) => (
              <span className={`text-xs px-2 py-1 rounded ${r.size === "big" ? "bg-emerald-500/15 text-emerald-400" : "bg-sky-500/15 text-sky-400"}`}>{r.size}</span>
            ) },
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
        title={editing?.id ? "Edit Image" : "New Image"}
        busy={busy}
        onSubmit={async (e) => {
          e.preventDefault();
          if (!editing) return;
          setBusy(true);
          const ok = await save(editing as Row);
          setBusy(false);
          if (ok) setEditing(null);
        }}
      >
        {editing && (
          <>
            <Field label="Image" hint="Design work, poster, branding shot…">
              <MediaUpload value={editing.url} onChange={(url) => setEditing({ ...editing, url })} accept="image/*" label="Upload image" />
            </Field>
            {editing.url && !/\.(mp4|webm|mov)(\?|$)/i.test(editing.url) && (
              <div className="flex items-center gap-2 text-xs text-slate-400 -mt-1">
                <SuggestButton
                  imageUrl={editing.url}
                  onResult={(r) =>
                    setEditing((prev) =>
                      prev
                        ? {
                            ...prev,
                            caption: r.caption || prev.caption,
                            alt: r.alt || prev.alt,
                            size: r.size ?? prev.size,
                          }
                        : prev,
                    )
                  }
                  label="AI fill caption, alt & size"
                />
                <span>fills the three fields below as editable drafts</span>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Size" hint="Big cards alternate with small ones on the strip">
                <select className={inputCls} value={editing.size ?? "small"} onChange={(e) => setEditing({ ...editing, size: e.target.value as "big" | "small" })}>
                  <option value="small">Small</option>
                  <option value="big">Big</option>
                </select>
              </Field>
              <Field label="Caption" hint="Shows on hover">
                <input className={inputCls} value={editing.caption ?? ""} onChange={(e) => setEditing({ ...editing, caption: e.target.value })} />
              </Field>
            </div>
            <Field label="Alt text" hint="What crawlers and screen readers read">
              <input className={inputCls} value={editing.alt ?? ""} onChange={(e) => setEditing({ ...editing, alt: e.target.value })} />
            </Field>
            <Field label="Link (optional)" hint="Opens in a new tab when the image is clicked">
              <input type="url" className={inputCls} value={editing.link_url ?? ""} onChange={(e) => setEditing({ ...editing, link_url: e.target.value })} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4 items-end">
              <Field label="Order"><input type="number" className={inputCls} value={editing.order_index ?? 0} onChange={(e) => setEditing({ ...editing, order_index: Number(e.target.value) })} /></Field>
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
