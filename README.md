# Bellavista Coffee — Landing Page

Storytelling landing page for Bellavista Coffee (Manizales, Colombia) — a specialty coffee production project at 1,300 MASL. The site combines farm story, field notes, member access, and lead-generation surfaces for B2B samples, direct consumers, farm-stay inquiries, and partners.

**Stack:** Next.js 14 · TypeScript · Tailwind (layout) + CSS custom properties (design tokens) · Framer Motion · MDX · NextAuth · Supabase · Resend · Docker · AWS Lightsail

**Production domain:** https://bellavista-coffee.com.co

## Current release state

The repository contains the V1 landing experience, journal system, Docker/Lightsail deploy artifacts, TLS renewal runbook, Google OAuth + Supabase members module, and brand assets.

Open production gates are tracked in GitHub issues rather than duplicated as task text here:

- #1 — Reconcile production with `main` and enable auth/members.
- #2 — Resend + Notion lead funnels; deferred pending PM decision.
- #3 — V1 production validation and evidence report.
- #4 — Production OG image and social metadata.
- #5 — Dependency security remediation.
- #6 — Ship closure documentation and artifacts.

No merge or production deployment should happen without Alejandro's explicit approval.

## Quick start

```bash
npm ci
cp .env.example .env.local
npm run dev
# http://localhost:3000
```

For production auth/members setup, follow `docs/operations/AUTH-PRODUCTION-READINESS.md` after issue #1 lands.

## Required local checks

```bash
npm run lint
npm run validate:content
npm run build
```

If working on auth, also run the issue #1 readiness checks once that PR is merged.

## Documentation

- `PROJECT_BLUEPRINT.md` — project objective, stakeholders, constraints, architecture, risks.
- `DOCUMENT_REGISTRY.md` — artifact manifest and status.
- `CLAUDE.md` — working rules for agent/code sessions.
- `PLAN.md` — implementation and phase history.
- `HANDOFF.md` — design handoff.
- `docs/ARCHITECTURE.md` — system diagram and data flows.
- `docs/decisions/` — architecture decision records.
- `docs/operations/` — operational runbooks.
- `docs/retrospectives/` — checkpoint and release retrospectives.
- `docs/case-study.md` — Ship narrative and current release readout.

## Project structure

```text
/app                 Next.js App Router pages, layouts, API routes
/components          Section, form, motion, member, and shared UI components
/content/journal     Public MDX journal entries
/content/private     Private MDX experiment log; gitignored
/docs                Architecture, ADRs, operations, retrospectives
/lib                 Journal, auth, Supabase, Substack, email, Notion, rate-limit libraries
/public              Brand, media, and static assets
/scripts             Build-time and operations helpers
```

## Operating rules

- Visual token changes belong in `app/styles/tokens.css`; do not hardcode palette values in components.
- Notion is not on the read path. Content is MDX; Notion is only a best-effort lead backup.
- Resend is the blocking delivery channel for form submissions; Notion write failures are logged but non-blocking.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose it client-side or commit env files.
- n8n runs in a separate server compose stack. Do not modify or restart it from this repository's deploy work.

## License

Private. © Bellavista Coffee.
