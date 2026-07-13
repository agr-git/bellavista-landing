# DOCUMENT REGISTRY
## Bellavista Coffee — Landing Page MVP

**Framework:** AutonomIA+ v3.4
**Last updated:** 2026-07-13 (S1_SHIP_DOCS — README, case study, Ship retrospective)

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
| tokens.css | `/app/styles/tokens.css` | ✅ | B2_TOKENS — palette + type scale + spacing. **BRAND_V2 (2026-05-10)** replaced Amanecer blue with Onyx + Paper; added paper-surface, ink-on-paper-*, accent-on-paper, line-on-paper-* tokens |
| tailwind.config.ts | `/tailwind.config.ts` | ✅ | B2_TOKENS — CSS var bridge (colors/type/spacing/radius/shadow) |
| Token test page | ~~`/app/(dev)/tokens/page.tsx`~~ | 🗑 | B2_TOKENS dev-only — removed in DEV_CLEANUP (2026-04-26) |
| Layout shell | `/app/layout.tsx` | ✅ | B3_SHELL |
| Nav | `/components/Nav.tsx` | ✅ | B3_SHELL |
| MotionWrapper | `/components/MotionWrapper.tsx` | ✅ | B3_SHELL |
| Hero section | `/components/sections/Hero.tsx` | ✅ | B4_HERO (commit 0c07e7a) |
| Story section | `/components/sections/Story.tsx` | ✅ | B5_STATIC_A (commit 58b5eb2) |
| Farm section | `/components/sections/Farm.tsx` | ✅ | B5_STATIC_A |
| FarmMap SVG | `/components/sections/FarmMap.tsx` | ✅ | B5_STATIC_A |
| ChapterScrolly | `/components/sections/ChapterScrolly.tsx` | ✅ | B6_SCROLLY (commit 0c77f8c) |
| Scrolly lab page | ~~`/app/(dev)/scrolly/page.tsx`~~ | 🗑 | B6_SCROLLY dev-only — removed in DEV_CLEANUP (2026-04-26) |
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
| robots.txt route | `/app/robots.ts` | ✅ | DEV_ROBOTS (2026-04-26) — Next 14 metadata API |
| sitemap.xml route | `/app/sitemap.ts` | ✅ | DEV_ROBOTS (2026-04-26) — root + journal slugs |
| themes.css | `/app/styles/themes.css` | ✅ | DESIGN_ITER (2026-04-26) — kraft palette + per-section theme classes; per-theme hero overlay/radial vars. **BRAND_V2 (2026-05-10)** added `.theme-onyx` + `.theme-paper` (canonical v2 names) with `.theme-dark`/`.theme-cream` kept as aliases; kraft theme preserved for contact footer |
| Hero (theme-aware bg) | `/components/sections/Hero.tsx` | ✅ | DESIGN_ITER_1 (commit 01191b5) — gradient hexes → CSS vars so theme-kraft#hero renders correctly |
| Coffee/Stay/Footer (v3-kraft) | `/components/sections/Coffee.tsx`, `/components/sections/Stay.tsx`, `/components/Footer.tsx` | ✅ | DESIGN_ITER_2 (commit 69d3b6c) — surface-vs-bg cards + Footer rebuilt as kraft-→-dark transition piece per design |
| **Content authoring scaffold** | `/docs/content-authoring/` | ✅ | CONTENT_AUTHORING_SCAFFOLD (2026-04-26) — 10 sections × {schema, system-prompt, draft, production, preview} for outsourcing copywriting to non-Claude LLMs. Drafts/production/previews are gitignored (repo public). Includes `_authoring-guide.md`, `_template.html`, `_gemini-quickstart.md`. |
| **Content wired into components** | (see content sections above) | ✅ | CONTENT_WIRING_v1 (2026-04-28, commit 8abb32a + follow-ups) — all 10 production.md drafts wired into Hero, Story, Farm, three plot scrollies, Coffee, Stay, Footer, Journal. Atomic plot rename: la-vega→villa-paula, el-bosque→bambu-stream, la-cumbre→terra-preta. Farm gained stats_caption + milestone tri-state variant (accent/neutral/objective). Coffee chips reshaped (4 B2B, Direct now/soon split). Stay added Extra · slot. |
| Story portrait | `/public/media/portrait-producer.jpg` | ✅ | CONTENT_MEDIA (2026-04-28, commit 7394f76) — wired into Story.tsx via next/image (commit 5050caa); figcaption rebuilt as Alejo Gil LinkedIn link with brand-blue (#0A66C2) glyph |
| Hero drone video | `/public/media/hero.mp4` | ✅ | CONTENT_MEDIA (2026-04-28, commit ef9ac71) — 720p H.264 / CRF 26 / fast-start, 48 MB. Encoded from 929 MB 4K HEVC original (preserved at ~/Downloads/AI/bv-landing-originals/ outside repo) |
| Plot drone videos | `/public/media/{villa-paula,bambu-stream,terra-preta}.mp4` | ⬜ | CONTENT_MEDIA — pending. Fall back to gradient placeholder until uploaded. ≤30 MB each per `_filename-map.md` |
| Stay farmhouse photos | `/public/media/stay/stay-{01..21}.jpg` | ✅ | STAY_PHOTOS (2026-05-10) — 21 photos converted from HEIC via `sips -Z 1600 -s formatOptions 80`. 9.3 MB total. 5 wired into Stay.tsx (01 hero · 06 suite · 11 kitchen · 16 ridge · 20 farmhouse); other 16 staged for future swap. HEIC originals gitignored at `/public/media/Bellavista Stay Photos/` |
| Stay section (photos wired) | `/components/sections/Stay.tsx` | ✅ | STAY_PHOTOS (2026-05-10) — gradients replaced with next/image fill + bottom scrim for label legibility; gradient retained as load-time fallback. House-tour video cell repurposed as "From the farmhouse" still |
| Media filename map | `/public/media/_filename-map.md` | ✅ | CONTENT_MEDIA reference for the producer's media drops |
| **SectionBreak component** | `/components/SectionBreak.tsx` | ✅ | DESIGN_ITER_3 (2026-04-28, commit 3317bd4) — 12px stripe between sections. **BRAND_V2 (2026-05-10)** added canonical variants `onyx` / `paper` / `onyx-gradient`; legacy `blue`/`cream`/`blue-gradient` retained as aliases. Currently used: cream after Farm + between scrollies |
| ChapterScrolly responsive overhaul | `/components/sections/ChapterScrolly.tsx` | ✅ | DESIGN_ITER_3 (2026-04-28, commit d75ee34) — replaced `min-height: 250vh` + sticky with content-driven `padding-block: clamp(64px, 10vh, 160px)` + items-stretch grid + aspect-ratio video column |
| Hero responsive CTA + chapter strip | `/components/sections/Hero.tsx` | ✅ | CONTENT_WIRING_v1 (commits bed7795, 5c56f32) — chapter strip text-meta→text-small + ink semibold; "01 CASA"→"01 THE PRODUCER"; "05 BENEFICIO"→/beneficio; "Start the tour" full-row click target |
| Nav theme-independent fill | `/components/Nav.tsx` | ✅ | NAV_LEGIBILITY (2026-04-28, commit 74b9a79) — wordmark→"Bellavista Coffee"; past-hero state locked to dark-navy rgba(27,36,55,0.95) + cream text so the bar stays legible across all section themes |
| **/beneficio page** | `/app/beneficio/page.tsx` | ✅ | BENEFICIO_PAGE (2026-04-28, commits 74b9a79, 5c56f32) — soft paywall for chapter-05 + private-journal redirects. theme-cream surface, Story's chapter-marker pattern, two right-column cards (What you get / Trade access), <Footer />. noindex/nofollow. SUBSTACK_URL = `bellavistacoffee.substack.com` placeholder pending real handle |
| GHA deploy workflow | `/.github/workflows/deploy.yml` | ⬜ | B11B (conditional) — parked, build-on-server worked |
| B6 retrospective | `/docs/retrospectives/B6-scrolly.md` | ✅ | After B6 |
| B9 retrospective | `/docs/retrospectives/B9-forms.md` | ✅ | After B9 |
| **Deploy retrospective** | `/docs/retrospectives/DEPLOY-option-a.md` | ✅ | DEPLOY_PHASE_A — Option A decision, HSTS learning, rollback records |
| **TLS deploy retrospective** | `/docs/retrospectives/DEPLOY-tls-v1.md` | ✅ | DEPLOY_TLS_v1 (2026-05-10) — Let's Encrypt cert issuance via webroot, dockerized-nginx integration without touching /opt/automation/docker-compose.yml, HTTP→HTTPS 301, HSTS 6mo, auto-renewal via systemd timer + deploy hook |
| **Cert renewal runbook** | `/docs/operations/CERT-RENEWAL.md` | ✅ | DEPLOY_TLS_v1 (2026-05-11) — full runbook for the auto-renewal chain (certbot.timer → deploy hook → docker exec nginx -s reload). Includes verification, troubleshooting matrix, force-renew + rollback commands, and pointers to every relevant path on the server |
| **Cert health-check script** | `/scripts/check-cert.sh` | ✅ | DEPLOY_TLS_v1 (2026-05-11) — one-command quarterly health check. Pulls cert via `--resolve` (sidesteps local DNS cache), reports issuer/expiry/days-remaining/SAN/public HTTP, queries systemd timer state via SSH. Exit 0 healthy, 1 if <25 days remaining or wrong issuer, 2 if public HTTPS unreachable |
| **Content wiring retrospective** | `/docs/retrospectives/CONTENT-WIRING-v1.md` | ✅ | CONTENT_WIRING_v1 (2026-04-28) — covers content land + DESIGN_ITER_3 + BENEFICIO_PAGE in one consolidated retro |
| **Brand Guidelines v2→v3 (md)** | `/docs/BRAND_GUIDELINES_v2.md` | ✅ | BRAND_V2 (2026-05-10), updated LOGO_V3 (2026-05-11) — Onyx + Paper palette spec + §04 Logo System (ridge mark, three wordmark variants, usage rules, tagline) |
| **Brand Guidelines v2 (pdf)** | `/bellavista-brand-guidelines-v2.pdf` | ✅ | BRAND_V2 (2026-05-10) — 6-page printable brand sheet: cover, color-on-dark, color-on-paper, type, voice/form, v1→v2 changelog |
| **Brand Guidelines v3 (pdf)** | `/bellavista-brand-guidelines-v3.pdf` | ✅ | LOGO_V3 (2026-05-11) — 6-page supplier-ready brand sheet: cover, color system, typography, logo system, logo usage, voice & tagline |
| **BellavistaWordmark component** | `/components/BellavistaWordmark.tsx` | ✅ | LOGO_V3 (2026-05-11) — React component with horizontal lockup variant (onyx/paper themes), ridge mark SVG inline, optional tagline. Wired into Nav.tsx |
| **Logo SVG — Horizontal Paper** | `/public/brand/logo-horizontal-paper.svg` | ✅ | LOGO_V3 (2026-05-11) — 1200×600 full lockup with tagline, Paper background. Supplier asset |
| **Logo SVG — Horizontal Onyx** | `/public/brand/logo-horizontal-onyx.svg` | ✅ | LOGO_V3 (2026-05-11) — 1200×600 full lockup with tagline, Onyx background. Digital asset |
| **Logo SVG — Ridge Mark** | `/public/brand/logo-mark.svg` | ✅ | LOGO_V3 (2026-05-11) — 150×150 standalone ridge mark, transparent background |

---

## Phase 3 — Validate

| Artifact | Path | Status | Notes |
|---|---|---|---|
| V1 retrospective | `/docs/retrospectives/V1-validate.md` | ⏳ | Issue #3 — pending production/auth reconciliation; Resend/Notion E2E to be marked deferred while issue #2 is under PM discussion |
| Design v3 plan | `/docs/decisions/DESIGN-v3-pacing.md` | 🗑 | Superseded — DESIGN_ITER_3 was executed inline during CONTENT_WIRING_v1 (2026-04-28). See `/docs/retrospectives/CONTENT-WIRING-v1.md` for the responsive content-driven overhaul that replaced the 3×250vh runway concern |

---

## Phase 4 — Ship

| Artifact | Path | Status | Notes |
|---|---|---|---|
| Case study | `/docs/case-study.md` | ✅ | S1_SHIP_DOCS — current release readout with unresolved gates identified |
| S1 retrospective | `/docs/retrospectives/S1-ship.md` | ✅ | S1_SHIP_DOCS — truthful in-progress Ship retro; final completion requires production evidence |

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
