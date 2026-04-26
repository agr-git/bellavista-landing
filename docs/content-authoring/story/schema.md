---
section: story
component: components/sections/Story.tsx
component_lines: 16-103
synced: false
---

# Story — Content Schema

Chapter 01 — *The producer.* Three-column editorial layout (chapter marker · long-form · portrait + previously card). The most "first-person" block on the site.

## Component anchor

- **File:** `components/sections/Story.tsx`
- **Lines:** 16–103
- **Section id:** `#story`

## Copy slots

| Slot key | Type | Constraints | Currently |
|---|---|---|---|
| `chapter_label` | string | exactly `Chapter` (locked unless we change all chapter labels) | `Chapter` |
| `chapter_number` | string | 2 chars, e.g. `01` | `01` |
| `headline_lead` | string | ≤6 words · plain | `The` |
| `headline_emphasis` | string | 1 word · italic + accent-2 | `producer` |
| `headline_tail` | string | usually `.` — kept as a slot in case we go to longer headline | `.` |
| `body_paragraphs` | string[3] | 3 paragraphs · 60–120 words each total · first one starts with the drop-cap letter | see below |
| `drop_cap` | single char | The first letter of `body_paragraphs[0]` — pulled out for visual styling. Currently `I`. Must match the first letter of the first paragraph. | `I` |
| `figure_caption` | string | italic serif · ≤80 chars · format: `Fig N. <description>` | `Fig 1. Among the first Caturra rows, 2021.` |
| `previously_label` | string | mono uppercase · short label | `Previously` |
| `previously_value` | string | italic serif · ≤60 chars · 1-line CV summary | `Software engineer, 12 years.` |

### Current `body_paragraphs` for reference

1. *I spent twelve years writing software before I started writing pick plans. The first Caturra row went in the ground in 2021, on a ridge above Manizales that I had only visited as a kid. The farm was small, the slope was mean, and the learning curve was the steepest thing on the property.*
2. *What kept me here wasn't romance — it was the feedback loop. Cherry ripens, you pick it, you process it, you cup it. The results are six months later and deeply honest. Nothing about coffee tolerates handwaving.*
3. *The site you're reading is the field log. Drone footage from the plots, notes from the beneficio, and every batch we ship — published in public and in private, depending on what's mine to share.*

## Voice constraints

- First-person. Past tense for the origin (2021 onward), present tense for the current state.
- No coffee-industry clichés (no "passion", no "from seed to cup", no "single-origin journey").
- A software-engineer-talking-to-other-builders register. Self-aware about the career switch but not making a big deal of it.
- The drop-cap paragraph must *start* with a clear, vivid sentence — it's typographically loud, so don't waste it on throat-clearing.
- The "Previously" card is the resume bullet, not a humblebrag. Keep it factual: role, years.

## Out of scope

- Portrait image (placeholder gradient until real photo ships).
- The big "01" numeral — design token (color/font/size are locked).
