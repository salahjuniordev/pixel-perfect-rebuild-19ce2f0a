import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { CrudTable } from "@/components/admin/CrudTable";
import { FormModal, Field, inputCls } from "@/components/admin/FormModal";
import { RichEditor } from "@/components/admin/RichEditor";
import { MediaUpload } from "@/components/admin/MediaUpload";
import { SuggestButton } from "@/components/admin/SuggestButton";
import { useCrud } from "@/lib/use-crud";
import { cleanSlug } from "@/lib/slug";
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
          // Never store a full URL as the slug — it produced broken links like
          // /blog/https%3A%2F%2Fsalahjuniordev.vercel.app%2Fblog%2F...
          const payload = {
            ...editing,
            slug: cleanSlug(editing.slug ?? ""),
            published_at: editing.published ? (editing.published_at ?? new Date().toISOString()) : null,
          };
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
              <Field label="Slug" hint="URL-friendly identifier — pasted URLs are cleaned automatically">
                <input className={inputCls} value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} required />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Tag"><input className={inputCls} value={editing.tag ?? ""} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} /></Field>
              <Field label="Read time"><input className={inputCls} value={editing.read_time ?? ""} onChange={(e) => setEditing({ ...editing, read_time: e.target.value })} /></Field>
            </div>
            <Field label="Cover image / video">
              <MediaUpload value={editing.cover_image_url} onChange={(url) => setEditing({ ...editing, cover_image_url: url })} />
            </Field>
            <Field label="Excerpt">
              <div className="space-y-1.5">
                <textarea className={inputCls} rows={2} value={editing.excerpt ?? ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <SuggestButton
                    kind="excerpt"
                    context={`Post title: ${editing.title ?? ""}${editing.tag ? `. Tag: ${editing.tag}` : ""}.`}
                    onResult={(r) => r.text && setEditing((prev) => (prev ? { ...prev, excerpt: r.text! } : prev))}
                    label="AI draft"
                  />
                </div>
              </div>
            </Field>
            <Field label="Body">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <SuggestButton
                    kind="blog_body"
                    context={`Post title: ${editing.title ?? ""}${editing.tag ? `. Tag: ${editing.tag}` : ""}. Excerpt: ${editing.excerpt || "n/a"}.`}
                    onResult={(r) => r.text && setEditing((prev) => (prev ? { ...prev, body: r.text! } : prev))}
                    label="AI draft full post"
                  />
                  <span>replaces the editor content — copy anything you want to keep first</span>
                </div>
                <RichEditor value={editing.body ?? ""} onChange={(v) => setEditing({ ...editing, body: v })} />
              </div>
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
