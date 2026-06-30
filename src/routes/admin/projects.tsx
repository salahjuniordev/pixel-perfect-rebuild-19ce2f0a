import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";
import { FormModal, Field, inputCls } from "@/components/admin/FormModal";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { useCrud } from "@/lib/use-crud";
import type { Tables } from "@/integrations/supabase/types";

type Row = Tables<"projects">;
const empty: Partial<Row> = { title: "", description: "", category: "Web Development", image_url: "", link_url: "", order_index: 0, published: true };

export const Route = createFileRoute("/admin/projects")({ component: ProjectsAdmin });

function ProjectsAdmin() {
  const { rows, save, remove } = useCrud<Row>("projects", "order_index", true);
  const [editing, setEditing] = useState<Partial<Row> | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <AdminShell
      title="Projects"
      subtitle="Curate your portfolio"
      actions={<button onClick={() => setEditing({ ...empty, order_index: rows.length + 1 })} className="btn-brand !py-2 !px-4 text-sm"><i className="fa-solid fa-plus" /> New Project</button>}
    >
      <CrudTable
        rows={rows}
        columns={[
          { key: "image_url", label: "", render: (r) => r.image_url
              ? <img src={r.image_url} alt="" className="h-12 w-20 object-cover rounded" />
              : <div className="h-12 w-20 rounded bg-white/5" /> },
          { key: "title", label: "Title", render: (r) => <div className="text-white font-medium">{r.title}</div> },
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
          const ok = await save(editing);
          setBusy(false);
          if (ok) setEditing(null);
        }}
      >
        {editing && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Title"><input required className={inputCls} value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
              <Field label="Category"><input className={inputCls} value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></Field>
            </div>
            <Field label="Description"><textarea rows={3} className={inputCls} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
            <Field label="Image / video">
              <MediaUpload value={editing.image_url} onChange={(url) => setEditing({ ...editing, image_url: url })} />
            </Field>
            <Field label="Project URL">
              <input className={inputCls} value={editing.link_url ?? ""} onChange={(e) => setEditing({ ...editing, link_url: e.target.value })} />
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
