import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";

/**
 * AI field suggestions for the admin dashboard (Groq, OpenAI-compatible API).
 *
 * The GROQ_API_KEY lives only on the server. Every call is gated: the caller
 * must carry a valid Supabase JWT belonging to an admin. Suggestions are
 * drafts only — nothing is ever written to the database by this function.
 *
 * Models (override with env if Groq renames them):
 *   GROQ_VISION_MODEL — image understanding (caption/alt/size)
 *   GROQ_TEXT_MODEL   — copy drafting (descriptions, tags…)
 */
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const VISION_MODEL = process.env.GROQ_VISION_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct";
const TEXT_MODEL = process.env.GROQ_TEXT_MODEL || "llama-3.3-70b-versatile";

type ImageSuggestion = { caption: string; alt: string; size: "big" | "small" };
type TextSuggestion = { text: string };

async function assertAdmin(): Promise<void> {
  const request = getRequest();
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) throw new Error("Unauthorized");

  // Match the app's Supabase client resolution: VITE_* in the browser bundle,
  // plain SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY on the server (Vercel env).
  const url =
    (import.meta.env.VITE_SUPABASE_URL as string | undefined) || process.env.SUPABASE_URL;
  const anon =
    (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
    process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !anon) throw new Error("Supabase not configured");

  const db = createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: userData, error: userErr } = await db.auth.getUser(token);
  if (userErr || !userData?.user) throw new Error("Unauthorized");
  const { data: role } = await db
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (!role) throw new Error("Forbidden");
}

async function groqChat(model: string, messages: unknown[], jsonMode: boolean): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY is not set on the server");
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.6,
      max_tokens: 500,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Groq error ${res.status}: ${body.slice(0, 200)}`);
  }
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return json.choices?.[0]?.message?.content ?? "";
}

/** Fetch an image and return it as a base64 data URL (Groq vision wants data URLs). */
async function toDataUrl(imageUrl: string): Promise<string> {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Could not fetch image (${res.status})`);
  const type = res.headers.get("content-type") || "image/jpeg";
  const buf = Buffer.from(await res.arrayBuffer());
  return `data:${type};base64,${buf.toString("base64")}`;
}

const IMAGE_INSTRUCTION = `You label portfolio design work for a freelance designer's website.
Look at the image and reply with STRICT JSON only:
{"caption":"<4-8 word caption, title-case, no period>","alt":"<one sentence, factual, for SEO/screen readers, mention medium/style if visual work>","size":"big"|"small"}
Rules: "size" = "big" for tall/detailed hero-worthy pieces (posters, full designs), "small" for logos, icons, small shots. Captions must be in English. No extra keys, no markdown.`;

const TEXT_PROMPTS: Record<string, (ctx: string) => string> = {
  description: (ctx) =>
    `Write a 1-2 sentence project description for a portfolio card. Confident, concrete, no buzzwords, no emoji. Reply STRICT JSON: {"text":"..."}\nContext: ${ctx}`,
  case_study: (ctx) =>
    `Write a short case study as simple HTML for a portfolio project: exactly three sections — <h2>The Problem</h2><p>…</p><h2>The Approach</h2><p>…</p><h2>The Result</h2><p>…</p> — 2-3 sentences per section, first person "I", no other tags, no markdown fences. Reply STRICT JSON: {"text":"<the html>"}\nContext: ${ctx}`,
  tags: (ctx) =>
    `Suggest 5-8 short tech/skill tags (lowercase, comma-separated, no #). Reply STRICT JSON: {"text":"tag1, tag2, ..."}\nContext: ${ctx}`,
  excerpt: (ctx) =>
    `Write a 1-2 sentence blog excerpt that makes people want to read. Reply STRICT JSON: {"text":"..."}\nContext: ${ctx}`,
  blog_body: (ctx) =>
    `Write a short blog post as simple HTML: one <h2> per section (3-4 sections), <p> paragraphs, maybe one <ul>. 300-450 words, engaging but factual, no markdown fences. Reply STRICT JSON: {"text":"<the html>"}\nContext: ${ctx}`,
  service_description: (ctx) =>
    `Write a 2-3 sentence service description for a freelance designer/developer's service card. Clear about what the client gets. No buzzwords, no emoji. Reply STRICT JSON: {"text":"..."}\nContext: ${ctx}`,
  ebook_description: (ctx) =>
    `Write a 2-3 sentence description selling an ebook (what the reader learns, who it's for). Persuasive but honest. Reply STRICT JSON: {"text":"..."}\nContext: ${ctx}`,
  testimonial_polish: (ctx) =>
    `Fix grammar and light-polish this customer quote. Keep the speaker's voice and meaning — do not invent claims, do not change names. Reply STRICT JSON: {"text":"..."}\nQuote: ${ctx}`,
  pricing_features: (ctx) =>
    `Suggest 5-6 short feature bullets (one per line, no dashes, max 6 words each) for this pricing plan. Reply STRICT JSON: {"text":"line1\\nline2\\n..."}\nContext: ${ctx}`,
};

export const aiSuggestImage = createServerFn({ method: "POST" })
  .validator((d: unknown) => {
    const { image_url: imageUrl } = (d ?? {}) as { image_url?: string };
    if (!imageUrl || !/^https?:\/\//.test(imageUrl)) throw new Error("image_url required");
    return { imageUrl };
  })
  .handler(async ({ data }): Promise<ImageSuggestion> => {
    await assertAdmin();
    const dataUrl = await toDataUrl(data.imageUrl);
    const content = await groqChat(
      VISION_MODEL,
      [
        {
          role: "user",
          content: [
            { type: "text", text: IMAGE_INSTRUCTION },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      true,
    );
    const parsed = JSON.parse(content) as Partial<ImageSuggestion>;
    return {
      caption: String(parsed.caption ?? "").slice(0, 80),
      alt: String(parsed.alt ?? "").slice(0, 200),
      size: parsed.size === "big" ? "big" : "small",
    };
  });

export const aiSuggestText = createServerFn({ method: "POST" })
  .validator((d: unknown) => {
    const { kind, context } = (d ?? {}) as { kind?: string; context?: string };
    if (!kind || !TEXT_PROMPTS[kind]) throw new Error("Unknown kind");
    const ctx = String(context ?? "").slice(0, 600).trim();
    if (!ctx) throw new Error("context required");
    return { kind, context: ctx };
  })
  .handler(async ({ data }): Promise<TextSuggestion> => {
    await assertAdmin();
    const content = await groqChat(
      TEXT_MODEL,
      [{ role: "user", content: TEXT_PROMPTS[data.kind](data.context) }],
      true,
    );
    const parsed = JSON.parse(content) as { text?: string };
    return { text: String(parsed.text ?? "").slice(0, 1200) };
  });
