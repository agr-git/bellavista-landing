/**
 * POST /api/waitlist — authenticated tier waitlist signup.
 *
 * Requires a valid NextAuth session. The user's email comes from the JWT,
 * not the request body, so no spoofing possible.
 *
 * Idempotent: joining the same tier twice is a DB-level no-op (UNIQUE
 * constraint on user_id + tier_slug). Returns { ok: true, alreadyJoined: true }
 * on duplicate.
 *
 * Side effects:
 *   1. Upsert user in bv_users (in case this is somehow their first row).
 *   2. Insert bv_waitlist row.
 *   3. Send admin notification email via Resend (best-effort).
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase, upsertUser, getUserByEmail } from "@/lib/supabase";
import { sendLeadEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID_TIERS = ["honey", "natural", "on-demand"] as const;

const Body = z.object({
  tier: z.enum(VALID_TIERS),
});

export async function POST(req: Request) {
  // Auth check — must be signed in
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  }

  const email = session.user.email;

  // Parse body
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", detail: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { tier } = parsed.data;

  // Ensure the user row exists
  await upsertUser({
    email,
    name: session.user.name,
    picture_url: session.user.image,
  });

  // Look up the user's UUID
  const dbUser = await getUserByEmail(email);
  if (!dbUser) {
    // Supabase not configured or error — still return OK, but no DB write.
    console.warn("[api/waitlist] Could not find user row after upsert:", email);
    // Best-effort email notification anyway
    void notifyAdmin(email, tier);
    return NextResponse.json({ ok: true, alreadyJoined: false, dbSkipped: true });
  }

  // Insert waitlist row — conflict = already joined
  const { error } = await supabase.from("bv_waitlist").insert({
    user_id: dbUser.id,
    tier_slug: tier,
    source: "members-page",
  });

  const alreadyJoined =
    !!error && error.code === "23505"; // Postgres unique violation

  if (error && !alreadyJoined) {
    console.error("[api/waitlist] DB insert error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }

  // Admin notification (best-effort — don't block the response)
  if (!alreadyJoined) {
    void notifyAdmin(email, tier);
  }

  return NextResponse.json({ ok: true, alreadyJoined });
}

async function notifyAdmin(email: string, tier: string): Promise<void> {
  try {
    await sendLeadEmail({
      type: "waitlist",
      subject: `Waitlist join — ${tier} — ${email}`,
      fields: { email, tier, source: "members-page" },
    });
  } catch (err) {
    console.warn("[api/waitlist] Admin notification email failed:", err);
  }
}
