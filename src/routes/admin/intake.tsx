import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { INTAKE_STATUS, kindForService } from "@/lib/intake-schema";

type Submission = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  service_id: string | null;
  service_title: string;
  budget: string | null;
  deadline: string | null;
  answers: Record<string, string | boolean>;
  message: string;
  status: keyof typeof INTAKE_STATUS;
  admin_notes: string;
};

const BUDGET_LABELS: Record<string, string> = {
  "<100k": "Under 100k FCFA",
  "100-300k": "100k – 300k FCFA",
  "300-700k": "300k – 700k FCFA",
  "700k+": "700k+ FCFA",
  unsure: "Not sure yet",
};

const DEADLINE_LABELS: Record<string, string> = {
  rush: "ASAP (rush)",
  "1m": "Within 1 month",
  "3m": "1–3 months",
  flexible: "Flexible",
};

const STATUS_ORDER = ["new", "in_review", "quoted", "won", "archived"] as const;

/**
 * Typed accessor for project_intake. The table is created by migration
 * 20260922120000_create_project_intake.sql; until Supabase typegen runs
 * against the live table, cast the builder (same approach as IntakeForm).
 */
const intakeAdmin = () =>
  (supabase.from("project_intake" as never) as unknown as {
    select: (cols: string) => {
      order: (col: string, opts: { ascending: boolean }) => Promise<{ data: Submission[] | null; error: unknown }>;
    };
    update: (patch: { status?: string; admin_notes?: string }) => {
      eq: (col: string, v: string) => Promise<{ error: unknown }>;
    };
    delete: () => {
      eq: (col: string, v: string) => Promise<{ error: unknown }>;
    };
  });

export const Route = createFileRoute("/admin/intake")({ component: IntakeAdmin });

