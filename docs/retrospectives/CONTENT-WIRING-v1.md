# Retrospective — CONTENT_WIRING_v1

**Date:** 2026-04-28
**Phase:** 2 Build (post-DESIGN_ITER_2)
**Checkpoint:** CONTENT_WIRING_v1 (also covers DESIGN_ITER_3 pacing pass + private-paywall page)
**Duration:** ~3h wall-clock across one session

> Not a formal AutonomIA+ checkpoint — this is the first production-copy land, the responsive-layout overhaul, and the new `/beneficio` page consolidated into one retro. Documented because the cumulative diff is significant (15 commits, 3 new components/pages, all ten section drafts wired).

---

## What was built / produced

**Content wiring (commit `8abb32a`)**

- Atomic plot rename across `Hero.CHAPTERS`, `Chapters.tsx`, `FarmMap.PLOTS`, and `/media/<plot>.mp4` references:
  - `la-vega → villa-paula`, `el-bosque → bambu-stream`, `la-cumbre → terra-preta`
- All ten section drafts in `/docs/content-authoring/*/production.md` wired into live components (Hero, Story, Farm, three plot scrollies, Coffee, Stay, Footer, Journal-meta).
- Farm gained two component-level capabilities the v4 draft required:
  - `stats_caption` row below the stats grid (`4 plots not pictured · ask for the others`)
  - milestone tri-state variant: `accent` / `neutral` / `objective` (dashed top border + small "Objective" badge + muted ink for future-tense items)
- Coffee chip rows restructured: B2B = 4 chips with flex-wrap (`cenicafé 1 · pink bourbon · castillo · colombia`); Direct split into `chips_now` + `chips_soon` with a "Coming soon" label and the soon-row at 55% opacity.
- Stay price card gained an `Extra · …` mono-uppercase line below inclusions for add-on experiences.

**Story portrait + caption (commits `5050caa`, `28377c7`, `d677e78`)**

- Replaced kraft-gradient placeholder with real `/media/portrait-producer.jpg` via `next/image`.
- Figcaption rebuilt as a centered LinkedIn link (`Alejo Gil · LinkedIn` with inline LinkedIn glyph, brand blue `#0A66C2`).
- "Previously" card restructured: three-line geographic arc (`Tech Project Manager : 8 years` / `USA → France → Brasil → to...` / `back home : Manizales`), label upsized + LinkedIn-blue for legibility against the kraft border.

**Hero chapter strip (commits `bed7795`, `5c56f32`)**

- Strip labels: `text-meta` (9px, ink-3) → `text-small` (12px, ink + semibold). Active state now signaled only by accent-2 underline; hover flips label colour for affordance.
- "01 CASA" → "01 THE PRODUCER" (matches Story h2).
- "05 BENEFICIO" anchor → real `/beneficio` route.
- Whole "Start the tour" row (play disc + label + meta) is now one `<button>` — previously only the disc was clickable.

**Section pacing — DESIGN_ITER_3 (commits `3317bd4`, `7394f76`, `1a6da75`, `61909a8`, `d75ee34`)**

- New `<SectionBreak variant="blue|cream|blue-gradient" />` component, 12px tall, used as a punctuation mark between sections. Final placement (after producer A/B): cream after Farm, cream Villa Paula → Bambu Stream, cream Bambu Stream → Terra Preta.
- `ChapterScrolly` re-engineered for genuine responsiveness:
  - `min-height: 250vh` → content-driven, with `padding-block: clamp(64px, 10vh, 160px)`
  - `position: sticky` removed from both columns (was a no-op once parent had no scroll runway)
  - Right column is now `aspect-[4/3]` mobile / `md:h-full md:min-h-[520px]` desktop, hugging the editorial column via `items-stretch`
- Result: identical proportional rhythm phone → tablet → laptop → 4K. Trade-off accepted: progress bar + scrubber no longer animate (no scroll runway), so they're decorative.

**Nav legibility (commit `74b9a79`)**

- Wordmark `Bellavista.` → `Bellavista Coffee`.
- Once past hero sentinel, bar locks to fixed dark-navy `rgba(27,36,55,0.95)` with cream text instead of inheriting each section's theme. Previously the nav vanished on cream sections (Story / Coffee / Journal). Stays transparent over the kraft hero to preserve cinematic.

**New `/beneficio` route — soft paywall (commits `74b9a79`, `5c56f32`)**

- App Router page at `app/beneficio/page.tsx`, `noindex/nofollow`.
- Reuses the site's design system: `theme-cream` surface, Story's chapter-marker pattern (col-1 mono "Chapter" + 64px serif "05"), accent-2 italic emphasis on the headline ("The full *record*."), the same italic-serif pull-quote treatment, two right-column cards mirroring Story's Previously layout (`What you get` / `Trade access`), responsive `clamp(96px,14vh,200px)` padding, `<Footer />` at the bottom.
- Designed to serve both the BENEFICIO chapter slot and any future private-journal paywall hits — the "What you get" list explicitly covers journal entries, beneficio process logs, roasting samples, weekly cup scores, season retrospectives.
- `SUBSTACK_URL` placeholder pending the real handle.

---

## What went well

