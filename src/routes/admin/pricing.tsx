import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";
import { FormModal, Field, inputCls } from "@/components/admin/FormModal";
import { useCrud } from "@/lib/use-crud";
import type { Tables } from "@/integrations/supabase/types";

type Row = Tables<"pricing_tiers">;
const empty: Partial<Row> = {
  name: "", description: "", price: "$0", period: "/ project", features: [] as any,
  highlighted: false, order_index: 0, published: true,
};

export const Route = createFileRoute("/admin/pricing")({ component: PricingAdmin });

function PricingAdmin() {
  const { rows, save, remove } = useCrud<Row>("pricing_tiers", "order_index", true);
  const [editing, setEditing] = useState<Partial<Row> | null>(null);
  const [featuresText, setFeaturesText] = useState("");
  const [busy, setBusy] = useState(false);

  const openEdit = (r: Partial<Row>) => {
    setEditing(r);
    const feats = Array.isArray(r.features) ? (r.features as string[]) : [];
    setFeaturesText(feats.join("\n"));
  };

  return (
    <AdminShell
      title="Pricing Tiers"
      subtitle="Plans displayed on the pricing section"
      actions={<button onClick={() => openEdit({ ...empty, order_index: rows.length + 1 })} className="btn-brand !py-2 !px-4 text-sm"><i className="fa-solid fa-plus" /> New Tier</button>}
    >
      <CrudTable
        rows={rows}
        columns={[
          { key: "name", label: "Plan", render: (r) => (
            <div>
              <div className="text-white font-medium">{r.name} {r.highlighted && <span className="ml-2 text-[10px] uppercase tracking-wider text-[var(--brand)]">Featured</span>}</div>
              <div className="text-xs text-slate-500">{r.description}</div>
            </div>
          ) },
          { key: "price", label: "Price", render: (r) => <span className="text-white font-bold">{r.price}<span className="text-xs text-slate-500 ml-1">{r.period}</span></span> },
          { key: "order_index", label: "Order" },
          { key: "published", label: "Status", render: (r) => (
            <span className={`text-xs px-2 py-1 rounded ${r.published ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400"}`}>{r.published ? "Live" : "Hidden"}</span>
          ) },
        ]}
        onEdit={openEdit}
        onDelete={(r) => remove(r.id)}
      />

      <FormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit Tier" : "New Tier"}
        busy={busy}
        onSubmit={async (e) => {
          e.preventDefault();
          if (!editing) return;
          setBusy(true);
          const features = featuresText.split("\n").map((s) => s.trim()).filter(Boolean);
          const ok = await save({ ...editing, features: features as any });
          setBusy(false);
          if (ok) setEditing(null);
        }}
      >
        {editing && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Plan name"><input required className={inputCls} value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
              <Field label="Description"><input className={inputCls} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Price (display)"><input className={inputCls} value={editing.price ?? ""} onChange={(e) => setEditing({ ...editing, price: e.target.value })} /></Field>
              <Field label="Period"><input className={inputCls} value={editing.period ?? ""} onChange={(e) => setEditing({ ...editing, period: e.target.value })} /></Field>
            </div>
            <Field label="Features" hint="One per line">
              <textarea rows={6} className={inputCls} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} />
            </Field>
            <div className="grid sm:grid-cols-3 gap-4 items-end">
              <Field label="Order"><input type="number" className={inputCls} value={editing.order_index ?? 0} onChange={(e) => setEditing({ ...editing, order_index: Number(e.target.value) })} /></Field>
              <label className="inline-flex items-center gap-2 text-sm text-slate-300 pb-2.5">
                <input type="checkbox" checked={!!editing.highlighted} onChange={(e) => setEditing({ ...editing, highlighted: e.target.checked })} className="accent-[var(--brand)]" />
                Featured
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
