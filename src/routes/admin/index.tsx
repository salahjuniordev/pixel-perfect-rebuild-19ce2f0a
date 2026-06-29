import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/")({ component: Overview });

const cards = [
  { table: "blog_posts", label: "Blog Posts", icon: "fa-newspaper", to: "/admin/blog" },
  { table: "projects", label: "Projects", icon: "fa-briefcase", to: "/admin/projects" },
  { table: "services", label: "Services", icon: "fa-screwdriver-wrench", to: "/admin/services" },
  { table: "testimonials", label: "Testimonials", icon: "fa-comment-dots", to: "/admin/testimonials" },
  { table: "pricing_tiers", label: "Pricing Tiers", icon: "fa-tags", to: "/admin/pricing" },
] as const;

function Overview() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const result: Record<string, number> = {};
      for (const c of cards) {
        const { count } = await supabase.from(c.table).select("*", { count: "exact", head: true });
        result[c.table] = count ?? 0;
      }
      setCounts(result);
    })();
  }, []);

  return (
    <AdminShell title="Dashboard Overview" subtitle="Manage every piece of content on your portfolio">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => (
          <Link key={c.table} to={c.to} className="card-dark group cursor-pointer">
            <div className="flex items-start justify-between mb-6">
              <div className="h-12 w-12 rounded-xl bg-[var(--brand)]/15 grid place-items-center text-[var(--brand)] text-xl">
                <i className={`fa-solid ${c.icon}`} />
              </div>
              <i className="fa-solid fa-arrow-right text-slate-500 group-hover:text-[var(--brand)] group-hover:translate-x-1 transition-all" />
            </div>
            <div className="text-3xl font-bold text-white">
              {counts[c.table] ?? <i className="fa-solid fa-spinner fa-spin text-base text-slate-500" />}
            </div>
            <div className="text-sm text-slate-400 mt-1">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10 card-dark">
        <h3 className="text-lg font-bold text-white mb-2">Welcome back</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          Use the sidebar to manage blog posts, projects, services, testimonials, and pricing tiers.
          All content is stored in the database and rendered on the public site instantly after you save.
        </p>
      </div>
    </AdminShell>
  );
}
