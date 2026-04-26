---
section: chapter-bambu-stream
component: components/sections/Chapters.tsx
component_lines: 47-75
shape_component: components/sections/ChapterScrolly.tsx
synced: false
---

# Chapter BAMBU STREAM — Content Schema

Chapter 03 — the middle plot scrolly. Same sticky-pinned layout. The *jewel* of the farm: Pink Bourbon under shade.

> ⚠️ **Rename in flight.** The live component still uses the old anchor `#el-bosque` and label `EL BOSQUE`. The wiring agent will rename `id`, `plot`, the Hero `CHAPTERS` entry, and the FarmMap pin label when production copy lands.
>
> ℹ️ **Naming shift.** "Bambu Stream" suggests *bamboo* and *stream/water* — different from the previous "El Bosque" framing of *guamo shade*. Confirm with the producer whether the agroforestry context is now bamboo, still guamo, or both, and whether a stream is part of the section's identity.

## Component anchor

- **File:** `components/sections/Chapters.tsx`
- **Lines:** 47–75 (the second `<ChapterScrolly … />` instance)
- **Underlying shape:** `components/sections/ChapterScrolly.tsx`
- **Section id (target):** `#bambu-stream` (currently `#el-bosque`)
- **Cross-references:**
  - `components/sections/Hero.tsx` — `CHAPTERS` array → label `BAMBU STREAM`, href `#bambu-stream`
  - `components/sections/FarmMap.tsx` — `PLOTS[1].label` → `BAMBU STREAM`, `href` → `#bambu-stream`

## Copy slots

### Top labels

| Slot key | Type | Currently |
|---|---|---|
| `chapter_number` | `03` | `03` |
| `plot` | uppercase · ≤14 chars · matches FarmMap | `BAMBU STREAM` |
| `page_label` | `<chapter> / 05` | `03 / 05` |

### Headline

| Slot key | Type | Constraints | Currently (placeholder, awaiting Bambu-Stream-specific draft) |
|---|---|---|---|
| `headline_lead` | string | ≤24 chars · plain · ends with `,` | `Pink Bourbon,` |
| `headline_emphasis` | string | ≤24 chars · italic accent-2 · ends with `.` | `under guamo shade.` |

### Body (3–5 short paragraphs)

Current copy (inherited from EL BOSQUE — needs Bambu-Stream-specific rewrite):

1. *The middle plot sits on a north-facing slope where morning fog holds until nine and the guamos keep the canopy honest.*
2. *We planted Pink Bourbon here in 2021. Small lot, uneven slope, the kind of row that forces a pick plan instead of a timetable.*
3. *The cup shows it — jasmine on the nose, a thin line of bergamot, cane sugar underneath.*
4. *Processed washed in the beneficio downstream. This block is the backbone of the export selection.*

### Stats (exactly 3)

| Slot | Label | Value (current) |
|---|---|---|
| `stat_1` | `Alt` | `1,420 m` |
| `stat_2` | `Area` | `0.9 ha` |
| `stat_3` | `Year` | `2021` |

### Video pins (2)

Currently (labels likely need revision for the new framing):
- Pin 1 @ (26%, 34%) — *seedling row*
- Pin 2 @ (62%, 58%) — *guamo shade*

If the agroforestry context is now bamboo, consider relabeling pin 2 to *bamboo shade* / *bambu canopy*. If a stream is part of the plot, that may merit a third pin (visually fine, layout supports it).

## Voice constraints

- Slightly more lyrical than Villa Paula, but earned. This plot has the cup; the language can show.
- Concrete cup notes only. *Jasmine on the nose, a thin line of bergamot* (good). *Floral and complex* (avoid).
- The agroforestry/water context (bamboo, stream, fog, slope) appears once. Don't belabor.
- Field-log register, "we" not "I".
- The plot name should feel inevitable. If you can't write the plot honestly without naming the bamboo or the stream once, name it. If it feels forced, drop it.

## Plot differentiation

| Plot | Character | Cup |
|---|---|---|
| Villa Paula | workhorse · flat · sun-exposed · Caturra | chocolate, brown sugar, clean |
| **Bambu Stream** | **jewel · shaded · mid-altitude · Pink Bourbon** | **jasmine, bergamot, cane sugar** |
| Terra Preta | lab · steep · cold · Gesha | still finding its voice |

## Out of scope

- `/media/bambu-stream.mp4` (current code references `/media/el-bosque.mp4`).
- FarmMap positioning.
