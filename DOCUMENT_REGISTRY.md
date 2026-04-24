# DOCUMENT REGISTRY
## Bellavista Coffee — Landing Page MVP

**Framework:** AutonomIA+ v3.4
**Last updated:** 2026-04-24 (DEPLOY_PHASE_A)

Update this file every time a new deliverable is produced. One row per artifact. Mark location precisely so any agent can fetch cold.

---

## Phase 1 — Design (D1_DESIGN)

| Artifact | Path | Status | Notes |
|---|---|---|---|
| Project Blueprint | `/PROJECT_BLUEPRINT.md` | ✅ | AutonomIA+ PK file |
| Document Registry | `/DOCUMENT_REGISTRY.md` | ✅ | AutonomIA+ PK file (this file) |
| CLAUDE.md | `/CLAUDE.md` | ✅ | Claude Code CLI context, ≤200 lines |
| Architecture | `/docs/ARCHITECTURE.md` | ✅ | System diagram + data flow |
| ADR-001 | `/docs/decisions/ADR-001-mdx-over-notion-cms.md` | ✅ | MDX + Obsidian vs Notion-as-CMS |
| ADR-002 | `/docs/decisions/ADR-002-css-vars-over-tailwind-tokens.md` | ✅ | CSS custom properties ↔ Tailwind bridge |
| ADR-003 | `/docs/decisions/ADR-003-email-first-form-fallback.md` | ✅ | Email-first form reliability |
| ADR-004 | `/docs/decisions/ADR-004-build-on-server-with-ci-fallback.md` | ✅ | CI/CD deferral strategy |
| ADR-005 | `/docs/decisions/ADR-005-self-hosted-video-v1.md` | ✅ | Media hosting decision |
| Retro template | `/docs/retrospectives/TEMPLATE.md` | ✅ | Used at B6, B9, V1, S1 |
| Implementation plan | `/PLAN.md` | ✅ | Master plan, all phases + checkpoint detail |
| Design handoff | `/HANDOFF.md` | ✅ | Amanecer palette, 7 sections, Journal model (renamed from README.md in B1) |
| Project README | `/README.md` | ✅ | Quick-start + doc map (B1) |

---

## Phase 2 — Build

