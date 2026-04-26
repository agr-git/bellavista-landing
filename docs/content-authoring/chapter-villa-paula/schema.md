---
section: chapter-villa-paula
component: components/sections/Chapters.tsx
component_lines: 17-45
shape_component: components/sections/ChapterScrolly.tsx
synced: false
---

# Chapter VILLA PAULA — Content Schema

Chapter 02 (continuation) — the first of three plot scrollies. Sticky-pinned editorial column on the left, video on the right. The lowest, flattest, oldest plot — the workhorse of the farm.

> ⚠️ **Rename in flight.** The live component still uses the old anchor `#la-vega` and label `LA VEGA`. The wiring agent (Claude Code) will rename `id`, `plot`, the matching FarmMap pin label, and the Hero `CHAPTERS` entry when the first approved production copy lands.
>
> ℹ️ **Character description** (workhorse · flat · sun-exposed · Caturra) is inherited from the previous "LA VEGA" draft. The producer should confirm this still matches Villa Paula's identity, or supply an updated angle when drafting.

## Component anchor

- **File:** `components/sections/Chapters.tsx`
- **Lines:** 17–45 (the first `<ChapterScrolly … />` instance)
- **Underlying shape:** `components/sections/ChapterScrolly.tsx`
- **Section id (target):** `#villa-paula` (currently `#la-vega` — to be renamed during wiring)
- **Cross-references that also need renaming during wiring:**
  - `components/sections/Hero.tsx` — `CHAPTERS` array → label `VILLA PAULA`, href `#villa-paula`
  - `components/sections/FarmMap.tsx` — `PLOTS[0].label` → `VILLA PAULA`, `href` → `#villa-paula`

## Copy slots

### Top labels

| Slot key | Type | Constraints | Currently |
|---|---|---|---|
| `chapter_number` | string | `02` | `02` |
| `plot` | string | uppercase · ≤14 chars · matches FarmMap pin label | `VILLA PAULA` |
| `page_label` | string | format: `<chapter> / 05` | `02 / 05` |

### Headline

| Slot key | Type | Constraints | Currently (placeholder, awaiting Villa-Paula-specific draft) |
|---|---|---|---|
| `headline_lead` | string | ≤24 chars · plain · usually ends with `,` | `Caturra on the flat,` |
| `headline_emphasis` | string | ≤24 chars · italic accent-2 · ends with `.` | `where we started.` |

### Body (3–5 short paragraphs)

Currently 4 paragraphs (inherited from LA VEGA — needs Villa-Paula-specific rewrite):

1. *La Vega is the lowest and flattest of the three plots — the block that taught us pruning, fertilization, and how to lose a row to borers.*
2. *Two hectares of Caturra, planted 2021. Sun exposure is generous, which is both a gift and a problem on hot years.*
3. *Washed process; the cup leans chocolate and brown sugar with a clean finish. It's our B2B workhorse.*
4. *Yield here pays for the experiments elsewhere on the farm.*

Constraints: each paragraph ≤2 sentences, ≤180 chars. The 3-paragraph version is acceptable if 4 feels padded.

### Stats (exactly 3, layout-locked to 3-col grid)

| Slot key | Label (≤6 chars upper) | Value | Currently |
|---|---|---|---|
| `stat_1` | `Alt` | altitude · unit suffix | `1,300 m` |
| `stat_2` | `Area` | hectares · `ha` suffix | `2.0 ha` |
| `stat_3` | `Year` | 4-digit year | `2021` |

### Video pins (2)

- Pin 1 @ (30%, 40%) — *main Caturra block*
- Pin 2 @ (68%, 62%) — *compost station*

Constraint: labels ≤32 chars, lowercase, no period.

## Voice constraints

- Field-log register. First-person plural ("we") is fine; "I" is reserved for `story/`.
- Specifics over superlatives. *2.0 ha of Caturra* (good). *Significant Caturra plantings* (avoid).
- Don't reuse phrases from `chapter-bambu-stream` or `chapter-terra-preta` — each plot has its own character.
- Villa Paula inherits the *workhorse* character from LA VEGA: weathered, productive, unpretentious. **Confirm this still fits the renamed identity** before locking voice.
- The plot name has weight. If there's a story behind "Villa Paula" (a person, a building, farm history), one subtle line is enough.

## Out of scope

- Video file `/media/villa-paula.mp4` (current code references `/media/la-vega.mp4` — to be renamed during wiring).
- FarmMap positioning.