function IntakeAdmin() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileDetail, setMobileDetail] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await intakeAdmin().select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter],
  );
  const selected = rows.find((r) => r.id === selectedId) ?? null;

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    for (const s of STATUS_ORDER) c[s] = rows.filter((r) => r.status === s).length;
    return c;
  }, [rows]);

  const setStatus = async (id: string, status: string) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: status as Submission["status"] } : r)));
    await intakeAdmin().update({ status }).eq("id", id);
  };

  const saveNotes = async (id: string, admin_notes: string) => {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, admin_notes } : r)));
    await intakeAdmin().update({ admin_notes }).eq("id", id);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this submission permanently?")) return;
    await intakeAdmin().delete().eq("id", id);
    setRows((rs) => rs.filter((r) => r.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const statusBadge = (s: string) => {
    const meta = INTAKE_STATUS[s] ?? INTAKE_STATUS.new;
    return (
      <span className={`text-xs px-2 py-1 rounded font-medium ${meta.cls}`}>{meta.label}</span>
    );
  };

  return (
    <AdminShell
      title="Project Requests"
      subtitle="Intake form submissions from your service pages"
      actions={
        <button onClick={load} className="btn-brand !py-2 !px-4 text-sm" title="Refresh">
          <i className={`fa-solid fa-rotate ${loading ? "fa-spin" : ""}`} /> Refresh
        </button>
      }
    >
      {/* Status filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", ...STATUS_ORDER] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition ${
              filter === s
                ? "bg-[var(--brand)]/15 text-[var(--brand)] border-[var(--brand)]/40"
                : "border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {s === "all" ? "All" : INTAKE_STATUS[s].label}
            <span className="ml-1.5 opacity-70">{counts[s] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6 items-start">
        {/* List */}
        <div className={`lg:col-span-2 space-y-3 ${mobileDetail ? "hidden lg:block" : ""}`}>
          {loading && <p className="text-sm text-slate-400 py-8 text-center"><i className="fa-solid fa-spinner fa-spin mr-2" />Loading…</p>}
          {!loading && filtered.length === 0 && (
            <div className="card-dark text-center py-10">
              <i className="fa-solid fa-inbox text-3xl text-slate-600 mb-3" />
              <p className="text-sm text-slate-400">No submissions here yet.</p>
            </div>
          )}
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => { setSelectedId(r.id); setMobileDetail(true); }}
              className={`w-full text-left card-dark !p-4 transition ${
                selectedId === r.id ? "!border-[var(--brand)]/60 ring-1 ring-[var(--brand)]/40" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-white font-medium truncate">{r.name}</span>
                {statusBadge(r.status)}
              </div>
              <div className="text-xs text-[var(--brand)] mb-1 truncate">{r.service_title || "—"}</div>
              <div className="text-xs text-slate-500 truncate">
                {new Date(r.created_at).toLocaleDateString()} · {r.email}
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className={`lg:col-span-3 ${mobileDetail ? "" : "hidden lg:block"}`}>
          {!selected ? (
            <div className="card-dark text-center py-16">
              <i className="fa-solid fa-file-lines text-3xl text-slate-600 mb-4" />
              <p className="text-slate-400 text-sm">
                Select a request on the left to see the full project brief.
              </p>
            </div>
          ) : (
            <DetailPanel
              key={selected.id}
              row={selected}
              onStatus={setStatus}
              onNotes={saveNotes}
              onDelete={remove}
              onBack={() => setMobileDetail(false)}
            />
          )}
        </div>
      </div>
    </AdminShell>
  );
}

function DetailPanel({ row, onStatus, onNotes, onDelete, onBack }: {
  row: Submission;
  onStatus: (id: string, status: string) => void;
  onNotes: (id: string, notes: string) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}) {
  const [notes, setNotes] = useState(row.admin_notes);
  const [savedFlash, setSavedFlash] = useState(false);
  const kind = useMemo(() => kindForService(row.service_title), [row.service_title]);

  const saveNotes = () => {
    onNotes(row.id, notes);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const waLink = row.phone
    ? `https://wa.me/${row.phone.replace(/[^0-9]/g, "")}`
    : null;

  return (
    <div className="card-dark !p-6 space-y-6">
      <div className="lg:hidden">
        <button onClick={onBack} className="text-sm text-slate-400 hover:text-white mb-4">
          <i className="fa-solid fa-arrow-left mr-2" />Back to list
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">{row.name}</h3>
          <p className="text-sm text-[var(--brand)]">{row.service_title || "—"}</p>
        </div>
        <div className="flex items-center gap-2">
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              onClick={() => onStatus(row.id, s)}
              title={`Mark as ${INTAKE_STATUS[s].label}`}
              className={`text-xs px-2.5 py-1.5 rounded-lg border transition ${
                row.status === s
                  ? `${INTAKE_STATUS[s].cls} border-transparent`
                  : "border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {INTAKE_STATUS[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="grid sm:grid-cols-2 gap-3 text-sm">
        <a href={`mailto:${row.email}`} className="flex items-center gap-2 text-slate-300 hover:text-[var(--brand)] transition">
          <i className="fa-solid fa-envelope text-[var(--brand)]" /> {row.email}
        </a>
        {row.phone && (
          <span className="flex items-center gap-2 text-slate-300">
            <i className="fa-solid fa-phone text-[var(--brand)]" /> {row.phone}
            {waLink && (
              <a href={waLink} target="_blank" rel="noreferrer" className="text-[var(--brand)] hover:underline ml-1">
                <i className="fab fa-whatsapp" /> WhatsApp
              </a>
            )}
          </span>
        )}
        <span className="flex items-center gap-2 text-slate-400">
          <i className="fa-solid fa-wallet text-[var(--brand)]" /> {row.budget ? BUDGET_LABELS[row.budget] ?? row.budget : "—"}
        </span>
        <span className="flex items-center gap-2 text-slate-400">
          <i className="fa-solid fa-calendar text-[var(--brand)]" /> {row.deadline ? DEADLINE_LABELS[row.deadline] ?? row.deadline : "—"}
        </span>
      </div>

      {/* Service-specific answers */}
      {kind.fields.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
            Project details
          </h4>
          <div className="space-y-3">
            {kind.fields.map((f) => {
              const v = row.answers?.[f.key];
              if (v === undefined || v === "" || v === false) return null;
              return (
                <div key={f.key} className="bg-white/[0.03] rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">{f.label[0]}</div>
                  <div className="text-sm text-slate-200 whitespace-pre-wrap">
                    {typeof v === "boolean"
                      ? "Yes"
                      : f.options?.find((o) => o.value === v)?.label[0] ?? v}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Free-form message */}
      {row.message && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
            Additional notes
          </h4>
          <p className="text-sm text-slate-200 whitespace-pre-wrap bg-white/[0.03] rounded-lg p-3">
            {row.message}
          </p>
        </div>
      )}

      {/* Admin notes */}
      <div>
        <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
          Private notes
        </h4>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Quotes sent, follow-ups, next actions…"
          className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-[var(--brand)]"
        />
        <div className="flex items-center gap-3 mt-2">
          <button onClick={saveNotes} className="text-xs px-3 py-1.5 rounded-lg bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/30 hover:bg-[var(--brand)]/25 transition">
            Save notes
          </button>
          {savedFlash && <span className="text-xs text-emerald-400"><i className="fa-solid fa-check mr-1" />Saved</span>}
          <button
            onClick={() => onDelete(row.id)}
            className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition ml-auto"
          >
            <i className="fa-solid fa-trash mr-1" />Delete
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Received {new Date(row.created_at).toLocaleString()}
      </p>
    </div>
  );
}
