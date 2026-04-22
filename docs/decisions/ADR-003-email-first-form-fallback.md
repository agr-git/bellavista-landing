# ADR-003 — Email-First Form Submission Architecture

**Date:** 2026-04-21
**Status:** Accepted
**Deciders:** Alejo Gil

---

## Context

Forms are the primary business function of the site (4 lead-gen funnels). Submissions must reach the producer reliably. Two secondary goals:
- Write submissions to Notion Resources DB (operator's CRM)
- Never silently drop a submission

Two options for the submission pipeline:

**Option A — Notion primary**
Write to Notion first. If it succeeds, optionally send email. If Notion fails, surface error to user.

**Option B — Email primary, Notion secondary**
Always send email via Resend (blocking). Attempt Notion write (non-blocking, best-effort). Return 200 if email succeeds, regardless of Notion outcome.

---

## Decision

**Email is the guaranteed delivery channel. Notion is best-effort.**

```
POST /api/leads
  1. Validate input (Zod + honeypot + rate limit)
  2. Resend.send() — BLOCKING — throw on failure
  3. Notion.createPage() — try/catch — log on failure, never throw
  4. Return 200
```

If step 2 fails → return 500. User sees an error. No submission recorded.
If step 3 fails → log the error. Return 200. User sees success. Producer receives email.

---

## Reasons

1. **Notion API is less reliable than email.** Notion has documented rate limits, occasional outages, and token expiry issues. Resend's infrastructure is purpose-built for transactional email delivery with higher SLA.

2. **Email is the operator's primary workflow.** The producer checks email constantly. Even if the Notion write fails, an email in the inbox means zero leads are lost.

3. **Predictable failure mode.** If Notion goes down for a day, the producer receives all leads by email. They can manually enter them into Notion later. If email went down and Notion was primary, leads would be silently lost (Notion doesn't push notifications).

4. **Simple recovery.** Failed Notion writes are logged with full payload. The producer or dev can replay them manually or via a script.

5. **No silent failures.** A submission either delivers an email (success) or returns a visible 500 error (failure). The user always knows the outcome.

---

## Implementation notes

```ts
// app/api/leads/route.ts
export async function POST(req: Request) {
  const body = await req.json()

  // 1. Validate
  const parsed = LeadSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: 'Invalid' }, { status: 400 })

  // Honeypot check
  if (body.__hp) return Response.json({ ok: true }) // silent drop for bots

  // Rate limit: 5 req/min per IP (via headers)

  // 2. Email — MUST succeed
  await sendLeadEmail(parsed.data) // throws → 500

  // 3. Notion — best-effort
  try {
    await writeToNotion(parsed.data)
  } catch (err) {
    console.error('[leads] Notion write failed:', err)
    // Continue — do not rethrow
  }

  return Response.json({ ok: true })
}
```

---

## Consequences

- Producer always receives email leads even during Notion outages
- Notion write failures create a small operational gap (manual recovery needed)
- Email template must include all lead fields (not just a notification — it IS the record of last resort)
- `RESEND_API_KEY` is the most critical env var; losing it blocks all form submissions

---

## Alternatives rejected

| Option | Reason rejected |
|---|---|
| Notion primary | Higher failure risk; no push notification; leads silently lost on Notion outage |
| Both blocking | Any secondary failure blocks the user; worse UX for a rare secondary failure |
| Queue / webhook | Over-engineered for v1 lead volume (~5–20 submissions/month) |
