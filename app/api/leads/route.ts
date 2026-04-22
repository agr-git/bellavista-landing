/**
 * POST /api/leads — unified lead capture.
 *
 * Email-first fallback per ADR-003:
 *   1. Validate body via Zod (per-type union).
 *   2. Honeypot check: if `website` non-empty, pretend 200 (spam).
 *   3. Rate limit: 5 req/min per IP.
 *   4. Send via Resend — if this fails, return 500 (lead NOT captured).
 *   5. Fire-and-forget Notion write — failure is logged, NOT surfaced.
 *   6. Return 200 { ok: true } to the client.
 *
 * The email is the guarantee. Everything else is belt-and-suspenders.
 *
 * This route is server-only and force-dynamic so the rate-limit map and
 * the env-dependent behavior don't get cached at build time.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { sendLeadEmail } from "@/lib/email";
import { writeLeadToNotion } from "@/lib/notion";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BaseFields = z.object({
  website: z.string().optional(), // honeypot
});

const B2B = BaseFields.extend({
  type: z.literal("b2b"),
  company: z.string().min(1),
  email: z.string().email(),
  country: z.string().optional().default(""),
  volume: z.coerce.number().nonnegative().optional(),
  notes: z.string().max(2000).optional().default(""),
});

const Waitlist = BaseFields.extend({
  type: z.literal("waitlist"),
  name: z.string().min(1),
  email: z.string().email(),
  country: z.string().optional().default(""),
});

const Stay = BaseFields.extend({
  type: z.literal("stay"),
  name: z.string().min(1),
  email: z.string().email(),
  preset: z.enum(["week", "weekend"]),
  arrive: z.string().optional().default(""),
  depart: z.string().optional().default(""),
  guests: z.coerce.number().int().min(1).max(12).optional(),
  notes: z.string().max(2000).optional().default(""),
});

const Subscribe = BaseFields.extend({
  type: z.literal("subscribe"),
  email: z.string().email(),
});

const LeadBody = z.discriminatedUnion("type", [B2B, Waitlist, Stay, Subscribe]);

export async function POST(req: Request) {
  // Rate limit first — cheapest rejection.
  const ip = clientIp(req.headers);
  const rl = rateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryMs / 1000)) } }
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = LeadBody.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", detail: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot — silent 200 so bots don't learn.
  if (data.website && data.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // Strip honeypot from outgoing payload.
  const { type } = data;
  const fields: Record<string, unknown> = { ...data };
  delete fields.type;
  delete fields.website;
  const subject = subjectFor(type, fields);
  const title = titleFor(type, fields);

  // 1. Resend — MUST succeed. This is the contract.
  try {
    await sendLeadEmail({ type, subject, fields });
  } catch (err) {
    console.error("[api/leads] Resend failed:", err);
    return NextResponse.json({ ok: false, error: "email_failed" }, { status: 500 });
  }

  // 2. Notion — best-effort. Log on failure, continue.
  const notion = await writeLeadToNotion({ type, title, fields });
  if (!notion.ok && notion.reason !== "not_configured") {
    console.error("[api/leads] Notion write failed:", notion.reason);
  }

  return NextResponse.json({ ok: true });
}

function subjectFor(type: string, fields: Record<string, unknown>): string {
  switch (type) {
    case "b2b":
      return `Sample request — ${String(fields.company ?? "unknown roastery")}`;
    case "waitlist":
      return `Waitlist — ${String(fields.name ?? "")}`;
    case "stay":
      return `Farmhouse inquiry (${String(fields.preset ?? "")}) — ${String(
        fields.name ?? ""
      )}`;
    case "subscribe":
      return `Newsletter subscribe — ${String(fields.email ?? "")}`;
    default:
      return "New lead";
  }
}

function titleFor(type: string, fields: Record<string, unknown>): string {
  const stamp = new Date().toISOString().slice(0, 10);
  const who =
    fields.company ||
    fields.name ||
    fields.email ||
    "unknown";
  return `${stamp} · ${type} · ${String(who)}`;
}