| Artifact | Path | Status | Notes |
|---|---|---|---|
| Next.js scaffold | `/` | ✅ | B1_SCAFFOLD — package.json, app/, tailwind, eslint, tsconfig |
| .env.example | `/.env.example` | ✅ | B1_SCAFFOLD — all env vars stubbed |
| tokens.css | `/app/styles/tokens.css` | ✅ | B2_TOKENS — Amanecer palette + type scale + spacing |
| tailwind.config.ts | `/tailwind.config.ts` | ✅ | B2_TOKENS — CSS var bridge (colors/type/spacing/radius/shadow) |
| Token test page | `/app/(dev)/tokens/page.tsx` | ✅ | B2_TOKENS — dev-only; delete with app/(dev)/ in S1 |
| Layout shell | `/app/layout.tsx` | ✅ | B3_SHELL |
| Nav | `/components/Nav.tsx` | ✅ | B3_SHELL |
| MotionWrapper | `/components/MotionWrapper.tsx` | ✅ | B3_SHELL |
| Hero section | `/components/sections/Hero.tsx` | ✅ | B4_HERO (commit 0c07e7a) |
| Story section | `/components/sections/Story.tsx` | ✅ | B5_STATIC_A (commit 58b5eb2) |
| Farm section | `/components/sections/Farm.tsx` | ✅ | B5_STATIC_A |
| FarmMap SVG | `/components/sections/FarmMap.tsx` | ✅ | B5_STATIC_A |
| ChapterScrolly | `/components/sections/ChapterScrolly.tsx` | ✅ | B6_SCROLLY (commit 0c77f8c) |
| Scrolly lab page | `/app/(dev)/scrolly/page.tsx` | ✅ | B6_SCROLLY — **delete in S1** (dev-only) |
| Chapters composer | `/components/sections/Chapters.tsx` | ✅ | B6_SCROLLY |
| Coffee section | `/components/sections/Coffee.tsx` | ✅ | B7_STATIC_B (commit 6407e87) |
| Stay section | `/components/sections/Stay.tsx` | ✅ | B7_STATIC_B |
| Footer | `/components/Footer.tsx` | ✅ | B7_STATIC_B / B9 (subscribe wired) |
| Modal | `/components/Modal.tsx` | ✅ | B7_STATIC_B |
| Form components | `/components/forms/*.tsx` | ✅ | B7 UI + B9 wiring |
| Journal schema | `/lib/journal-schema.ts` | ✅ | B8_JOURNAL (commit 16c3a17) |
| Journal lib | `/lib/journal.ts` | ✅ | B8_JOURNAL |
| Journal section | `/components/sections/Journal.tsx` | ✅ | B8_JOURNAL |
| Journal slug page | `/app/journal/[slug]/page.tsx` | ✅ | B8_JOURNAL |
| Content validator | `/scripts/validate-content.ts` | ✅ | B8_JOURNAL (prebuild hook) |
| Seed journal entries | `/content/journal/*.md` | ✅ | B8_JOURNAL — 5 public seeds (**to be replaced** — CONTENT_JOURNAL) |
| Private entry example | `/content/private/pick-plan-q2-2026.md` | ✅ | B8_JOURNAL (gitignored in practice) |
| Leads API route | `/app/api/leads/route.ts` | ✅ | B9_FORMS (commit 267e362) |
| Notion lib | `/lib/notion.ts` | ✅ | B9_FORMS — best-effort writer |
| Email lib | `/lib/email.ts` | ✅ | B9_FORMS — Resend wrapper, throws on failure |
| Rate limiter | `/lib/rate-limit.ts` | ✅ | B9_FORMS — in-memory 5/min/IP |
| Submit lead helper | `/lib/submit-lead.ts` | ✅ | B9_FORMS — client-side submitter |
| Admin dashboard | `/app/admin/page.tsx` | ⏸ | B10_ADMIN — **PARKED** post-v1 |
| Admin login | `/app/admin/login/page.tsx` | ⏸ | B10_ADMIN — **PARKED** |
| Auth middleware | `/middleware.ts` | ⏸ | B10_ADMIN — **PARKED** |
| Dockerfile | `/Dockerfile` | ✅ | B11_INFRA (commit d12dc61) — multi-stage, standalone output |
| docker-compose.yml | `/docker-compose.yml` | ✅ | B11_INFRA — Option A (attaches to `automation_automation` external net) |
| .dockerignore | `/.dockerignore` | ✅ | B11_INFRA |
| public/ placeholder | `/public/.gitkeep` | ✅ | Deploy fix (commit 65d75d4) |
| Nginx config (repo) | `/nginx/*.conf` | 🗂 | B11_INFRA — kept for reference only; **not used** (Option A uses edge nginx at `/opt/automation/`) |
| **Edge nginx config (server)** | `/opt/automation/nginx/conf.d/bellavista.conf` | ✅ | DEPLOY_PHASE_A — **on server**, not in this repo |
| GHA deploy workflow | `/.github/workflows/deploy.yml` | ⬜ | B11B (conditional) — parked, build-on-server worked |
| B6 retrospective | `/docs/retrospectives/B6-scrolly.md` | ✅ | After B6 |
| B9 retrospective | `/docs/retrospectives/B9-forms.md` | ✅ | After B9 |
| **Deploy retrospective** | `/docs/retrospectives/DEPLOY-option-a.md` | ✅ | DEPLOY_PHASE_A — Option A decision, HSTS learning, rollback records |

---

## Phase 3 — Validate

| Artifact | Path | Status | Notes |
|---|---|---|---|
| V1 retrospective | `/docs/retrospectives/V1-validate.md` | ⬜ | After V1 |

---

## Phase 4 — Ship

| Artifact | Path | Status | Notes |
|---|---|---|---|
| Case study | `/docs/case-study.md` | ⬜ | S1 (hiring-manager audience) |
| S1 retrospective | `/docs/retrospectives/S1-ship.md` | ⬜ | After S1 |

---

## External resources

| Resource | Location | Notes |
|---|---|---|
| Notion project | https://www.notion.so/349ca4b1fd248143a900ec8df7f719b8 | Task board + handoff |
| Notion Tasks DB | collection://2e40d7f6-a76f-4110-8a76-f2cf0111b4ff | 15 tasks linked to project |
| Notion Resources DB | (set NOTION_RESOURCES_DB_ID in env) | Form submission target |
| Design wireframes | `/reference/Bellavista Wireframes v3.html` | Open in browser to view |
| Screenshots | `/screenshots/01-hero.png` … `07-journal-contact.png` | Fidelity reference |
| GitHub repo | https://github.com/agr-git/bellavista-landing | Public during build, switch to private post-launch |
| Lightsail VPS | IP 44.192.98.134 (ubuntu user) | Key: Lightsail_Autonomia.pem. n8n + Bellavista on same box, both behind shared nginx edge. |
| Staging URL | http://bellavista.test/ | Via laptop `/etc/hosts` override — no TLS yet (HSTS blocks `.co` self-signed). |
| Production URL (future) | https://bellavista-coffee.com.co | After S1 (DNS + Let's Encrypt). |
