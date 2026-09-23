import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import { SITE_ORIGIN, BRAND, CONTACT_EMAIL } from "@/lib/seo-schemas";

/**
 * Client reply emails, sent from the Project Requests dashboard.
 *
 * Transport (auto-selected, first match wins):
 *   1. Gmail SMTP — GMAIL_USER + GMAIL_APP_PASSWORD. Works for ANY recipient
 *      immediately, no domain verification. Emails come from your Gmail and
 *      client replies land in your Gmail inbox (reply_to = same address).
 *   2. Resend — RESEND_API_KEY. Branded sending domain (RESEND_FROM, e.g.
 *      hello@yourdomain.com) once a domain is verified. Without a verified
 *      domain Resend only delivers to your own account email (testing mode).
 *   3. Neither → clear error telling the admin what to configure.
 *
 * The key/password live only on the server; every call is gated to an
 * authenticated admin. Each sent reply is stored in `email_replies` so the
 * dashboard keeps a conversation history per submission.
 */

type Transport = "gmail" | "resend";

function pickTransport(): { kind: Transport; from: string } {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (gmailUser && gmailPass) {
    return { kind: "gmail", from: `${BRAND} <${gmailUser}>` };
  }
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    return { kind: "resend", from: process.env.RESEND_FROM || `${BRAND} <onboarding@resend.dev>` };
  }
  throw new Error(
    "EMAIL_NOT_CONFIGURED: set GMAIL_USER + GMAIL_APP_PASSWORD (or RESEND_API_KEY) on the server",
  );
}

async function assertAdmin(): Promise<void> {
  const request = getRequest();
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) throw new Error("Unauthorized");

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

/** Escape user-authored text for safe inclusion in HTML email bodies. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml(body: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:#0b1220;border-radius:16px 16px 0 0;padding:20px 24px;">
      <span style="color:#9bfa06;font-weight:bold;font-size:18px;">${esc(BRAND)}</span>
      <span style="color:#94a3b8;font-size:12px;display:block;margin-top:2px;">Web Developer &amp; Designer — Yaoundé, Cameroon</span>
    </div>
    <div style="background:#ffffff;padding:28px 24px;border-radius:0 0 16px 16px;color:#1f2937;line-height:1.7;font-size:15px;">
      ${esc(body).replace(/\n/g, "<br/>")}
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
      <p style="font-size:13px;color:#6b7280;margin:0;">
        ${esc(BRAND)} — Full-Stack Web Developer &amp; UI/UX Designer<br/>
        <a href="${SITE_ORIGIN}" style="color:#65a30d;">${SITE_ORIGIN.replace("https://", "")}</a>
        · ${esc(CONTACT_EMAIL)} · +237 683 693 011
      </p>
    </div>
  </div>
</body></html>`;
}

export const sendClientReply = createServerFn({ method: "POST" })
  .validator((d: unknown) => {
    const { intake_id, to_email, subject, body } = (d ?? {}) as {
      intake_id?: string;
      to_email?: string;
      subject?: string;
      body?: string;
    };
    const email = String(to_email ?? "").trim();
    if (!intake_id || !/^[0-9a-f-]{36}$/i.test(intake_id)) throw new Error("intake_id required");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Valid to_email required");
    const subj = String(subject ?? "").trim().slice(0, 200);
    if (!subj) throw new Error("subject required");
    const text = String(body ?? "").trim().slice(0, 20000);
    if (!text) throw new Error("body required");
    return { intakeId: intake_id, email, subject: subj, body: text };
  })
  .handler(async ({ data }) => {
    await assertAdmin();
    const transport = pickTransport();
    const html = buildHtml(data.body);

    if (transport.kind === "gmail") {
      const mailer = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: process.env.GMAIL_USER!, pass: process.env.GMAIL_APP_PASSWORD! },
      });
      const info = await mailer.sendMail({
        from: transport.from,
        to: data.email,
        replyTo: process.env.GMAIL_USER!,
        subject: data.subject,
        html,
      });
      if (!info.messageId) throw new Error("Gmail: message was not accepted");
    } else {
      const resend = new Resend(process.env.RESEND_API_KEY!);
      const { error } = await resend.emails.send({
        from: transport.from,
        to: [data.email],
        replyTo: CONTACT_EMAIL,
        subject: data.subject,
        html,
      });
      if (error) throw new Error(`Resend: ${error.message}`);
    }

    // Store the sent reply for conversation history (best effort — the
    // email is already out; a storage failure must not mislead the admin
    // into thinking the send failed).
    try {
      const url =
        (import.meta.env.VITE_SUPABASE_URL as string | undefined) || process.env.SUPABASE_URL;
      const serviceKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
      if (url && serviceKey) {
        const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
        await admin.from("email_replies").insert({
          intake_id: data.intakeId,
          to_email: data.email,
          subject: data.subject,
          body: data.body,
          status: "sent",
        });
      }
    } catch {
      /* history storage is best-effort */
    }

    return { ok: true as const, transport: transport.kind };
  });
