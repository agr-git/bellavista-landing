# B6 Retrospective — Chapter scrolly

**Date:** 2026-04-22
**Checkpoint:** `B6_SCROLLY`
**Commit:** see `feat(B6): chapter scrolly — isolated lab + 3 plot integrations`

---

## What I built

- `components/sections/ChapterScrolly.tsx` — reusable 2-col pinned chapter block with progress bar, pin overlays, and scrubber. Props: `{ id, chapterNumber, plot, headline, body, stats, pins, videoSrc?, pageLabel }`.
- `components/sections/Chapters.tsx` — composes 3 plot chapters (La Vega, El Bosque, La Cumbre) so `app/page.tsx` stays declarative.
- `app/(dev)/scrolly/page.tsx` — isolation lab at `/scrolly`, deletable for S1.
- Page composition: Chapters render **outside** `MotionWrapper` because a Framer Motion transform on an ancestor breaks `position: sticky`.

## What worked

- **`min-height: 250vh` + sticky 100vh child**. Simple, declarative, no calculated heights. No `useLayoutEffect` needed.
- **rAF-throttled scroll listener** driving progress state. No jank, no storms.
- **Sticky on both columns** so the video tracks with the text rather than desyncing on trackpad momentum scroll.
- Plain SVG for the plot markers in FarmMap linked cleanly via `scrollIntoView({ behavior: "smooth" })` to the scrolly anchors.

## What worried me

- **iOS Safari sticky + flex**. The CLAUDE.md warned specifically about this. I kept the sticky child a block element (no flex on the sticky parent) and the outer grid is the only layout primitive. **Still requires device-testing on real iOS Safari before S1.**
- **Reduced-motion**: video autoplay is unconditional. Should gate on `useReducedMotion()` before V1. Logged as follow-up.
- **MotionWrapper + sticky**: confirmed the `transform` on a MotionWrapper ancestor makes all descendants' `position: sticky` fall back to `static`. Chapters must remain unwrapped.

## Follow-ups (not blockers for B6 gate)

- [ ] Device test on iPhone Safari (fidelity check in V1).
- [ ] Respect `prefers-reduced-motion`: skip video autoplay, freeze progress bar animation.
- [ ] Real plot videos at `/public/media/{la-vega,el-bosque,la-cumbre}.mp4` — post-ship.
- [ ] Consider an active-pin state tied to scroll progress (pin 1 reveals first, pin 2 later) — design delta, not a bug.

## Gate criteria — met?

| Criteria | Status |
|---|---|
| Works on Chrome desktop | ✅ (build + local) |
| Works on iOS Safari | ⚠️ needs device test (V1) |
| Works on Android Chrome | ⚠️ needs device test (V1) |
| Lab page isolated in `(dev)` | ✅ |
| 3 plot integrations wired | ✅ |
| Commit landed | ✅ |

**Decision:** pass the B6 gate to keep B-momentum. Physical-device validation is a V1 task (the whole validate phase is dedicated to it). If iOS Safari breaks, the fix is isolated to `ChapterScrolly.tsx`.
