import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";
import { FormModal, Field, inputCls } from "@/components/admin/FormModal";
import { RichEditor } from "@/components/admin/RichEditor";
import { useCrud } from "@/lib/use-crud";
import type { Tables } from "@/integrations/supabase/types";

type Post = Tables<"blog_posts">;
const empty: Partial<Post> = {
  slug: "", title: "", excerpt: "", body: "<p></p>", tag: "Web Development", read_time: "5 min read",
  cover_image_url: "", published: true,
};

export const Route = createFileRoute("/admin/blog")({ component: BlogAdmin });

function BlogAdmin() {
  const { rows, save, remove } = useCrud<Post>("blog_posts", "created_at", false);
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <AdminShell
      title="Blog Posts"
      subtitle="Write, edit, and publish articles"
      actions={
        <button onClick={() => setEditing({ ...empty })} className="btn-brand !py-2 !px-4 text-sm">
          <i className="fa-solid fa-plus" /> New Post
        </button>
      }
    >
      <CrudTable
        rows={rows}
        columns={[
          { key: "title", label: "Title", render: (r) => (
            <div>
              <div className="text-white font-medium">{r.title}</div>
              <div className="text-xs text-slate-500">/{r.slug}</div>
            </div>
          ) },
          { key: "tag", label: "Tag", render: (r) => <span className="text-xs px-2 py-1 rounded bg-[var(--brand)]/15 text-[var(--brand)]">{r.tag}</span> },
          { key: "published", label: "Status", render: (r) => (
            <span className={`text-xs px-2 py-1 rounded ${r.published ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400"}`}>
              {r.published ? "Published" : "Draft"}
            </span>
          ) },
        ]}
        onEdit={(r) => setEditing(r)}
        onDelete={(r) => remove(r.id)}
        empty="No blog posts yet."
      />

      <FormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit Post" : "New Post"}
        busy={busy}
        onSubmit={async (e) => {
          e.preventDefault();
          if (!editing) return;
          setBusy(true);
          const payload = { ...editing, published_at: editing.published ? (editing.published_at ?? new Date().toISOString()) : null };
          const ok = await save(payload);
          setBusy(false);
          if (ok) setEditing(null);
        }}
      >
        {editing && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Title">
                <input className={inputCls} value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required />
              </Field>
              <Field label="Slug" hint="URL-friendly identifier">
                <input className={inputCls} value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} required />
              </Field>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Tag"><input className={inputCls} value={editing.tag ?? ""} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} /></Field>
              <Field label="Read time"><input className={inputCls} value={editing.read_time ?? ""} onChange={(e) => setEditing({ ...editing, read_time: e.target.value })} /></Field>
              <Field label="Cover image URL"><input className={inputCls} value={editing.cover_image_url ?? ""} onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })} /></Field>
            </div>
            <Field label="Excerpt">
              <textarea className={inputCls} rows={2} value={editing.excerpt ?? ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
            </Field>
            <Field label="Body">
              <RichEditor value={editing.body ?? ""} onChange={(v) => setEditing({ ...editing, body: v })} />
            </Field>
            <label className="inline-flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={!!editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="accent-[var(--brand)]" />
              Published
            </label>
          </>
        )}
      </FormModal>
    </AdminShell>
  );
}
