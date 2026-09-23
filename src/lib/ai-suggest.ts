import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { AI_SYSTEM_PROMPT, AI_KIND_GUIDE } from "@/lib/ai-knowledge";

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
 *   GROQ_REASONING_EFFORT — low|medium|high (default high = maximum thinking)
 *
 * Reasoning: both models think before answering. `reasoning_effort: "high"`
 * maximizes accuracy on drafting tasks. Reasoning tokens count toward the
 * completion budget, so max_completion_tokens is generous — a small cap
 * would be consumed by thinking and return empty drafts.
 */
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const VISION_MODEL = process.env.GROQ_VISION_MODEL || "qwen/qwen3.8-27b";
const TEXT_MODEL = process.env.GROQ_TEXT_MODEL || "openai/gpt-oss-120b";
const REASONING_EFFORT = (process.env.GROQ_REASONING_EFFORT || "high") as
  | "low"
  | "medium"
  | "high";

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

async function groqChat(
  model: string,
  messages: unknown[],
  jsonMode: boolean,
): Promise<string> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY is not set on the server");
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      // System message carries the knowledge base + voice on EVERY call.
      messages: [{ role: "system", content: AI_SYSTEM_PROMPT }, ...messages],
      temperature: 0.6,
      top_p: 0.95,
      // Generous budget: reasoning tokens (high effort) consume it before
      // the visible answer. 8k covers a full blog post after thinking.
      max_completion_tokens: 8192,
      // Maximum thinking for accuracy (supported by gpt-oss-120b and qwen3.8-27b).
      reasoning_effort: REASONING_EFFORT,
      // JSON mode defaults to parsed reasoning — never set "raw" here (400).
      ...(jsonMode ? { response_format: { type: "json_object" } } : { reasoning_format: "hidden" }),
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

const IMAGE_INSTRUCTION = `Look at this piece of design work for Salah's portfolio and reply with STRICT JSON only:
{"caption":"<4-8 word caption, title-case, no period>","alt":"<one sentence, factual, for SEO/screen readers, mention medium/style if visual work>","size":"big"|"small"}
Rules: "size" = "big" for tall/detailed hero-worthy pieces (posters, full designs), "small" for logos, icons, small shots. Captions must be in English. Describe what you actually see — do not guess a client name or industry that isn't visible. No extra keys, no markdown.`;

const TEXT_PROMPTS: Record<string, (ctx: string) => string> = {
  description: (ctx) =>
    `Write a 1-2 sentence project description for Salah's portfolio card. Follow the voice guide: lead with the client's problem/goal, then what he built and one concrete choice he made. Reply STRICT JSON: {"text":"..."}\nContext: ${ctx}`,
  case_study: (ctx) =>
    `Write a short case study as simple HTML for this portfolio project: exactly three sections — <h2>The Problem</h2><p>…</p><h2>The Approach</h2><p>…</p><h2>The Result</h2><p>…</p> — 2-3 sentences per section, first person "I", explaining WHY each technical/UX choice was made in plain client language. No other tags, no markdown fences. Reply STRICT JSON: {"text":"<the html>"}\nContext: ${ctx}`,
  tags: (ctx) =>
    `Suggest 5-8 short tech/skill tags reflecting the stack implied by this project (lowercase, comma-separated, no #). Reply STRICT JSON: {"text":"tag1, tag2, ..."}\nContext: ${ctx}`,
  excerpt: (ctx) =>
    `Write a 1-2 sentence blog excerpt that hooks the reader on the title's promise. Reply STRICT JSON: {"text":"..."}\nContext: ${ctx}`,
  blog_body: (ctx) =>
    `Write a short blog post as simple HTML in Salah's voice (experienced practitioner sharing how he solves this problem): direct answer to the reader's question in the first 2-3 sentences, then one <h2> per section (3-4 sections, H2s phrased as reader questions), <p> paragraphs, maybe one <ul>. 300-450 words, concrete and honest, no invented statistics, no markdown fences. Reply STRICT JSON: {"text":"<the html>"}\nContext: ${ctx}`,
  service_description: (ctx) =>
    `Write a 2-3 sentence service description for this service card: what the client gets and why Salah's direct, full-stack, responsive/SEO-first way of working solves their problem. Reply STRICT JSON: {"text":"..."}\nContext: ${ctx}`,
  ebook_description: (ctx) =>
    `Write a 2-3 sentence description selling this ebook (what the reader can DO after reading, who it's for). Persuasive but honest. Reply STRICT JSON: {"text":"..."}\nContext: ${ctx}`,
  testimonial_polish: (ctx) =>
    `Fix grammar and light-polish this customer quote. This is a CLIENT speaking, not Salah — keep their voice, their claims, their names exactly. Do not invent anything. Reply STRICT JSON: {"text":"..."}\nQuote: ${ctx}`,
  pricing_features: (ctx) =>
    `Suggest 5-6 short feature bullets (one per line, no dashes, max 6 words each) of concrete deliverables for this pricing plan. Reply STRICT JSON: {"text":"line1\\nline2\\n..."}\nContext: ${ctx}`,
  client_reply: (ctx) =>
    `Write the email reply to this client's project request. Follow the context closely: greet by name, acknowledge their specific details, give clear next steps, sign off as Salah. Plain text email (no HTML, no markdown). Context: ${ctx}`,
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
    // Defensive parse: models occasionally wrap JSON in fences or prose.
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    let parsed: Partial<ImageSuggestion> = {};
    try {
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content) as Partial<ImageSuggestion>;
    } catch {
      // Last resort: take the raw text as caption/alt.
      return { caption: content.slice(0, 80).trim(), alt: content.slice(0, 200).trim(), size: "small" };
    }
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
    // Plain text, not JSON mode: asking the model to embed HTML inside JSON
    // escapes breaks generation on some models (json_validate_failed).
    const kindGuide = AI_KIND_GUIDE[data.kind] ? `\n${AI_KIND_GUIDE[data.kind]}\n` : "\n";
    const prompt = (kindGuide + TEXT_PROMPTS[data.kind](data.context)).replace(
      /Reply STRICT JSON[^\n]*\n?/g,
      "Reply with the content only — no JSON wrapper, no markdown fences, no commentary.\n",
    );
    const content = await groqChat(TEXT_MODEL, [{ role: "user", content: prompt }], false);
    const cleaned = content
      .replace(/<think>[\s\S]*?<\/think>/g, "") // strip any leaked reasoning
      .replace(/^```[a-z]*\n?|\n?```$/g, "") // strip accidental code fences
      .replace(/^"|"$/g, "") // strip stray wrapping quotes
      .trim();
    return { text: cleaned.slice(0, 4000) };
  });
