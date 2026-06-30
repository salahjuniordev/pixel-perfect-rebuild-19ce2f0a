import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin/activity")({ component: ActivityAdmin });

type Row = Tables<"activity_log">;

const actionStyles: Record<string, string> = {
  create: "bg-emerald-500/15 text-emerald-400",
  update: "bg-amber-500/15 text-amber-400",
  delete: "bg-red-500/15 text-red-400",
};

function ActivityAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    let q = supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(500);
    if (filter !== "all") q = q.eq("action", filter);
    q.then(({ data }) => {
      setRows((data as Row[]) ?? []);
      setLoading(false);
    });
  }, [filter]);

  return (
    <AdminShell
      title="Activity Log"
      subtitle="Audit trail of every create, update, and delete"
      actions={
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[#0a1120] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200"
        >
          <option value="all">All actions</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
        </select>
      }
    >
      <div className="rounded-2xl bg-[#0a1120] border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">
            <i className="fa-solid fa-spinner fa-spin mr-2" />Loading…
          </div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No activity yet.</div>
        ) : (
          <>
            {/* Desktop table */}
            <table className="w-full text-sm hidden md:table">
              <thead className="text-xs uppercase text-slate-500 border-b border-white/5">
                <tr>
                  <th className="text-left px-5 py-3">When</th>
                  <th className="text-left px-5 py-3">User</th>
                  <th className="text-left px-5 py-3">Action</th>
                  <th className="text-left px-5 py-3">Resource</th>
                  <th className="text-left px-5 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-3 text-slate-400 whitespace-nowrap">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-slate-300 truncate max-w-[220px]">{r.user_email ?? "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded ${actionStyles[r.action] ?? "bg-slate-500/15 text-slate-400"}`}>
                        {r.action}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-300">
                      <div className="font-medium">{r.resource_type}</div>
                      {r.resource_id && <div className="text-xs text-slate-500 truncate max-w-[180px]">{r.resource_id}</div>}
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500 font-mono truncate max-w-[260px]">
                      {r.details ? JSON.stringify(r.details) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-white/5">
              {rows.map((r) => (
                <div key={r.id} className="p-4 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${actionStyles[r.action] ?? "bg-slate-500/15 text-slate-400"}`}>
                      {r.action} · {r.resource_type}
                    </span>
                    <span className="text-xs text-slate-500">{new Date(r.created_at).toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-slate-400 truncate">{r.user_email}</div>
                  {r.details && (
                    <div className="text-xs text-slate-500 font-mono truncate">{JSON.stringify(r.details)}</div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}
