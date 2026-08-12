import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

let cache: Tables<"site_settings"> | null = null;
const listeners = new Set<(s: Tables<"site_settings"> | null) => void>();

async function load() {
  const { data } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
  const row = data;
  cache = row ?? null;
  listeners.forEach((l) => l(cache));
}

export function useSiteSettings() {
  const [s, setS] = useState<Tables<"site_settings"> | null>(cache);
  useEffect(() => {
    listeners.add(setS);
    if (!cache) load();
    return () => {
      listeners.delete(setS);
    };
  }, []);
  return s;
}
