# Bellavista Coffee — Implementation Plan

**Project:** High-fidelity MVP landing page with journal system
**Stack:** Next.js 14 App Router · TypeScript · Tailwind (layout only) · CSS custom properties (design tokens) · Framer Motion · MDX · Obsidian · Docker · Lightsail
**Target:** www.bellavista-coffee.com.co

**Portfolio:** BVC (Bellavista Coffee)
**Program:** Cross Program
**Framework:** AutonomIA+ v3.4 — 5-Phase Methodology
**Notion project:** [BV | Landing Page MVP](https://www.notion.so/349ca4b1fd248143a900ec8df7f719b8)
**Sprint dates:** 2026-04-21 → 2026-04-26 (5 days)

---

## AutonomIA+ phase structure (source of truth)

The framework has **5 phases, advanced by gate criteria, not calendar**:

| # | Phase | Primary Tool | Key Output | Status |
|---|---|---|---|---|
| **0** | **Discover** | Claude Desktop + Notion | Data Inventory, Constraints | ✅ **Complete** (this planning conversation) |
| **1** | **Design** | Claude Desktop | Architecture, ADRs, Execution Briefs | 🟡 **Next** |
| **2** | **Build** | Claude Code + GitHub | Working code, deploy scripts | ⬜ |
| **3** | **Validate** | Claude Desktop + Code | Metrics, Feedback | ⬜ |
| **4** | **Ship** | All tools | Case Study, production live | ⬜ |

**My implementation milestones (scaffold, tokens, hero, journal, etc.) all live INSIDE Phase 2 (Build)** as sub-checkpoints `B1`–`B11`. Phases 0, 1, 3, 4 each have their own checkpoints (`D1`, `V1`, `S1`). This preserves framework alignment while keeping execution granular.

---

## Project Knowledge (PK) structure — per AutonomIA+ system prompt

Per the framework: **only 2 files live in Claude Desktop Project Knowledge.** Everything else is fetched on demand from Notion or GitHub.

| File | Location | Update frequency |
|---|---|---|
| `PROJECT_BLUEPRINT.md` | PK | Phase transitions, major arch changes |
| `DOCUMENT_REGISTRY.md` | PK | Every deliverable created |
| All other docs (ADRs, ARCHITECTURE, retros) | Notion + repo (`/docs/`) | As produced |

**Claude Code context** (different from PK — this is for Claude Code CLI sessions, not Claude Desktop):
- `CLAUDE.md` at repo root, ≤200 lines. Surgical context for future CLI sessions only.
- `PLAN.md` (this file) for deep context when needed.

---

## Phase 0 — Discover ✅ COMPLETE

**Completed in planning conversation (2026-04-21).**

**Outputs already produced:**
- Stakeholder map: producer (single user), B2B buyers, direct consumers, farm-stay guests, partners
- Constraints inventory: 2GB RAM VPS, coexistence with n8n, no-Notion-on-read rule, English-only v1
- Data inventory: handoff README, design canvas, screenshots, palette tokens, copy draft
- Architecture tradeoff analysis (Notion-as-CMS vs MDX+Obsidian — MDX chosen)
- Risk map: build OOM, visual update friction, scrolly fragility, form failures, etc.

**Gate criteria met:** ✅ Problem understood, stakeholders mapped, constraints documented, path forward agreed.

**Next gate to open:** Phase 1 begins.

---

## Phase 1 — Design

**Checkpoint name:** `D1_DESIGN`
**Phase output per framework:** Architecture, ADRs, Execution Briefs, Blueprint, Registry

### Option A — Use the skill (recommended per framework)
The `tpm-project-blueprint-generator-v2` skill fetches Notion templates, runs conversational Q&A, and outputs both `PROJECT_BLUEPRINT.md` + `DOCUMENT_REGISTRY.md`. Framework's own first-chat behavior says: *"If no Blueprint in Project Knowledge, prompt Alejo to run this skill before anything else."*

### Option B — Author manually from this conversation
All content for the Blueprint + Registry is already discovered. Claude Code can draft directly from this `PLAN.md` + handoff README.

### Tasks (either option)
- [ ] Initialize Git repo at `/Users/alejogil/Downloads/AI/bv-landing/`
- [ ] Create private GitHub repo `bellavista-landing`, set as `origin`
- [ ] Produce `PROJECT_BLUEPRINT.md` — per framework template (Notion: `303ca4b1-fd24-80d2-a159-f937f7fcd725`)
  - Problem, stakeholders, constraints, architecture, metrics, phase status
- [ ] Produce `DOCUMENT_REGISTRY.md` — per framework template (Notion: `305ca4b1-fd24-81e4-bea9-dd427f5d9958`)
  - Manifest of all outputs with locations
- [ ] Produce `ARCHITECTURE.md` at `/docs/ARCHITECTURE.md` — formal version of decisions locked below
- [ ] Author 5 ADRs at `/docs/decisions/`:
  - `ADR-001-mdx-over-notion-cms.md` — content store decision
  - `ADR-002-css-vars-over-tailwind-tokens.md` — token bridge pattern
  - `ADR-003-email-first-form-fallback.md` — form reliability
  - `ADR-004-build-on-server-with-ci-fallback.md` — CI/CD deferral
  - `ADR-005-self-hosted-video-v1.md` — media cost deferral
- [ ] Produce `CLAUDE.md` at repo root (≤200 lines) — Claude Code session context
- [ ] Create `/docs/retrospectives/TEMPLATE.md`
- [ ] Update Registry with all outputs above
- [ ] **Commit & push:** `docs(D1): design — blueprint, registry, architecture, ADRs 001-005`

### Gate criteria for advancing to Phase 2
- Blueprint signed off
- Registry populated
- All 5 ADRs authored
- Architecture doc reviewed

### Deliverable
AutonomIA+-compliant project knowledge + formal design outputs. Any future agent can resume cold.

---

## Phase 2 — Build

**Phase output per framework:** Working code, deploy scripts.
**Sub-checkpoints:** `B1` through `B11` (+ `B11B` conditional fallback).

Each sub-checkpoint ends with the 4-step discipline: commit (`feat(BN): ...`), push, update `DOCUMENT_REGISTRY.md`, update status block. Retrospectives at B6 + B9 (per AutonomIA+ v3.4 §3 feedback loops).

### B1 — Next.js scaffold
**Checkpoint:** `B1_SCAFFOLD` · **Resume signal:** `npm run dev` renders an empty page
- [ ] `npx create-next-app@latest` — TS, Tailwind, App Router, no src/, alias `@/*`
- [ ] Install: `framer-motion`, `next-mdx-remote`, `gray-matter`, `next-auth`, `resend`, `@notionhq/client`, `zod`, `bcryptjs`
- [ ] `.gitignore`: `/content/private/`, `.env.local`, `.env.production.local`, `.DS_Store`
- [ ] `.env.example` with empty vars
- [ ] Update README with quick-start
- [ ] **Commit:** `feat(B1): scaffold — Next.js 14 + TS + Tailwind + deps`

### B2 — Design tokens + typography
**Checkpoint:** `B2_TOKENS` · **Resume signal:** test page shows all type roles + color swatches
- [ ] `app/styles/tokens.css` — full token set (Amanecer palette + type scale + spacing)
- [ ] Import in `app/globals.css`
- [ ] `next/font` in `app/layout.tsx` for Instrument Serif, Geist, JetBrains Mono → CSS vars
- [ ] `tailwind.config.ts` extends from CSS vars (see Design token system below)
- [ ] `/app/_test/page.tsx` — all type roles + color swatches (dev-only)
- [ ] **Commit:** `feat(B2): tokens — CSS vars + Tailwind bridge + fonts + test page`

### B3 — Shell + Nav + MotionWrapper
**Checkpoint:** `B3_SHELL` · **Resume signal:** sticky nav scrolls to anchors, opaque-after-hero works
- [ ] `app/layout.tsx` — global shell, metadata
- [ ] `components/Nav.tsx` — sticky, IntersectionObserver hero sentinel, `EN | ES (soon)` disabled toggle
- [ ] `components/MotionWrapper.tsx` — single `"use client"` boundary, fade-up on enter (0.6s easeOutCubic)
- [ ] `app/page.tsx` — section stubs with anchor IDs
- [ ] **Commit:** `feat(B3): shell — nav, MotionWrapper, section stubs`

### B4 — Hero
**Checkpoint:** `B4_HERO` · **Resume signal:** matches `screenshots/01-hero.png`
- [ ] `components/sections/Hero.tsx` — full-bleed 100vh
- [ ] Placeholder video: dark `--bg` solid + CSS gradient (autoplay muted loop wired)
- [ ] Headline with italic + `--accent-2` on "to lines of"
- [ ] 72px circular play button with mute toggle
- [ ] Chapter strip with active-state underline via IntersectionObserver
- [ ] Gradient overlay: `linear-gradient(180deg, #1b243755 0%, #1b243722 35%, #1b2437ee 100%)`
- [ ] Responsive: h1 → 40px at ≤640px
- [ ] **Commit:** `feat(B4): hero — full-bleed layout, video placeholder, chapter strip`

### B5 — Story + Farm
**Checkpoint:** `B5_STATIC_A` · **Resume signal:** matches screenshots 02, 03
- [ ] `components/sections/Story.tsx` — 3-col `80px|1fr|300px`, drop cap "I", portrait, Previously card
- [ ] `components/sections/Farm.tsx` — chapter header + 2-col
- [ ] `components/sections/FarmMap.tsx` — SVG: 6 contour lines, accent-2 ridge, 3 plot markers
- [ ] Stats grid 2×3 (ALTITUDE, AREA, PLOTS, VARIETALS, PROCESS, PLANTED)
- [ ] Milestones row 6 cols, accent top-border on 2021 + 2024
- [ ] **Commit:** `feat(B5): story + farm — schematic map, stats grid, milestones`

### B6 — Chapter scrolly ⚠️ hardest piece
**Checkpoint:** `B6_SCROLLY` · **Resume signal:** works on Chrome + iOS Safari + Android Chrome
- [ ] `/app/_lab/scrolly/page.tsx` — isolated test page
- [ ] `components/sections/ChapterScrolly.tsx` — props `{ chapterNumber, plot, headline, body, stats, pins, videoSrc }`
- [ ] Left col: `position: sticky; top: 0` inside `min-height: 250vh` (NOT calculated heights)
- [ ] Right col: video placeholder, 22×22 accent pins → label card on hover/tap
- [ ] Progress bar: 2px track, `--accent` fill, tied to scroll within pinned block
- [ ] Mobile: drop pinning, video above text
- [ ] **Test on iOS Safari specifically** (sticky+flex bugs known) before marking done
- [ ] Replicate 3× for La Vega, El Bosque, La Cumbre
- [ ] **Commit:** `feat(B6): chapter scrolly — isolated lab + 3 plot integrations`
- [ ] **Retrospective:** `/docs/retrospectives/B6-scrolly.md`

### B7 — Coffee + Stay + Footer
**Checkpoint:** `B7_STATIC_B` · **Resume signal:** forms open (UI complete, unwired)
- [ ] `components/sections/Coffee.tsx` — B2B + Direct split, pull quote slab
- [ ] `components/sections/Stay.tsx` — 6×3 bento, Week/Weekend toggle, Price card (dashed border)
- [ ] `components/Footer.tsx` — Contact slab, Subscribe + Admin buttons
- [ ] `components/Modal.tsx` — shared dialog
- [ ] Form UIs (no submit yet): `RequestSamplesForm`, `WaitlistForm`, `StayInquiryForm`
- [ ] **Commit:** `feat(B7): coffee, stay, contact — bento grid, forms UI (unwired)`

### B8 — Journal MDX system
**Checkpoint:** `B8_JOURNAL` · **Resume signal:** MDX files render, `/journal/[slug]` works
- [ ] `lib/journal-schema.ts` — Zod schema: `{ title, date, kind, visibility, plot?, tags[], metrics?, cover_image_url? }`
- [ ] `lib/journal.ts` — reads MDX, filters `visibility: public`, sorts desc
- [ ] `components/sections/Journal.tsx` — featured + recent list + filter chips
- [ ] `app/journal/[slug]/page.tsx` — MDX rendering
- [ ] Seed `/content/journal/` with 3–5 entries from handoff
- [ ] `scripts/validate-content.ts` — runs in `prebuild`, fails on bad frontmatter
- [ ] **Commit:** `feat(B8): journal — MDX reader, Zod validation, feed + slug pages`

### B9 — Forms backend (email-first)
**Checkpoint:** `B9_FORMS` · **Resume signal:** submission → email to `gil.rivera.a@gmail.com` + Notion entry
- [ ] Notion integration token, share Resources DB
- [ ] Env: `NOTION_TOKEN`, `NOTION_RESOURCES_DB_ID`, `RESEND_API_KEY`, `RESEND_FROM`
- [ ] `app/api/leads/route.ts` — `{ type: 'b2b' | 'waitlist' | 'stay', ...fields }`
- [ ] **Email-first flow:** fire Resend ALWAYS (try/catch), THEN attempt Notion. 200 if email OK even if Notion fails. Log Notion errors.
- [ ] `lib/notion.ts`, `lib/email.ts`
- [ ] Wire forms, add loading/success/error states
- [ ] Honeypot + rate limit (5 req/min per IP)
- [ ] **Commit:** `feat(B9): forms backend — email-first fallback + Notion writer`
- [ ] **Retrospective:** `/docs/retrospectives/B9-forms.md`

### B10 — Admin + auth
**Checkpoint:** `B10_ADMIN` · **Resume signal:** `/admin` login works, shows all entries
- [ ] NextAuth Credentials provider, JWT strategy (no DB)
- [ ] Env: `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `NEXTAUTH_SECRET`
- [ ] `app/admin/page.tsx` — list all entries, filter by kind/visibility
- [ ] `app/admin/login/page.tsx`
- [ ] Middleware gate on `/admin/*`
- [ ] v1 is read-only (writing via Obsidian + git push)
- [ ] **Commit:** `feat(B10): admin — NextAuth credentials, read-only view`

### B11 — Lightsail infrastructure
**Checkpoint:** `B11_INFRA` · **Resume signal:** stack running, n8n still healthy
- [ ] Assign static IP in Lightsail
- [ ] SSH in, check n8n health, Docker version
- [ ] `/srv/bellavista/` with `app/`, `media/`, `nginx/`
- [ ] `docker-compose.yml` (**separate from n8n**): `bellavista-app` (Next.js :3000 internal), `bellavista-nginx` (:80, :443), media volume
- [ ] Nginx: proxy to app, serve `/media/*` with long cache + gzip/brotli
- [ ] Join n8n's network read-only for future routing
- [ ] Deploy: build locally → `docker save | gzip | ssh ... docker load` → `docker compose up -d`
- [ ] **RAM check during build:** `watch docker stats` — if >85%, trigger B11B
- [ ] **Commit:** `feat(B11): infra — Docker Compose, Nginx, media volume`

### B11B — CI/CD fallback (conditional — only if triggered)
**Checkpoint:** `B11B_CI_BUILD` · **Trigger:** on-server builds OOM or destabilize n8n
- [ ] `.github/workflows/deploy.yml` — build → push to `ghcr.io/[user]/bellavista:latest` → SSH deploy
- [ ] GitHub Secrets: `LIGHTSAIL_SSH_KEY`, `LIGHTSAIL_HOST`, `GHCR_TOKEN`
- [ ] Replace `build: .` with `image: ghcr.io/...`
- [ ] **Commit:** `chore(B11B): CI/CD — GitHub Actions + GHCR (OOM fallback activated)`

### Gate criteria for advancing to Phase 3
- All B-milestones marked complete (except B11B if not triggered)
- Site builds + deploys successfully on Lightsail
- All sections render with placeholder media
- Forms submit end-to-end on staging
- No console errors on desktop or mobile

---

## Phase 3 — Validate

**Checkpoint name:** `V1_VALIDATE`
**Phase output per framework:** Metrics, Feedback

### Tasks
- [ ] Cross-browser smoke test: Chrome, Safari (desktop + iOS), Firefox, Android Chrome
- [ ] Chapter scrolly specifically re-tested on iOS Safari (known failure modes)
- [ ] Form end-to-end: submit each of 3 forms → verify email arrives → verify Notion entry
- [ ] Admin login → logout → session expiry
- [ ] Lighthouse audit: target ≥90 Performance, ≥95 Accessibility, ≥100 SEO, ≥95 Best Practices
- [ ] Manual a11y pass: keyboard nav, focus visible, screen reader headings
- [ ] Bad-MDX test: malformed frontmatter → `npm run build` fails gracefully
- [ ] Notion-down test: temporarily break Notion token → form still delivers email
- [ ] Load test sanity: `ab -n 500 -c 10` on home + `/api/leads` (don't hammer prod)
- [ ] Author `docs/retrospectives/V1-validate.md` — what broke, what we fixed
- [ ] **Commit:** `test(V1): validate — cross-browser, a11y, lighthouse, form e2e`

### Gate criteria for advancing to Phase 4
- All critical browsers pass
- Forms deliver reliably including Notion-failure path
- Lighthouse targets met
- No P0/P1 bugs open

---

## Phase 4 — Ship

**Checkpoint name:** `S1_LIVE`
**Phase output per framework:** Case Study, production live

### Tasks
- [ ] Registrar: A records
  ```
  @      → [Lightsail static IP]
  www    → [Lightsail static IP]
  ```
- [ ] Verify propagation: `dig +short bellavista-coffee.com.co`
- [ ] Certbot for Let's Encrypt inside Nginx
- [ ] HTTP → HTTPS redirect, both `www` + apex work
- [ ] Cert auto-renewal cron
- [ ] Delete `/app/_test/` and `/app/_lab/` before final build
- [ ] Final smoke test on production domain
- [ ] **Author Case Study** (`docs/case-study.md`) — problem, decisions, tradeoffs, outcomes (hiring-manager audience per AutonomIA+ dual-audience rule)
- [ ] Post-ship retrospective: `docs/retrospectives/S1-ship.md`
- [ ] Update Blueprint with final phase status
- [ ] **Commit:** `feat(S1): ship — DNS, Let's Encrypt, production cutover`
- [ ] **Commit:** `docs(S1): case study + final retrospective`

### Post-ship (ongoing, no gate)
- Real drone video + photography → `/srv/bellavista/media/`
- Spanish copy when client delivers → wire i18n routing
- Analytics (Plausible, optional)
- OG image + favicon

---

## Architecture decisions (locked)

| Concern | Decision |
|---|---|
| **Content store** | MDX files in `/content/`, Obsidian locally |
| **Private notes** | `/content/private/` — `.gitignore`'d |
| **Design tokens** | CSS custom properties in `app/styles/tokens.css` |
| **Tailwind role** | Layout/spacing only. Colors/typography via CSS var bridge |
| **Visual updates** | Edit `tokens.css`; components only for structure |
| **Media v1** | Self-hosted on Lightsail, served via Nginx |
| **Forms** | Email-first (Resend) + Notion Resources DB |
| **Build strategy** | On-server first; B11B CI/CD fallback if OOM |
| **Auth** | NextAuth JWT, single admin password |
| **Animation** | Single `<MotionWrapper>` client boundary |
| **i18n v1** | English only, disabled toggle |
| **n8n** | Separate `docker-compose.yml`, shared network |

---

## Design token system (`tokens.css` ↔ `tailwind.config.ts`)

### Source of truth: `app/styles/tokens.css`
```css
:root {
  /* Color — Amanecer */
  --bg: #1b2437; --surface: #243049;
  --paper: #fef5e2; --ink: #fef5e2;
  --ink-2: #c5cad6; --ink-3: #8893a6;
  --line: rgba(254,245,226,0.14);
  --line-strong: rgba(254,245,226,0.28);
  --accent: #e89b4a; --accent-2: #f5c98a;
  --shadow: 0 4px 20px rgba(0,0,0,0.35);

  /* Type */
  --font-serif: "Instrument Serif", serif;
  --font-sans: "Geist", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  --fs-h1: 84px; --lh-h1: 0.92;  --ls-h1: -0.025em;
  --fs-h2: 54px; --lh-h2: 1;     --ls-h2: -0.02em;
  --fs-h3: 36px; --lh-h3: 1.15;  --ls-h3: -0.01em;
  --fs-h4: 24px; --lh-h4: 1.2;   --ls-h4: -0.01em;
  --fs-body: 14px; --lh-body: 1.55;
  --fs-small: 12px;
  --fs-label: 10px; --ls-label: 0.2em;
  --fs-meta: 9px;   --ls-meta: 0.15em;

  /* Spacing 4pt */
  --s-1: 4px; --s-2: 8px; --s-3: 12px; --s-4: 16px;
  --s-5: 20px; --s-6: 24px; --s-8: 32px; --s-10: 40px;
  --s-14: 56px; --s-20: 80px; --s-30: 120px;

  --radius: 2px;
}

