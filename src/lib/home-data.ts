import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

/**
 * Homepage data, fetched server-side in the `/` route loader so the section
 * cards (services, projects, testimonials, pricing, blog teasers) are present
 * in the initial SSR HTML instead of only appearing after client hydration.
 *
 * The queries mirror exactly what each section component used to run in its
 * own `useEffect`, so the rendered output is unchanged.
 */
export type HomeData = {
  services: Tables<"services">[];
  projects: Tables<"projects">[];
  testimonials: Tables<"testimonials">[];
  pricing: Tables<"pricing_tiers">[];
  posts: Tables<"blog_posts">[];
};

const EMPTY: HomeData = {
  services: [],
  projects: [],
  testimonials: [],
  pricing: [],
  posts: [],
};

export async function fetchHomeData(): Promise<HomeData> {
  try {
    const [services, projects, testimonials, pricing, posts] = await Promise.all([
      supabase.from("services").select("*").eq("published", true).order("order_index", { ascending: true }),
      supabase.from("projects").select("*").eq("published", true).order("order_index", { ascending: true }),
      supabase.from("testimonials").select("*").eq("published", true).order("order_index", { ascending: true }),
      supabase.from("pricing_tiers").select("*").eq("published", true).order("order_index", { ascending: true }),
      supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(6),
    ]);

    return {
      services: services.data ?? [],
      projects: projects.data ?? [],
      testimonials: testimonials.data ?? [],
      pricing: pricing.data ?? [],
      posts: posts.data ?? [],
    };
  } catch (err) {
    // Never let a data hiccup 500 the homepage — render the static shell instead.
    console.error("[home-data] fetch failed", err);
    return EMPTY;
  }
}