- **Doing the rename atomically.** The `la-vega → villa-paula` family change touched four call-sites + three media filenames — wiring them in a single commit (`8abb32a`) avoided the half-renamed-state where some chapters scroll-jumped to dead anchors.
- **Production.md as the source of truth held up well.** Every component change had a draft sitting next to it explaining the *why* — turning each wiring step into a near-mechanical edit. The `*-stream` etc. notes around char-budget overflows and voice deviations meant zero second-guessing about producer intent.
- **A/B ing the SectionBreak in-place.** Two stripe variants on the same page let the producer compare blue/cream/blue-gradient in one scroll pass and pick a winner without me building a settings UI for it. Three commits (one to add, one to flip variant, one to halve height) — that's the right cadence for design ping-pong.
- **Recommending option C (clamp padding) for responsiveness.** The user originally asked for a smaller `min-height: Nvh`. Pushing back to "viewport units are fundamentally fragile for content-driven sections" landed a better outcome. The clamp-padding pattern is now the standard the rest of the sections (`Story`, `Farm`, `Coffee`, `Stay`, `Journal`) should migrate to next.

---

## What broke or surprised us

| Issue | Root cause | Resolution |
|---|---|---|
| TypeScript broke after writing new `Chapters.tsx` | JSDoc `chapter-*/production.md` — the `*/` closed the comment early | Replaced with `chapter-{slug}/` |
| Dev server served `404` on every CSS/JS chunk after a session that ran `npm run build` | Build output overwrote `.next/`, dev server was still pointing at it | Killed dev, `rm -rf .next`, restarted. Documented the gotcha in the commit message |
| `public/media/hero.mp4` arrived at **929 MB** (4K HEVC, 90 Mbps, 80 s) | Drone footage uploaded raw | Re-encoded to 1080p H.264 / CRF 23 / faststart. Original preserved at `~/Downloads/AI/bv-landing-originals/` outside the repo |
| Stay caption "Guest suite" violates the section's voice rule (the system prompt explicitly bans "suite") | Producer kept it in v2 dictation; preserved per draft | Flagged in the wiring commit + production.md notes; deferred to next-pass content revision |
| Farm `Varietals = 3` vs Coffee B2B chip row (4 chips including `colombia`) | Cascade not applied between drafts | Held as-written per producer's "first draft, refine in next pass" instruction |

---

## Decisions made or revised

| Decision | ADR | Notes |
|---|---|---|
| ChapterScrolly is content-driven, not viewport-driven | (informal — supersedes the 250vh constraint in CLAUDE.md) | clamp-padding pattern, no sticky, no min-height in vh. The 250vh-sticky risk in CLAUDE.md is now moot for this component |
| `/beneficio` doubles as private-journal paywall | — | One page handles both BENEFICIO chapter clicks and any future "this entry is private" redirects |
| SectionBreak variant final = cream | — | Blue and blue-gradient kept in the component for future use but not deployed |
| Nav uses fixed dark-navy fill once past hero, not theme-driven tokens | — | Theme-driven tokens looked great per-section but rendered the nav invisible on cream surfaces; consistency wins over palette purity here |

---

## Risks updated

| Risk | Status | Notes |
|---|---|---|
| iOS Safari sticky-in-flex bugs (B6) | ✅ N/A for plot scrollies | Sticky removed. The risk only resurfaces if we re-introduce sticky elsewhere |
| Cascade inconsistencies in content drafts (Varietals, Stay caption) | 🟡 Open | Tracked for next-pass content revision. Not a code risk, a copy risk |
| `SUBSTACK_URL` placeholder | 🟡 Open | Hardcoded `bellavistacoffee.substack.com` in `app/beneficio/page.tsx:27`. Replace once real handle exists |
| Hero video size constraint | ✅ Mitigated | Re-encode pipeline documented; ffmpeg one-liner in `_filename-map.md` workflow + this retro |

---

## Next checkpoint readiness

Gate criteria for **DESIGN_ITER_4** (consistent clamp padding across non-scrolly sections) — optional but recommended next:

- [x] ChapterScrolly responsive pattern proven
- [x] SectionBreak component in place
- [ ] Apply `padding-block: clamp(...)` to Story, Farm, Coffee, Stay, Journal (currently fixed `py-24`)
- [ ] Visual QA at 4K + iPad portrait + iPhone breakpoints

Gate criteria for **V1_VALIDATE**:

- [x] All sections render real production-copy v1
- [x] All anchor links resolve (Hero strip, FarmMap pins, Coffee CTAs)
- [x] Hero portrait loads from real asset, not gradient
- [ ] Real `bellavistacoffee.substack.com` handle wired in `/beneficio`
- [ ] Plot scrolly videos in `public/media/` (`villa-paula.mp4`, `bambu-stream.mp4`, `terra-preta.mp4`) — currently only hero is in
- [ ] Lighthouse + iOS Safari + iPad Safari test

**Blocked on:** real Substack handle (one-line edit), three plot videos.

---

## One-line summary (for PLAN.md status block)

> CONTENT_WIRING_v1 + DESIGN_ITER_3 + private-Substack paywall page: all ten production drafts wired into live components, plot anchors atomically renamed (villa-paula / bambu-stream / terra-preta), Farm gained stats-caption + milestone-objective variants, Story portrait wired with LinkedIn-linked figcaption, ChapterScrolly re-engineered content-driven for true responsiveness, Nav locked to dark-navy past hero so it stays legible on cream sections, new `/beneficio` route serves both chapter-05 and any future private-journal paywall hits.
