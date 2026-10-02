import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type SiteSettingsRow = Tables<"site_settings">;

export type ResolvedSocials = {
  github: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
};

export type ResolvedSite = {
  brandName: string;
  email: string;
  /** Human-readable phone, e.g. "+237 683 693 011". */
  phoneDisplay: string;
  /** Digits only, e.g. "237683693011" — build tel:/wa.me URLs from this. */
  phoneDigits: string;
  whatsappNumber: string;
  whatsappUrl: string;
  location: string;
  logoUrl: string;
  faviconUrl: string;
  resumeUrl: string;
  /** Admin-authored bio. Single field, so it replaces both language variants. */
  aboutText: string | null;
  footerText: string | null;
  socials: ResolvedSocials;
  /** Non-empty social URLs, for Person/Organization `sameAs`. */
  sameAs: string[];
};

/**
 * The values that used to be hardcoded in every component. They remain the
 * fallback so the site renders correctly when site_settings has no row yet.
 */
export const SITE_DEFAULTS = {
  brandName: "Salah Junior",
  email: "salahjuniorncham@gmail.com",
  phoneDisplay: "+237 683 693 011",
  phoneDigits: "237683693011",
  location: "Emana, Yaoundé, Cameroon",
  logoUrl: "/logo.png",
  faviconUrl: "/favicon.png",
  resumeUrl: "/assets/my-resume.pdf",
} as const;

const DEFAULT_SOCIALS: ResolvedSocials = {
  github: "https://github.com/salahjuniordev",
  linkedin: "https://www.linkedin.com/in/salah-junior-987684398",
  instagram: "https://www.instagram.com/salahjuniordev",
  facebook: "https://www.facebook.com/profile.php?id=61586199631543",
  twitter: "",
  youtube: "",
};

export const digitsOnly = (value: string) => value.replace(/[^0-9]/g, "");

/** wa.me deep link for a phone number in any format. */
export const whatsappHref = (value: string) => `https://wa.me/${digitsOnly(value)}`;

const or = (value: string | null | undefined, fallback: string) =>
  value && value.trim() ? value.trim() : fallback;

/**
 * Merge a site_settings row over the hardcoded defaults. Pure so it can run
 * both in React (after the async fetch) and on the server during SSR.
 */
export function resolveSite(row: SiteSettingsRow | null | undefined): ResolvedSite {
  const socials: ResolvedSocials = {
    github: or(row?.social_github, DEFAULT_SOCIALS.github),
    linkedin: or(row?.social_linkedin, DEFAULT_SOCIALS.linkedin),
    instagram: or(row?.social_instagram, DEFAULT_SOCIALS.instagram),
    facebook: or(row?.social_facebook, DEFAULT_SOCIALS.facebook),
    twitter: or(row?.social_twitter, DEFAULT_SOCIALS.twitter),
    youtube: or(row?.social_youtube, DEFAULT_SOCIALS.youtube),
  };
  const phoneDigits = digitsOnly(or(row?.contact_phone, SITE_DEFAULTS.phoneDigits));
  const whatsappNumber = digitsOnly(or(row?.whatsapp_number, SITE_DEFAULTS.phoneDigits));

  return {
    brandName: or(row?.brand_name, SITE_DEFAULTS.brandName),
    email: or(row?.contact_email, SITE_DEFAULTS.email),
    phoneDisplay: or(row?.contact_phone, SITE_DEFAULTS.phoneDisplay),
    phoneDigits,
    whatsappNumber,
    whatsappUrl: `https://wa.me/${whatsappNumber}`,
    location: or(row?.location, SITE_DEFAULTS.location),
    logoUrl: or(row?.logo_url, SITE_DEFAULTS.logoUrl),
    faviconUrl: or(row?.favicon_url, SITE_DEFAULTS.faviconUrl),
    resumeUrl: or(row?.resume_url, SITE_DEFAULTS.resumeUrl),
    aboutText: row?.about_text && row.about_text.trim() ? row.about_text : null,
    footerText: row?.footer_text && row.footer_text.trim() ? row.footer_text : null,
    socials,
    sameAs: [
      socials.github,
      socials.linkedin,
      socials.instagram,
      socials.facebook,
      socials.twitter,
      socials.youtube,
    ].filter(Boolean),
  };
}

/* -------------------------------------------------------------------- */
/*  Client: shared fetch + subscribe hook                                 */
/* -------------------------------------------------------------------- */

let cache: SiteSettingsRow | null = null;
let inFlight: Promise<void> | null = null;
const listeners = new Set<(s: SiteSettingsRow | null) => void>();

function load() {
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      const { data } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      cache = data ?? null;
    } catch {
      cache = null;
    } finally {
      inFlight = null;
    }
    listeners.forEach((l) => l(cache));
  })();
  return inFlight;
}

/** Raw site_settings row (null until loaded). Prefer `useResolvedSite()`. */
export function useSiteSettings() {
  const [s, setS] = useState<SiteSettingsRow | null>(cache);
  useEffect(() => {
    listeners.add(setS);
    if (!cache) load();
    return () => {
      listeners.delete(setS);
    };
  }, []);
  return s;
}

/**
 * site_settings merged over the defaults. Always returns a complete object, so
 * components never need `?.` chains or their own fallback literals.
 */
export function useResolvedSite(): ResolvedSite {
  const row = useSiteSettings();
  return useMemo(() => resolveSite(row), [row]);
}

/** Discard the cached row (used after an admin save). */
export function invalidateSiteSettings() {
  cache = null;
  void load();
}

/* -------------------------------------------------------------------- */
/*  Server: non-fatal read for SSR head / loaders                        */
/* -------------------------------------------------------------------- */

export async function getSiteSettings(): Promise<SiteSettingsRow | null> {
  try {
    const { data } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
    return data ?? null;
  } catch {
    return null;
  }
}

/** Resolved settings for use inside route loaders and `head()`. */
export async function resolveSiteServer(): Promise<ResolvedSite> {
  return resolveSite(await getSiteSettings());
}