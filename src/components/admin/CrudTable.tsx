import { type ReactNode } from "react";

export type Column<T> = {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
};

export function CrudTable<T extends { id: string }>({
  rows, columns, onEdit, onDelete, empty,
}: {
  rows: T[];
  columns: Column<T>[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  empty?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="card-dark text-center py-16 text-slate-400">
        <i className="fa-regular fa-folder-open text-3xl text-[var(--brand)] mb-3 block" />
        {empty ?? "No items yet. Create your first one."}
      </div>
    );
  }
  return (
    <div className="card-dark !p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.03] text-slate-400 uppercase text-xs tracking-wider">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={`text-left px-5 py-3 font-medium ${c.className ?? ""}`}>{c.label}</th>
              ))}
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                {columns.map((c) => (
                  <td key={c.key} className={`px-5 py-4 align-middle ${c.className ?? ""}`}>
                    {c.render ? c.render(row) : (row as any)[c.key]}
                  </td>
                ))}
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <button onClick={() => onEdit(row)} className="text-slate-300 hover:text-[var(--brand)] px-2" title="Edit">
                    <i className="fa-solid fa-pen-to-square" />
                  </button>
                  <button onClick={() => onDelete(row)} className="text-slate-300 hover:text-red-400 px-2" title="Delete">
                    <i className="fa-solid fa-trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
