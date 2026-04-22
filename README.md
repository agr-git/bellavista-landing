# Bellavista Coffee — Landing Page

Storytelling landing page for Bellavista Coffee (Manizales, Colombia) — a specialty coffee production project at 1,300 MASL. Drives 4 lead-gen funnels and hosts a dual-visibility journal (public field notes + private experiment log).

**Stack:** Next.js 14 · TypeScript · Tailwind (layout) + CSS custom properties (design tokens) · Framer Motion · MDX · NextAuth · Resend · Docker · AWS Lightsail

**Domain:** www.bellavista-coffee.com.co *(pending DNS cutover)*

---

## Quick start

```bash
# Install
npm install

# Set env vars
cp .env.example .env.local
# Fill in RESEND_API_KEY, NOTION_TOKEN, etc.

# Run dev server
npm run dev
# → http://localhost:3000
```

## Documentation

| File | Purpose |
|---|---|
| [`PROJECT_BLUEPRINT.md`](./PROJECT_BLUEPRINT.md) | Objective, stakeholders, success criteria, risks |
| [`DOCUMENT_REGISTRY.md`](./DOCUMENT_REGISTRY.md) | Manifest of every artifact in this repo |
| [`CLAUDE.md`](./CLAUDE.md) | Working rules for Claude Code CLI sessions |
| [`PLAN.md`](./PLAN.md) | Full implementation plan (all phases + checkpoints) |
| [`HANDOFF.md`](./HANDOFF.md) | Design handoff — Amanecer palette, 7 sections, Journal data model |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | System diagram + data flows |
| [`docs/decisions/ADR-*.md`](./docs/decisions/) | 5 locked architecture decisions |

## Project structure

```
/app                 Next.js App Router (pages, layouts, API routes)
/components          React components (sections, shared UI)
/content/journal     MDX journal posts (public)
/content/private     MDX experiment log (gitignored, Obsidian only)
/docs                Architecture, ADRs, retrospectives
/lib                 Libraries (journal reader, notion writer, email sender)
/scripts             Build-time helpers (content validator)
/reference           Design wireframes (HTML/JSX prototypes)
/screenshots         Design screenshots per section
```

## Design token rule

**Visual changes go in `app/styles/tokens.css`.** Tailwind consumes these via `tailwind.config.ts`. Never hardcode hex or px values in components. See [`docs/decisions/ADR-002`](./docs/decisions/ADR-002-css-vars-over-tailwind-tokens.md).

## Form submissions

Email-first architecture: Resend is blocking (must succeed), Notion write is best-effort. See [`docs/decisions/ADR-003`](./docs/decisions/ADR-003-email-first-form-fallback.md).

## Current phase

**Phase 2 — Build** · Next checkpoint: `B2_TOKENS`

See [`PLAN.md`](./PLAN.md) "Current status" block for the authoritative resume point.

---

## License

Private. © Bellavista Coffee.
