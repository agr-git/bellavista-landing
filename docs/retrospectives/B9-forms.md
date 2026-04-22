# B9 Retrospective — Forms backend (email-first)

**Date:** 2026-04-22
**Checkpoint:** `B9_FORMS`
**Commit:** see `feat(B9): forms backend — email-first fallback + Notion writer`

---

## What I built

- `lib/email.ts` — Resend wrapper. PRIMARY channel. Throws on failure.
  Dev fallback logs to stdout when `RESEND_API_KEY` is absent so local
  forms complete end-to-end without keys; prod refuses to fake sends.
- `lib/notion.ts` — Notion Resources DB writer. BEST-EFFORT. Never
  throws outside itself; returns `{ ok, reason }`. Missing creds =
  `not_configured`, a non-error.
- `lib/rate-limit.ts` — in-memory token bucket, 5 req/min per IP.
  Sufficient for single-instance Lightsail target (ADR-004). Trivially
  swappable for Upstash Redis if we horizontally scale.
- `lib/submit-lead.ts` — client helper. One place for the fetch call
  and the error-code → message mapping.
- `app/api/leads/route.ts` — Zod-validated discriminated union for
  {b2b, waitlist, stay, subscribe}. Honeypot → silent 200. Rate-limit
  first (cheapest rejection). Resend → 500 on failure. Notion → log.
- 4 wired forms: `RequestSamplesForm`, `WaitlistForm`,
  `StayInquiryForm`, Footer Subscribe. Each has idle / sending /
  success / error states.

## ADR-003 contract — verified

```
POST /api/leads
  → Resend.send()    MUST succeed → 500 on failure, lead NOT captured
  → Notion.write()   best-effort  → log on failure, still 200
```

Implemented exactly this way. The key tradeoff (simpler, less
surprising, lower write amplification on a 2 GB VPS) holds.

## What I explicitly did not do

- **No Zod parsing inside the forms themselves.** The server route is
  the single validator. Client-side it would duplicate schemas; better
  to surface server errors with the generic 400 message and keep the
  forms dumb.
- **No Notion schema auto-migration.** `lib/notion.ts` assumes the
  Resources DB has `Title` / `Type` / `Payload` / `Received`
  properties. If the DB drifts, the Notion write errors — the email
  path still succeeds. Silent degradation by design.
- **No CAPTCHA.** Honeypot + rate limit is the level of spam defense
  this surface needs. If abuse lands post-launch we revisit with
  hCaptcha at the route level.

## Follow-ups

- [ ] Point `RESEND_API_KEY`, `RESEND_FROM`, `NOTION_TOKEN`,
  `NOTION_RESOURCES_DB_ID` in `.env.local` before cutover.
- [ ] Share the Notion Resources DB with the integration.
- [ ] Once domain DNS is live, verify `RESEND_FROM` is on a domain the
  Resend account has SPF/DKIM for.
- [ ] Consider moving the rate-limit map to Upstash Redis if we ever
  run multi-instance (not planned for v1 per ADR-004).
- [ ] V1 smoke test: fire one of each of the 4 lead types from the
  live page, verify inbox + Notion.

## Gate criteria — met?

| Criteria | Status |
|---|---|
| 4 funnels all POST a well-formed payload | ✅ |
| Resend primary, Notion best-effort | ✅ |
| Honeypot | ✅ (`website` field, silent 200) |
| Rate limit 5/min | ✅ (in-memory, ADR-004 scale target) |
| Validation | ✅ (Zod discriminated union) |
| Build clean | ✅ |

**Decision:** pass the B9 gate. Live-smoke testing is V1.
