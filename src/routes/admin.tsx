import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

function AdminLayout() {
  const { session, isAdmin, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!session) nav({ to: "/auth" });
    else if (!isAdmin) nav({ to: "/" });
  }, [loading, session, isAdmin, nav]);

  if (loading || !session || !isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-[var(--ink)] text-slate-400">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-[var(--brand)] text-2xl mb-3 block" />
          <p className="text-sm">Authorizing…</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
