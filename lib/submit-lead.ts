/**
 * Client-side helper: POST a form to /api/leads and return a normalized
 * result. Every form uses this — keeps the UX consistent (loading,
 * success, error) and the server contract in one place.
 */

export type SubmitResult =
  | { ok: true }
  | { ok: false; code: "rate_limited" | "validation" | "email_failed" | "network" };

export async function submitLead(
  type: "b2b" | "waitlist" | "stay" | "subscribe",
  fields: Record<string, unknown>
): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type, ...fields }),
    });

    if (res.ok) return { ok: true };

    if (res.status === 429) return { ok: false, code: "rate_limited" };
    if (res.status === 400) return { ok: false, code: "validation" };
    return { ok: false, code: "email_failed" };
  } catch {
    return { ok: false, code: "network" };
  }
}

export function errorMessage(code: Exclude<SubmitResult, { ok: true }>["code"]) {
  switch (code) {
    case "rate_limited":
      return "Too many requests — try again in a minute.";
    case "validation":
      return "Some fields look off — please check and retry.";
    case "email_failed":
      return "We couldn't deliver that just now. Please email us directly.";
    case "network":
      return "Couldn't reach the server. Check your connection and retry.";
  }
}
