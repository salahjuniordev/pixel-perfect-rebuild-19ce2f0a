import { createFileRoute, notFound } from "@tanstack/react-router";
import { LanguageProvider, useLanguage } from "@/lib/language";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { BackToTop } from "@/components/site/BackToTop";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { supabase } from "@/integrations/supabase/client";
import { useSeo } from "@/lib/use-seo";
import { optimizedImage } from "@/lib/img";
import { SITE_ORIGIN } from "@/lib/seo-schemas";
import { sanitizeRichText } from "@/lib/sanitize";

type Project = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  link_url: string | null;
  slug: string | null;
  case_study: string | null;
  published: boolean;
  gallery: { url: string; alt?: string }[] | null;
  client: string | null;
  year: string | null;
  tags: string[] | null;
};

async function loadProject(slug: string): Promise<Project | null> {
  try {
    const { data } = await supabase
      .from("projects")
      .select("id,title,description,category,image_url,link_url,slug,case_study,published,gallery,client,year,tags")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return (data as unknown as Project) ?? null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => ({ project: await loadProject(params.slug) }),
  component: () => (
    <LanguageProvider>
      <ProjectDetailPage />
    </LanguageProvider>
  ),
});

function ProjectDetailPage() {
  const { project } = Route.useLoaderData();
  const { t } = useLanguage();

  useSeo({
    title: {
      en: project ? `${project.title} | Case Study — Salah Junior` : "Project | Salah Junior",
      fr: project ? `${project.title} | Étude de cas — Salah Junior` : "Projet | Salah Junior",
    },
    description: {
      en: project?.description || "Project case study by Salah Junior, full-stack web developer.",
      fr: project?.description || "Étude de cas d'un projet de Salah Junior, développeur web full-stack.",
    },
    path: `/projects/${project?.slug ?? ""}`,
    image: project?.image_url ?? undefined,
  });

  if (!project) {
    throw notFound();
  }

  const cover = project.image_url ? optimizedImage(project.image_url, 1200) : null;
  const gallery = (project.gallery ?? []).filter(
    (g): g is { url: string; alt?: string } => !!g && typeof g === "object" && typeof g.url === "string",
  );
  const siteOrigin = typeof window !== "undefined" ? window.location.origin : SITE_ORIGIN;

  // Article JSON-LD for rich results
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.description ?? undefined,
    image: cover ?? undefined,
    author: { "@type": "Person", name: "Salah Junior Ncham", url: siteOrigin },
    publisher: { "@type": "Person", name: "Salah Junior Ncham", url: siteOrigin },
    mainEntityOfPage: `${siteOrigin}/projects/${project.slug}`,
  };

  return (
    <>
      <Navbar />
      <main className="svc-detail-page">
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>

        {/* Hero */}
        <section className="svc-detail-hero">
          <div className="container-sj">
            <a href="/#portfolio" className="svc-detail-back">
              <i className="fa-solid fa-arrow-left" />
              {t("All Projects", "Tous les Projets")}
            </a>
            <div className="svc-detail-hero-inner">
              {project.category && <span className="proj-card-pill">{project.category}</span>}
              <h1 className="svc-detail-title">{project.title}</h1>
              {project.description && <p className="svc-detail-desc">{project.description}</p>}
              {(project.client || project.year) && (
                <p className="svc-detail-sub text-slate-400 text-sm mt-2">
                  {project.client && <span><i className="fa-solid fa-user mr-1" />{project.client}</span>}
                  {project.client && project.year && <span className="mx-2">·</span>}
                  {project.year && <span><i className="fa-regular fa-calendar mr-1" />{project.year}</span>}
                </p>
              )}
              {project.link_url && (
                <div className="svc-detail-actions">
                  <a href={project.link_url} target="_blank" rel="noreferrer" className="svc-detail-btn svc-detail-btn-primary">
                    <i className="fa-solid fa-arrow-up-right-from-square" />
                    {t("Visit Live Site", "Voir le Site")}
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Cover */}
        {cover && (
          <section className="container-sj">
            <img
              src={cover}
              alt={project.title}
              className="w-full rounded-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
            />
          </section>
        )}

        {/* Gallery — for visual work (design/branding) uploaded from the dashboard */}
        {gallery.length > 0 && (
          <section className="svc-detail-section">
            <div className="container-sj">
              <h2 className="svc-detail-section-title">{t("The Work", "Le Travail")}</h2>
              <div className="proj-gallery">
                {gallery.map((item, i) => (
                  <figure key={i} className="proj-gallery-item">
                    <img
                      src={optimizedImage(item.url, 1200)}
                      alt={item.alt || project.title}
                      width={1200}
                      height={800}
                      loading={i < 2 ? "eager" : "lazy"}
                      decoding="async"
                    />
                    {item.alt && <figcaption className="proj-gallery-caption">{item.alt}</figcaption>}
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tags — below the cover, never overlapping the image */}
        {!!project.tags?.length && (
          <div className="container-sj proj-card-tags" style={{ justifyContent: "center", marginTop: "1.75rem", marginBottom: "2.5rem" }}>
            {project.tags.map((tag) => (
              <span key={tag} className="proj-card-tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Case study body */}
        <section className="svc-detail-section">
          <div className="container-sj">
            {project.case_study ? (
              <div
                className="prose-case-study"
                dangerouslySetInnerHTML={{ __html: sanitizeRichText(project.case_study) }}
              />
            ) : (
              <p className="svc-detail-desc">
                {t(
                  "Full case study coming soon — contact me to hear the story behind this project.",
                  "Étude de cas complète bientôt disponible — contactez-moi pour découvrir l'histoire de ce projet.",
                )}
              </p>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="svc-detail-section svc-detail-contact">
          <div className="container-sj text-center">
            <h2 className="svc-detail-section-title">{t("Want results like this?", "Vous voulez des résultats comme ça ?")}</h2>
            <p className="svc-detail-section-sub">
              {t("Let's talk about your project.", "Parlons de votre projet.")}
            </p>
            <div className="svc-detail-actions justify-center">
              <a
                href={`https://wa.me/237683693011?text=${encodeURIComponent(`${t("Hello Salah, I saw the", "Bonjour Salah, j'ai vu l'étude de cas")} ${project.title} — ${t("I have a similar project in mind.", "j'ai un projet similaire en tête.")}`)}`}
                target="_blank"
                rel="noreferrer"
                className="svc-detail-btn svc-detail-btn-primary"
              >
                <i className="fab fa-whatsapp" />
                {t("Start a Project", "Démarrer un Projet")}
              </a>
              <a href="/#portfolio" className="svc-detail-btn svc-detail-btn-ghost">
                <i className="fa-solid fa-arrow-left" />
                {t("More Projects", "Plus de Projets")}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
      <BackToTop />
    </>
  );
}
