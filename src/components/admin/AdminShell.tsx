import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useState, type ReactNode } from "react";

const nav = [
  { to: "/admin", label: "Overview", icon: "fa-gauge-high", exact: true },
  { to: "/admin/blog", label: "Blog Posts", icon: "fa-newspaper" },
  { to: "/admin/projects", label: "Projects", icon: "fa-briefcase" },
  { to: "/admin/services", label: "Services", icon: "fa-screwdriver-wrench" },
  { to: "/admin/testimonials", label: "Testimonials", icon: "fa-comment-dots" },
  { to: "/admin/pricing", label: "Pricing", icon: "fa-tags" },
];

export function AdminShell({ title, subtitle, actions, children }: {
  title: string; subtitle?: string; actions?: ReactNode; children: ReactNode;
}) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--ink)] text-slate-200 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 z-40 bg-[#0a1120] border-r border-white/5 flex flex-col transition-transform ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-6 py-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand)] text-white font-bold">SJ</span>
            <span>
              <span className="block text-white font-bold leading-tight">Salah Junior</span>
              <span className="block text-xs text-[var(--brand)]">Admin Studio</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {nav.map((n) => {
            const active = n.exact ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={`group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-[var(--brand)]/15 text-[var(--brand)] shadow-[inset_0_0_0_1px_rgba(14,165,233,0.25)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <i className={`fa-solid ${n.icon} w-4 text-center`} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--brand-dark)] grid place-items-center text-white text-sm font-bold">
              {user?.email?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0">
              <div className="text-xs text-slate-400">Signed in as</div>
              <div className="text-sm text-white truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={async () => { await signOut(); navigate({ to: "/auth" }); }}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <i className="fa-solid fa-arrow-right-from-bracket" /> Sign out
          </button>
        </div>
      </aside>

      {/* Backdrop mobile */}
      {open && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-[var(--ink)]/85 backdrop-blur border-b border-white/5">
          <div className="px-6 lg:px-10 py-5 flex items-center gap-4">
            <button onClick={() => setOpen((o) => !o)} className="lg:hidden text-slate-300 text-xl">
              <i className="fa-solid fa-bars" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl lg:text-2xl font-bold text-white truncate">{title}</h1>
              {subtitle && <p className="text-sm text-slate-400 truncate">{subtitle}</p>}
            </div>
            {actions}
          </div>
        </header>
        <div className="px-6 lg:px-10 py-8">{children}</div>
      </main>
    </div>
  );
}
