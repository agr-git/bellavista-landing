# Media filename map

Files dropped here are served at `/media/<filename>` (Next.js public folder convention).

## Required for v1 land

### Hero (drone footage)
| File | Notes |
|---|---|
| `hero.mp4` | Full-bleed drone video, ≤30 MB, H.264, 1080p, autoplays muted |
| `hero-poster.jpg` | Still frame fallback while the video loads |

### Plot scrollies (one video per chapter)
⚠️ **Naming caveat:** the live components currently reference `/media/la-vega.mp4`, `/media/el-bosque.mp4`, `/media/la-cumbre.mp4` (old plot names). Drop your files with the **new** names below — the wiring agent will rename the component references in the same commit that lands the production copy.

| File | Plot |
|---|---|
| `villa-paula.mp4` | Chapter 02 — Castillo on the flat |
| `bambu-stream.mp4` | Chapter 03 — Pink Bourbon, east-facing slope |
| `terra-preta.mp4` | Chapter 04 — Cenicafé 1, soil-driven |

Each ≤20 MB, vertically composed if possible (the scrolly column is portrait-aspect).

### Story (Chapter 01 portrait)
| File | Notes |
|---|---|
| `portrait-producer.jpg` | Right column of Story section, 4:5 aspect, replaces the kraft-gradient placeholder |

### Stay (bento grid, 5 cells)
| File | Cell | Caption |
|---|---|---|
| `stay-1-porch.jpg` | 4×2 hero cell | "Porch, sunrise" |
| `stay-2-bedroom.jpg` | 2×1 cell | "Guest suite" *(voice flag — see Stay draft Notes)* |
| `stay-3-kitchen.jpg` | 2×1 cell | "Kitchen" |
| `stay-4-ridge.jpg` | 2×1 cell | "Ridge at first light" |
| `stay-5-tour.mp4` + `stay-5-tour-poster.jpg` | 2×1 video cell | "House tour · 1:32" |

## Not needed for v1
- **Coffee** — uses gradient placeholders intentionally in v1.
- **Farm** — `FarmMap.tsx` is SVG-only, no photo media.
- **Journal entries** — their cover images live in `/content/journal/<slug>/` per the MDX schema, not here.
- **Footer** — no media.

## Format suggestions
- **Video:** H.264 MP4, web-optimized (`-movflags faststart`), 1080p, ≤30 MB hero / ≤20 MB plot scrollies.
- **Photo:** JPG, 1600px on the long edge, 80 quality. WebP is fine if you want smaller files — Next.js will serve them.
- **Poster frames:** same dimensions as the video, JPG 70 quality.

## Workflow
1. Drop files here.
2. When all four scrolly videos are in (hero + 3 plots), say *"wire the media"* in a Claude Code session — wiring agent will (a) confirm filenames, (b) rename the old `la-vega/el-bosque/la-cumbre` references to the new plot anchors, (c) flip `synced: true` on each section's `production.md`.
3. Run `npm run dev` to see the real thing.
