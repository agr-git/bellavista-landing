---
section: chapter-terra-preta
component: components/sections/Chapters.tsx
component_lines: 77-105
shape_component: components/sections/ChapterScrolly.tsx
synced: false
---

# Chapter TERRA PRETA — Content Schema

Chapter 04 — the highest plot. Steep, cold at night, slow. The *lab* of the farm.

> ⚠️ **Rename in flight.** The live component still uses the old anchor `#la-cumbre` and label `LA CUMBRE`. The wiring agent will rename `id`, `plot`, the Hero `CHAPTERS` entry, and the FarmMap pin label when production copy lands.
>
> ℹ️ **Naming significance.** "Terra Preta" is a famous Amazonian-soil reference — anthropogenic dark earth, biochar, soil fertility built by humans. That's a different framing than "La Cumbre" (the summit). The previous draft is altitude/exposure focused; the new name invites a soil-and-stewardship angle. If the producer is actually amending soils with biochar / compost here, that should anchor the section.

## Component anchor

- **File:** `components/sections/Chapters.tsx`
- **Lines:** 77–105 (the third `<ChapterScrolly … />` instance)
- **Underlying shape:** `components/sections/ChapterScrolly.tsx`
- **Section id (target):** `#terra-preta` (currently `#la-cumbre`)
- **Cross-references:**
  - `components/sections/Hero.tsx` — `CHAPTERS` array → label `TERRA PRETA`, href `#terra-preta`
  - `components/sections/FarmMap.tsx` — `PLOTS[2].label` → `TERRA PRETA`, `href` → `#terra-preta`

## Copy slots

### Top labels

| Slot key | Type | Currently |
|---|---|---|
| `chapter_number` | `04` | `04` |
| `plot` | uppercase · ≤14 chars · matches FarmMap | `TERRA PRETA` |
| `page_label` | `<chapter> / 05` | `04 / 05` |

### Headline

| Slot key | Type | Constraints | Currently (placeholder, awaiting Terra-Preta-specific draft) |
|---|---|---|---|
| `headline_lead` | string | ≤24 chars · plain · ends with `,` | `Gesha at the top,` |
| `headline_emphasis` | string | ≤24 chars · italic accent-2 · ends with `.` | `with the wind.` |

### Body (3–5 short paragraphs)

Current copy (inherited from LA CUMBRE — needs Terra-Preta-specific rewrite, ideally leaning into the soil-experiment framing if real):

1. *The highest plot — steep, cold at night, and slow. Coffee loves slow.*
2. *A small Gesha block went in the ground in 2022. It's still finding its voice in the cup, but the structure is already telling.*
3. *We experiment here: anaerobic, carbonic, honey. Lab more than field.*
4. *Most of what we learn on this ridge ends up shaping how we treat the two lower plots.*

### Stats (exactly 3)

| Slot | Label | Value (current) |
|---|---|---|
| `stat_1` | `Alt` | `1,560 m` |
| `stat_2` | `Area` | `1.3 ha` |
| `stat_3` | `Year` | `2022` |

### Video pins (2)

Currently:
- Pin 1 @ (34%, 44%) — *Gesha block*
- Pin 2 @ (70%, 30%) — *exposed edge*

Consider revising for the soil-experiment framing — e.g. *biochar plot*, *compost beds* — if those are part of why this plot got the Terra Preta name.

## Voice constraints

- Reflective, sparser than the other two plots. Altitude + soil experimentation + isolation set the mood.
- Don't oversell the cup. *Still finding its voice* — forward-looking story.
- Process names are technical terms. Don't gloss them — *anaerobic, carbonic, honey, biochar, compost*.
- Punchy short sentences (*Coffee loves slow.* / *Lab more than field.*) work well — use 1–2 per draft.
- **If soil work is real**, make the *terra preta* reference earn its place — one sentence acknowledging the soil-stewardship angle. If purely aspirational, treat it like any other plot name and don't force the reference.

## Plot differentiation

| Plot | Character | Cup |
|---|---|---|
| Villa Paula | workhorse · flat · sun-exposed · Caturra | chocolate, brown sugar, clean |
| Bambu Stream | jewel · shaded · mid-altitude · Pink Bourbon | jasmine, bergamot, cane sugar |
| **Terra Preta** | **lab · steep · cold · Gesha** | **still finding its voice** |

## Out of scope

- `/media/terra-preta.mp4` (current code references `/media/la-cumbre.mp4`).
- FarmMap positioning.
