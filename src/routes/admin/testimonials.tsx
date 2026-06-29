import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";
import { FormModal, Field, inputCls } from "@/components/admin/FormModal";
import { useCrud } from "@/lib/use-crud";
import type { Tables } from "@/integrations/supabase/types";

type Row = Tables<"testimonials">;
const empty: Partial<Row> = { name: "", role: "", company: "", content: "", rating: 5, avatar_url: "", order_index: 0, published: true };

export const Route = createFileRoute("/admin/testimonials")({ component: TestimonialsAdmin });

function TestimonialsAdmin() {
  const { rows, save, remove } = useCrud<Row>("testimonials", "order_index", true);
  const [editing, setEditing] = useState<Partial<Row> | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <AdminShell
      title="Testimonials"
      subtitle="Client reviews"
      actions={<button onClick={() => setEditing({ ...empty, order_index: rows.length + 1 })} className="btn-brand !py-2 !px-4 text-sm"><i className="fa-solid fa-plus" /> New Testimonial</button>}
    >
      <CrudTable
        rows={rows}
        columns={[
          { key: "name", label: "Name", render: (r) => (
            <div>
              <div className="text-white font-medium">{r.name}</div>
              <div className="text-xs text-slate-500">{r.role}{r.company ? ` · ${r.company}` : ""}</div>
            </div>
          ) },
          { key: "rating", label: "Rating", render: (r) => <span className="text-amber-400">{"★".repeat(Math.round(r.rating))}</span> },
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
        title={editing?.id ? "Edit Testimonial" : "New Testimonial"}
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
              <Field label="Name"><input required className={inputCls} value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
              <Field label="Avatar URL"><input className={inputCls} value={editing.avatar_url ?? ""} onChange={(e) => setEditing({ ...editing, avatar_url: e.target.value })} /></Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Role"><input className={inputCls} value={editing.role ?? ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} /></Field>
              <Field label="Company"><input className={inputCls} value={editing.company ?? ""} onChange={(e) => setEditing({ ...editing, company: e.target.value })} /></Field>
            </div>
            <Field label="Quote"><textarea rows={4} className={inputCls} value={editing.content ?? ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} /></Field>
            <div className="grid sm:grid-cols-3 gap-4 items-end">
              <Field label="Rating (1-5)"><input type="number" step="0.5" min={1} max={5} className={inputCls} value={editing.rating ?? 5} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} /></Field>
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
