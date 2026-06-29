import { type ReactNode } from "react";

export function FormModal({
  open, onClose, title, children, onSubmit, busy,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  busy?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <form
        onSubmit={onSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl bg-[#0f172a] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white text-lg">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto space-y-4">{children}</div>
        <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-outline !py-2 !px-5 text-sm">Cancel</button>
          <button type="submit" disabled={busy} className="btn-brand !py-2 !px-5 text-sm disabled:opacity-60">
            {busy ? <i className="fa-solid fa-spinner fa-spin" /> : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-500 mt-1">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full bg-[#0a1120] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[var(--brand)] transition-colors";
