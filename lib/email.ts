/**
 * Resend wrapper — the PRIMARY lead-delivery channel (ADR-003).
 *
 * Rules (must not break):
 *   - If Resend succeeds → lead is "received". 200 returned to the user.
 *   - If Resend fails → route returns 500 and Notion is never called.
 *   - Notion is best-effort; it never gates the user response.
 *
 * Dev-mode behavior: if RESEND_API_KEY is missing (e.g. local dev without
 * .env.local), we log the email to stdout and return a synthetic success
 * instead of silently pretending a send occurred. Production MUST have
 * the key — `assertProdEnv()` below guards against accidentally shipping
 * without it.
 */

import { Resend } from "resend";

type LeadPayload = {
  type: "b2b" | "waitlist" | "stay" | "subscribe";
  subject: string;
  fields: Record<string, unknown>;
};

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "gil.rivera.a@gmail.com";

export async function sendLeadEmail(payload: LeadPayload): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!key || !from) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "RESEND_API_KEY / RESEND_FROM missing in production — refusing to fake a send."
      );
    }
    // Dev: log + return. Keeps the end-to-end form loop testable without keys.
    console.log(
      `[email:dev] would send to ${ADMIN_EMAIL}: ${payload.subject}\n` +
        JSON.stringify(payload.fields, null, 2)
    );
    return;
  }

  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from,
    to: [ADMIN_EMAIL],
    subject: payload.subject,
    text: renderPlain(payload),
    html: renderHtml(payload),
  });

  if (error) {
    // Bubble up — /api/leads will turn this into a 500.
    throw new Error(`Resend send failed: ${error.message ?? "unknown"}`);
  }
}

function renderPlain({ type, fields }: LeadPayload) {
  const lines = [
    `New ${type} lead — Bellavista Coffee`,
    "",
    ...Object.entries(fields)
      .filter(([k]) => k !== "website") // skip honeypot
      .map(([k, v]) => `${k}: ${String(v ?? "—")}`),
  ];
  return lines.join("\n");
}

function renderHtml({ type, fields }: LeadPayload) {
  const rows = Object.entries(fields)
    .filter(([k]) => k !== "website")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;font-family:monospace;color:#7a766b;text-transform:uppercase;font-size:11px">${escape(
          k
        )}</td><td style="padding:4px 0;font-family:system-ui,sans-serif;color:#0c0c0a">${escape(
          String(v ?? "—")
        )}</td></tr>`
    )
    .join("");
  return `<div style="font-family:system-ui,sans-serif;color:#0c0c0a;max-width:560px">
    <h2 style="font-family:Georgia,serif;font-weight:400;font-size:24px;margin:0 0 16px">New ${escape(
      type
    )} lead</h2>
    <table style="border-collapse:collapse">${rows}</table>
  </div>`;
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