@media (max-width: 768px) {
  :root { --fs-h1: 40px; --fs-h2: 36px; --fs-h3: 28px; }
}
```

### Bridge: `tailwind.config.ts`
```ts
theme: { extend: {
  colors: {
    bg: "var(--bg)", surface: "var(--surface)", paper: "var(--paper)",
    ink: { DEFAULT: "var(--ink)", 2: "var(--ink-2)", 3: "var(--ink-3)" },
    accent: { DEFAULT: "var(--accent)", 2: "var(--accent-2)" },
    line: { DEFAULT: "var(--line)", strong: "var(--line-strong)" },
  },
  fontFamily: {
    serif: ["var(--font-serif)"], sans: ["var(--font-sans)"], mono: ["var(--font-mono)"],
  },
}}
```

### How Claude Code modifies the system
| Request | Edit |
|---|---|
| "Change accent color" | `tokens.css` only |
| "Make h1 smaller" | `tokens.css` only |
| "Swap fonts" | `tokens.css` + `app/layout.tsx` |
| "Add padding to hero" | Component JSX (Tailwind) |
| "Change Farm grid layout" | `components/sections/Farm.tsx` |
| "New journal entry" | New `.md` in `/content/journal/` |

**Rule:** visual/token → `tokens.css`. Structural/layout → component. Never hardcode hex/sizes in components.

---

## Git + documentation discipline (every checkpoint)

1. `git add . && git commit -m "<scope>(<CP>): <short summary>"`
2. `git push origin main`
3. Update `DOCUMENT_REGISTRY.md` if new docs landed
4. Update status block below

**Scope convention:** `feat` new · `fix` correction · `docs` docs-only · `chore` tooling · `test` validation

**Retrospectives:** required after B6, B9, V1, S1. Per AutonomIA+ v3.4 §3.

---

## Commit message reference

| Checkpoint | Phase | Commit |
|---|---|---|
| `D1_DESIGN` | 1 | `docs(D1): design — blueprint, registry, architecture, ADRs 001-005` |
| `B1_SCAFFOLD` | 2 | `feat(B1): scaffold — Next.js 14 + TS + Tailwind + deps` |
| `B2_TOKENS` | 2 | `feat(B2): tokens — CSS vars + Tailwind bridge + fonts + test page` |
| `B3_SHELL` | 2 | `feat(B3): shell — nav, MotionWrapper, section stubs` |
| `B4_HERO` | 2 | `feat(B4): hero — full-bleed layout, video placeholder, chapter strip` |
| `B5_STATIC_A` | 2 | `feat(B5): story + farm — schematic map, stats grid, milestones` |
| `B6_SCROLLY` | 2 | `feat(B6): chapter scrolly — isolated lab + 3 plot integrations` |
| `B7_STATIC_B` | 2 | `feat(B7): coffee, stay, contact — bento grid, forms UI (unwired)` |
| `B8_JOURNAL` | 2 | `feat(B8): journal — MDX reader, Zod validation, feed + slug pages` |
| `B9_FORMS` | 2 | `feat(B9): forms backend — email-first + Notion writer` |
| `B10_ADMIN` | 2 | `feat(B10): admin — NextAuth credentials, read-only view` |
| `B11_INFRA` | 2 | `feat(B11): infra — Docker Compose, Nginx, media volume` |
| `B11B_CI_BUILD` | 2 | `chore(B11B): CI/CD — GitHub Actions + GHCR (OOM fallback)` |
| `V1_VALIDATE` | 3 | `test(V1): validate — cross-browser, a11y, lighthouse, form e2e` |
| `S1_LIVE` | 4 | `feat(S1): ship — DNS, Let's Encrypt, production cutover` |

