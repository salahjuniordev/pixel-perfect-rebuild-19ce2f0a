import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";
import { FormModal, Field, inputCls } from "@/components/admin/FormModal";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { SuggestButton } from "@/components/admin/SuggestButton";
import { useCrud } from "@/lib/use-crud";

type EbookRow = {
  id: string;
  title: string;
  description: string | null;
  price: string | null;
  currency: string | null;
  cover_url: string | null;
  buy_url: string;
  badge: string | null;
  order_index: number;
  published: boolean;
};

const empty: Partial<EbookRow> = {
  title: "",
  description: "",
  price: "",
  currency: "USD",
  cover_url: "",
  buy_url: "",
  badge: "",
  order_index: 0,
  published: true,
};

export const Route = createFileRoute("/admin/ebooks")({ component: EbooksAdmin });

function EbooksAdmin() {
  const { rows, save, remove } = useCrud<EbookRow>("ebooks" as any, "order_index", true);
  const [editing, setEditing] = useState<Partial<EbookRow> | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <AdminShell
      title="Ebooks"
      subtitle="Digital products sold via Gumroad — checkout, delivery and refunds are handled by Gumroad"
      actions={
        <button
          onClick={() => setEditing({ ...empty, order_index: rows.length + 1 })}
          className="btn-brand !py-2 !px-4 text-sm"
        >
          <i className="fa-solid fa-plus" /> New Ebook
        </button>
      }
    >
      <div className="rounded-xl bg-[var(--brand)]/10 border border-[var(--brand)]/20 px-4 py-3 text-sm text-slate-300 mb-4">
        <i className="fa-solid fa-circle-info text-[var(--brand)] mr-2" />
        Upload the ebook file itself in <strong className="text-white">Gumroad</strong> (it handles payment
        + secure delivery), then paste the product's Gumroad link below as the Buy URL.
      </div>

      <CrudTable
        rows={rows}
        columns={[
          {
            key: "cover_url",
            label: "Cover",
            render: (r) =>
              r.cover_url ? (
                <img
                  src={r.cover_url}
                  alt=""
                  className="h-14 w-10 rounded object-cover border border-white/10 bg-black/40"
                />
              ) : (
                <div className="h-14 w-10 rounded bg-white/5 grid place-items-center text-slate-500">
                  <i className="fa-solid fa-book" />
                </div>
              ),
          },
          { key: "title", label: "Title", render: (r) => <div className="text-white font-medium">{r.title}</div> },
          { key: "price", label: "Price" },
          { key: "order_index", label: "Order" },
          {
            key: "published",
            label: "Status",
            render: (r) => (
              <span
                className={`text-xs px-2 py-1 rounded ${
                  r.published ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400"
                }`}
              >
                {r.published ? "Live" : "Hidden"}
              </span>
            ),
          },
        ]}
        onEdit={setEditing}
        onDelete={(r) => remove(r.id)}
      />

      <FormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit Ebook" : "New Ebook"}
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
            <Field label="Title">
              <input
                required
                className={inputCls}
                value={editing.title ?? ""}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
            </Field>
            <Field label="Description">
              <div className="space-y-1.5">
                <textarea
                  rows={3}
                  className={inputCls}
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <SuggestButton
                    kind="ebook_description"
                    context={`Ebook title: ${editing.title ?? ""}.`}
                    onResult={(r) => r.text && setEditing((prev) => (prev ? { ...prev, description: r.text! } : prev))}
                    label="AI draft"
                  />
                </div>
              </div>
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Price" hint="e.g. 9.99">
                <input
                  className={inputCls}
                  value={editing.price ?? ""}
                  onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                />
              </Field>
              <Field label="Currency">
                <select
                  className={inputCls}
                  value={editing.currency ?? "USD"}
                  onChange={(e) => setEditing({ ...editing, currency: e.target.value })}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="XAF">XAF (FCFA)</option>
                </select>
              </Field>
            </div>
            <Field label="Cover image">
              <MediaUpload
                value={editing.cover_url}
                onChange={(url) => setEditing({ ...editing, cover_url: url })}
                accept="image/*"
                label="Upload cover"
              />
            </Field>
            <Field label="Gumroad buy link" hint="https://yourname.gumroad.com/l/your-ebook">
              <input
                required
                type="url"
                placeholder="https://yourname.gumroad.com/l/your-ebook"
                className={inputCls}
                value={editing.buy_url ?? ""}
                onChange={(e) => setEditing({ ...editing, buy_url: e.target.value })}
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4 items-end">
              <Field label="Badge" hint="optional — e.g. New, Bestseller, Free">
                <input
                  className={inputCls}
                  value={editing.badge ?? ""}
                  onChange={(e) => setEditing({ ...editing, badge: e.target.value })}
                />
              </Field>
              <Field label="Order">
                <input
                  type="number"
                  className={inputCls}
                  value={editing.order_index ?? 0}
                  onChange={(e) => setEditing({ ...editing, order_index: Number(e.target.value) })}
                />
              </Field>
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={!!editing.published}
                onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                className="accent-[var(--brand)]"
              />
              Live (visible on the site)
            </label>
          </>
        )}
      </FormModal>
    </AdminShell>
  );
}
