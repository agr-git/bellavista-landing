---
section: hero
component: components/sections/Hero.tsx
component_lines: 67-179
synced: false
---

# Hero — Content Schema

Full-bleed cinematic hero, 100vh. Drone-video background (with gradient fallback), big editorial headline, primary CTA, chapter strip across the bottom.

## Component anchor

- **File:** `components/sections/Hero.tsx`
- **Lines:** 67–179 (everything inside the `<section id="hero">` block)
- **Section id:** `#hero`

## Copy slots

| Slot key | Type | Constraints | Currently |
|---|---|---|---|
| `meta_label` | string | ≤45 chars · mono uppercase · location/elevation tag · `·` separators | `Manizales · Colombia · 1,300 MASL` |
| `headline_line1` | string | ≤24 chars · plain (non-italic) | `From lines of code` |
| `headline_line2_lead` | string | ≤16 chars · italic + accent-2 color | `to lines of` |
| `headline_line2_tail` | string | ≤16 chars · plain (non-italic) · ends with `.` | `coffee trees.` |
| `intro_paragraph` | string | 1 sentence · ≤220 chars · sets the documentary frame | `A small production project in the hills of Manizales — documented in drone footage, field notes, and every batch of coffee we ship.` |
| `cta_label` | string | ≤22 chars · italic serif | `Start the tour` |
| `cta_meta` | string | ≤24 chars · mono uppercase · format: `<n> chapters · <mm:ss>` | `5 chapters · 08:42` |
| `chapter_strip_prefix` | string | ≤22 chars · mono uppercase · scroll hint | `↓ Scroll to explore` |

## Chapter strip (5 entries, fixed structure)

The 5 chapter-strip items are tied to section anchors. The number + href are wired in code; only the **label** is editable copy.

| n | label (target) | href (target) | currently in component |
|---|---|---|---|
| `01` | `CASA` | `#story` | `CASA` / `#story` |
| `02` | `VILLA PAULA` | `#villa-paula` | `LA VEGA` / `#la-vega` |
| `03` | `BAMBU STREAM` | `#bambu-stream` | `EL BOSQUE` / `#el-bosque` |
| `04` | `TERRA PRETA` | `#terra-preta` | `LA CUMBRE` / `#la-cumbre` |
| `05` | `BENEFICIO` | `#beneficio` | `BENEFICIO` / `#beneficio` |

> ⚠️ The plot rename (Villa Paula / Bambu Stream / Terra Preta) is pending — the wiring agent will update the `CHAPTERS` array in `Hero.tsx` together with the matching anchors in `Chapters.tsx` and `FarmMap.tsx` when the first chapter's production copy lands.

Constraint: each label ≤14 chars, mono uppercase, no diacritics in display.

## Voice constraints

- The hero is the *thesis* of the site. It earns the rest of the scroll. No clever wordplay that won't pay off downstream.
- Bellavista's brand voice: technical, dry, slightly self-deprecating. Coffee romanticism muted; software-engineering metaphors *welcomed* (the founder is ex-tech).
- The italic accent-2 phrase is the emotional pivot of the headline — it must contrast meaningfully with the lead.
- `intro_paragraph` is documentary, not promotional. Avoid words like "premium", "exquisite", "passion".

## Out of scope for this slot list

- Drone video file (`/media/hero.mp4`) — handled in deploy.
- Poster image (`/media/hero-poster.jpg`) — handled in deploy.
- The 72px CTA play-button visual — design token, not copy.
