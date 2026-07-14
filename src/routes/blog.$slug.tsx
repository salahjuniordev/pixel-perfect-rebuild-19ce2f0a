import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { BackToTop } from "@/components/site/BackToTop";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/blog/$slug")({
  component: () => (
    <LanguageProvider>
      <BlogPostPage />
    </LanguageProvider>
  ),
});


function BlogPostPage() {
  const { t, lang } = useLanguage();
  const { slug } = Route.useParams();

  const [post, setPost] = useState<Tables<"blog_posts"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (!data) setMissing(true);
      else setPost(data);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-slate-400">
        <i className="fa-solid fa-spinner fa-spin text-[var(--brand)] text-2xl" />
      </div>
    );
  }
  if (missing || !post) throw notFound();

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <>
      <Navbar />
      <article className="pt-32 pb-20">
        <div className="container-sj max-w-3xl">
          <Link to="/" hash="blog" className="text-sm text-[--brand] hover:underline mb-6 inline-flex items-center gap-2">
            <i className="fa-solid fa-arrow-left" /> {t("Back to Blog", "Retour au Blog")}
          </Link>
          <span className="inline-block text-xs text-[--brand] uppercase tracking-widest mb-3">{post.tag}</span>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">{post.title}</h1>
          <div className="text-xs text-slate-500 flex gap-4 mb-8 flex-wrap">
            {date && <span><i className="fa-regular fa-calendar mr-1" />{date}</span>}
            <span><i className="fa-regular fa-clock mr-1" />{post.read_time}</span>
            <span>{t("By Salah Junior", "Par Salah Junior")}</span>
          </div>

          {post.cover_image_url && (
            <img src={post.cover_image_url} alt={post.title} className="w-full rounded-2xl mb-10" />
          )}
          <div className="prose-blog" dangerouslySetInnerHTML={{ __html: post.body }} />
        </div>
      </article>
      <Footer />
      <BackToTop />
      <style>{`
        .prose-blog p { color: #cbd5e1; line-height: 1.8; margin-bottom: 1.25rem; }
        .prose-blog h2, .prose-blog h3 { color: #fff; font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
        .prose-blog ul { color: #cbd5e1; padding-left: 1.5rem; margin-bottom: 1.25rem; list-style: disc; }
        .prose-blog ol { color: #cbd5e1; padding-left: 1.5rem; margin-bottom: 1.25rem; list-style: decimal; }
        .prose-blog li { margin-bottom: 0.5rem; }
        .prose-blog strong { color: #fff; }
        .prose-blog a { color: var(--brand); text-decoration: underline; }
        .prose-blog blockquote { border-left: 3px solid var(--brand); padding-left: 1rem; color: #cbd5e1; font-style: italic; margin: 1rem 0; }
        .prose-blog img { max-width: 100%; border-radius: 12px; margin: 1rem 0; }
        .prose-blog code { background: rgba(14,165,233,0.15); color: #38bdf8; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
      `}</style>
    </LanguageProvider>
  );
}