---

## Session resumption protocol

Future Claude Code session should:
1. Read `CLAUDE.md` first (≤200 lines, surgical context)
2. Read `PLAN.md` second for deep context
3. `git log --oneline | head -5` — confirm last completed checkpoint
4. Resume at the next checkpoint — each is self-contained
5. Authoring a retrospective (at B6, B9, V1, S1) happens before starting next checkpoint

### Current status

```
Last completed checkpoint: Phase 0 (Discover) — complete
Next checkpoint: D1_DESIGN (Phase 1)
Blockers: none
Open question: use tpm-project-blueprint-generator-v2 skill for D1, or author manually?
```

**Update this block after every checkpoint before pushing.**

---

## Key file locations

```
/PROJECT_BLUEPRINT.md            ← AutonomIA+ PK file
/DOCUMENT_REGISTRY.md            ← AutonomIA+ PK file
/CLAUDE.md                       ← Claude Code CLI context (≤200 lines)
/PLAN.md                         ← this file
/docs/ARCHITECTURE.md            ← formal architecture
/docs/decisions/ADR-*.md         ← ADRs
/docs/retrospectives/*.md        ← per-checkpoint retros
/docs/case-study.md              ← produced in S1
/content/journal/*.md            ← public entries (committed)
/content/copy/*.md               ← section copy (committed)
/content/private/*.md            ← Obsidian-only (gitignored)
/app/styles/tokens.css           ← VISUAL CHANGES HERE
/tailwind.config.ts              ← CSS var bridge
/components/sections/*.tsx       ← section components
/components/MotionWrapper.tsx    ← animation boundary
/lib/{journal,notion,email}.ts   ← libs
/app/api/leads/route.ts          ← forms endpoint
/scripts/validate-content.ts     ← prebuild validator
/docker-compose.yml              ← deploy stack
```

---

## Risks tracked (all mitigated)

| Risk | Mitigation | Where |
|---|---|---|
| Build OOM | B11B CI/CD fallback documented | B11/B11B |
| Visual update friction | CSS vars single source | B2 |
| Scrolly Safari bugs | Isolated lab, pre-integration test | B6 |
| n8n disruption | Separate compose files | B11 |
| Form silent failure | Email-first, Notion second | B9 |
| Bad MDX breaks build | Zod prebuild validator | B8 |
| Video CDN cost | Self-host on Lightsail v1 | B11 |
| Hydration mismatch | Single MotionWrapper boundary | B3 |
| i18n premature | English only, disabled toggle | B3 |
