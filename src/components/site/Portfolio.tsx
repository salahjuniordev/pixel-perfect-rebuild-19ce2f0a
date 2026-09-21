import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/language";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { optimizedImage } from "@/lib/img";

type Project = Omit<Tables<"projects">, "gallery"> & {
  gallery?: { url: string; alt?: string }[] | null;
};

// Local type — the generated supabase types may lag behind the project_categories migration.
type Category = {
  id: string;
  name: string;
  slug: string;
  has_link: boolean;
  order_index: number;
  published: boolean | null;
};

type GalleryItem = { url: string; alt?: string };

function toGallery(value: unknown): GalleryItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (v): v is GalleryItem => !!v && typeof v === "object" && typeof (v as any).url === "string",
  );
}

const TAB_ALL = "__all";

export function Portfolio({ initial }: { initial?: Tables<"projects">[] }) {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>(initial ?? []);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<string>(TAB_ALL);

  useEffect(() => {
    if (initial) return;
    supabase
      .from("projects")
      .select("*")
      .eq("published", true)
      .order("order_index", { ascending: true })
      .then(({ data }) => setProjects((data as unknown as Project[]) ?? []));
  }, [initial]);

  useEffect(() => {
    ((supabase as any)
      .from("project_categories"))
      .select("*")
      .eq("published", true)
      .order("order_index", { ascending: true })
      .then(({ data }: { data: unknown }) => setCategories((data as Category[]) ?? []));
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === TAB_ALL) return projects;
    const cat = categories.find((c) => c.slug === activeTab || c.name === activeTab);
    if (!cat) return projects;
    return projects.filter((p) => p.category === cat.name);
  }, [projects, categories, activeTab]);

  // Featured projects get the big hero-style cards; the rest fill the grid.
  const featured = filtered.filter((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  const tabs = [
    { slug: TAB_ALL, name: t("All", "Tous") },
    ...categories.map((c) => ({ slug: c.slug, name: c.name })),
  ];

  return (
    <section id="portfolio" className="projects-section">
      <div className="container-sj">
        <div className="services-head">
          <h2 className="services-title">{t("My Projects", "Mes Projets")}</h2>
          <div className="services-underline">
            <span />
            <i className="dot" />
            <i className="dot" />
            <span />
          </div>
          <p className="projects-sub">
            {t("A selection of work I'm proud of", "Une sélection de travaux dont je suis fier")}
          </p>
        </div>

        {/* Filter tabs */}
        {tabs.length > 1 && (
          <div
            className="proj-tabs"
            role="tablist"
            aria-label={t("Filter projects by category", "Filtrer les projets par catégorie")}
          >
            {tabs.map((tab) => (
              <button
                key={tab.slug}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.slug}
                className={`proj-tab ${activeTab === tab.slug ? "proj-tab-active" : ""}`}
                onClick={() => setActiveTab(tab.slug)}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}

        <div className="proj-grid">
          {/* Featured cards span wider — visual hierarchy without breaking the layout */}
          {featured.map((p) => (
            <ProjectCard key={p.id} p={p} featured />
          ))}
          {rest.map((p) => (
            <ProjectCard key={p.id} p={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="projects-sub text-center mt-10">
            {t("No projects in this category yet.", "Aucun projet dans cette catégorie pour le moment.")}
          </p>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ p, featured = false }: { p: Project; featured?: boolean }) {
  const { t } = useLanguage();
  const gallery = toGallery(p.gallery);
  const cover = p.image_url ?? gallery[0]?.url;
  const inner = (
    <>
      <div className={`proj-card-media ${featured ? "proj-card-media-lg" : ""}`}>
        {cover && (
          <img
            src={optimizedImage(cover, featured ? 1200 : 640)}
            alt={p.cover_alt || p.title}
            width={featured ? 1200 : 640}
            height={featured ? 750 : 400}
            loading="lazy"
            decoding="async"
          />
        )}
        {featured && gallery.length > 1 && (
          <span className="proj-card-count">
            <i className="fa-solid fa-images" /> {gallery.length}
          </span>
        )}
        {featured && !gallery.length && p.case_study && (
          <span className="proj-card-count">
            <i className="fa-solid fa-book-open" />
          </span>
        )}
      </div>
      <div className="proj-card-body">
        <div className="proj-card-meta">
          <span className="proj-card-pill">{p.category}</span>
          {p.year && <span className="proj-card-year">{p.year}</span>}
        </div>
        <h3 className="proj-card-title">{p.title}</h3>
        {featured && p.description && <p className="proj-card-desc">{p.description}</p>}
        {featured && !!p.tags?.length && (
          <div className="proj-card-tags">
            {p.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="proj-card-tag">{tag}</span>
            ))}
          </div>
        )}
        <span className="proj-card-cta">
          {p.case_study
            ? t("Read Case Study", "Lire l'Étude de Cas")
            : p.link_url
              ? t("Visit Live Site", "Voir le Site")
              : t("View Work", "Voir le Travail")}
          <i className="fa-solid fa-arrow-right" />
        </span>
      </div>
    </>
  );
  const shared = { className: `proj-card ${featured ? "proj-card-featured" : ""}` } as const;
  return p.case_study && p.slug ? (
    <Link key={p.id} to="/projects/$slug" params={{ slug: p.slug }} {...shared}>
      {inner}
    </Link>
  ) : (
    <a key={p.id} href={p.link_url ?? "#"} target="_blank" rel="noreferrer" {...shared}>
      {inner}
    </a>
  );
}
