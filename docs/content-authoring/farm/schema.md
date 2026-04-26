---
section: farm
component: components/sections/Farm.tsx
component_lines: 14-114
synced: false
companion_component: components/sections/FarmMap.tsx
---

# Farm — Content Schema

Chapter 02 — *The farm, and how it got here.* Header + (FarmMap + 2×3 stats grid) + 6-column milestones row. This section sets the data context for the three plot scrollies that follow.

## Component anchor

- **File:** `components/sections/Farm.tsx`
- **Lines:** 14–114
- **Section id:** `#farm`
- **Companion (visual only, no editable copy):** `components/sections/FarmMap.tsx`

## Copy slots

### Header

| Slot key | Type | Constraints | Currently |
|---|---|---|---|
| `chapter_number` | string | `02` | `02` |
| `headline_lead` | string | ≤8 words · plain · ends with comma | `The farm,` |
| `headline_emphasis` | string | ≤8 words · italic accent-2 | `and how it got here.` |

### Stats grid (6 entries, layout-locked)

The component renders these in this order; `Process` spans 2 columns. Keep label *short* (≤10 chars uppercase) — values use Instrument Serif italic at 22px so longer strings break the grid.

| Slot key | Label constraint | Value constraint | Currently |
|---|---|---|---|
| `stat_altitude` | mono uppercase | unit suffix · short | label `Altitude`, value `1,300 m` |
| `stat_area` | mono uppercase | unit suffix · short | label `Area`, value `4.2 ha` |
| `stat_plots` | mono uppercase | integer | label `Plots`, value `3` |
| `stat_varietals` | mono uppercase | integer | label `Varietals`, value `3` |
| `stat_process` | mono uppercase, **spans 2 cols** | comma/dot-separated list | label `Process`, value `Washed · Anaerobic · Carbonic` |
| `stat_planted` | mono uppercase | year | label `Planted`, value `2021` |

### Milestones row (6 entries, fixed structure)

| n | year | title (current) | accent? |
|---|---|---|---|
| 1 | 2018 | First visit | no |
| 2 | 2020 | Quit tech | no |
| 3 | 2021 | Seedlings | **yes** (accent top border) |
| 4 | 2023 | Beneficio | no |
| 5 | 2024 | First export · 88+ SCA | **yes** |
| 6 | 2025 | Stay opens | no |

Constraints per milestone:
- `year` — 4-char string, italic serif at 22px
- `title` — ≤24 chars, sans-serif at 11px. Use `·` not `,` for sub-points (kerns better at small size).
- `accent: true` reserves the highlight for *narrative pivots* (planting, first export). Use sparingly — at most 2 accents in any 6-milestone list.

### Section labels

| Slot key | Constraint | Currently |
|---|---|---|
| `milestones_label` | mono uppercase · ≤14 chars | `Milestones` |
| `chapter_word_label` | mono uppercase · 7 chars | `Chapter` |

## Voice constraints

- Statistics speak for themselves; the surrounding copy adds context, never embellishment.
- Milestone titles read like log entries: short, declarative, no marketing verbs (no "launched", no "achieved").
- `headline_emphasis` is the warm half — it can be slightly conversational ("and how it got here") while the lead stays neutral.

## Out of scope

- The schematic FarmMap (SVG only — visual, no copy slots).
- Plot pin labels on the map (those live in `FarmMap.tsx`'s PLOTS array). They WILL change in the upcoming wiring pass when the chapter rename lands: `LA VEGA → VILLA PAULA`, `EL BOSQUE → BAMBU STREAM`, `LA CUMBRE → TERRA PRETA`. The wiring agent handles this in lockstep with the chapter sections; nothing for the content-drafter to do here.
