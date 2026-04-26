# CLAUDE.md — Bellavista Coffee Landing Page

> Surgical context for Claude Code CLI sessions. Read this first, then PLAN.md for deep context.

## What this repo is

Next.js 14 App Router landing page for Bellavista Coffee (Manizales, Colombia). Storytelling-first site + 4 lead-gen funnels + dual-visibility journal. Stack: Next.js 14 · TypeScript · Tailwind (layout only) · CSS custom properties · Framer Motion · MDX · NextAuth · Resend · Docker · Lightsail.

## Where to resume

```bash
git log --oneline | head -5          # confirm last checkpoint
cat PLAN.md | grep "Last completed"  # current status block
```

Each checkpoint is self-contained. The current status block in PLAN.md is the authoritative resume point.

## Design token rule (CRITICAL)

**Visual changes → `app/styles/tokens.css` only. Never hardcode hex or px values in components.**

| Request | File to edit |
|---|---|
| Change color / accent | `app/styles/tokens.css` |
| Change font size | `app/styles/tokens.css` |
| Change layout / spacing | Component JSX (Tailwind classes) |
| New journal entry | `/content/journal/*.md` |

Tailwind reads CSS vars via `tailwind.config.ts`. Changing a var propagates everywhere.

## File map

```
/PROJECT_BLUEPRINT.md        ← PK: objective, constraints, risks
/DOCUMENT_REGISTRY.md        ← PK: all artifacts + locations
/CLAUDE.md                   ← this file
/PLAN.md                     ← full implementation plan
/docs/ARCHITECTURE.md        ← system diagram
/docs/decisions/ADR-*.md     ← 5 architecture decisions
/docs/retrospectives/*.md    ← per-checkpoint retros
/app/styles/tokens.css       ← VISUAL CHANGES HERE
/tailwind.config.ts          ← CSS var bridge (don't touch colors here)
/content/journal/*.md        ← MDX posts (Obsidian edits locally)
/content/private/*.md        ← gitignored; Obsidian only
/lib/journal.ts              ← reads MDX, filters visibility
/lib/journal-schema.ts       ← Zod frontmatter validation
/app/api/leads/route.ts      ← forms: Resend first, Notion second
/lib/email.ts                ← Resend wrapper
/lib/notion.ts               ← Notion Resources DB writer
/components/MotionWrapper.tsx ← single "use client" animation boundary
/scripts/validate-content.ts ← prebuild MDX validator
```

## Checkpoint discipline (every B-checkpoint)

1. `git add -p && git commit -m "feat(BN): <summary>"`
2. `git push origin main`
3. Update `DOCUMENT_REGISTRY.md` (new rows for new files)
4. Update `PLAN.md` status block (`Last completed: BN_NAME`)

Retrospectives required after B6, B9, V1, S1.

## Commit scope convention

`feat` new · `fix` correction · `docs` docs-only · `chore` tooling · `test` validation

## Form submission flow (never silent failure)

```
POST /api/leads
  → Resend.send() — MUST succeed (throws on failure → 500)
  → Notion.write() — best-effort (catch, log, continue → 200)
```

If Resend fails → return 500. If Notion fails → log error, return 200. Email is the guarantee.

## Auth

NextAuth Credentials provider. JWT strategy, no DB.
Env vars: `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (bcrypt), `NEXTAUTH_SECRET`.
Middleware gates `/admin/*`. Admin surface is read-only in v1.

## Chapter scrolly (B6) — known risk

`position: sticky` inside `min-height: 250vh` container. Do NOT use calculated heights.
iOS Safari sticky + flex has known bugs — verify in V1_VALIDATE on the live URL.
The `/app/(dev)/scrolly` and `/tokens` lab routes were removed in DEV_CLEANUP
(2026-04-26) — re-introduce a temporary lab route only if a regression appears.

## Deploy

On-server build first. Monitor RAM: `watch docker stats` during build.
If >85% RAM → activate B11B (GitHub Actions + GHCR). See ADR-004.
n8n uses a separate `docker-compose.yml` — never merge or touch it.

## Environment variables

```
NOTION_TOKEN
NOTION_RESOURCES_DB_ID
RESEND_API_KEY
RESEND_FROM
ADMIN_EMAIL
ADMIN_PASSWORD_HASH
NEXTAUTH_SECRET
```

Copy `.env.example` → `.env.local`. Never commit `.env.local`.
