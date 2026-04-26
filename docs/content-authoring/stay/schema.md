---
section: stay
component: components/sections/Stay.tsx
component_lines: 31-153
synced: false
---

# Stay — Content Schema

Chapter 05 — *Sleep at Bellavista.* Bento grid of farmstay imagery + price/availability card + week/weekend toggle that drives the inquiry form preset.

## Component anchor

- **File:** `components/sections/Stay.tsx`
- **Lines:** 31–153
- **Section id:** `#stay`

## Copy slots

### Header

| Slot key | Type | Constraints | Currently |
|---|---|---|---|
| `headline_lead` | string | ≤8 chars · plain | `Sleep at` |
| `headline_emphasis` | string | ≤16 chars · italic accent-2 · ends `.` | `Bellavista.` |
| `toggle_a` | string | ≤8 chars · mono uppercase · matches `StayPreset` enum value | `week` |
| `toggle_b` | string | ≤8 chars · mono uppercase · matches `StayPreset` enum value | `weekend` |

> ⚠️ `toggle_a`/`toggle_b` are bound to TS enum `StayPreset`. Don't change them without coordinating with the form component.

### Bento cells (5 image cells, layout-locked)

Each cell is a gradient placeholder with one corner caption (mono uppercase). The captions are the only editable copy — the gradient palettes are design tokens.

| Slot key | Constraint | Currently |
|---|---|---|
| `cell_1_caption` | ≤22 chars uppercase · 4×2 hero cell | `Porch, sunrise` |
| `cell_2_caption` | ≤22 chars · 2×1 cell | `Guest bedroom` |
| `cell_3_caption` | ≤22 chars · 2×1 cell | `Kitchen garden` |
| `cell_4_caption` | ≤22 chars · 2×1 cell | `Sunrise ridge` |
| `cell_5_caption` | ≤22 chars · 2×1 cell · video tag — format `<title> · <m:ss>` | `House tour · 1:32` |

### Price card (last cell)

| Slot key | Type | Constraints | Currently |
|---|---|---|---|
| `price_label` | string | ≤8 chars · mono uppercase | `From` |
| `price_value` | string | ≤14 chars · italic serif accent-2 · format `$<amount> / <unit>` | `$ / night` |
| `price_inclusions` | string | ≤72 chars · sans · 1 sentence | `All meals + farm tour included.` |
| `price_cta` | string | ≤22 chars · uppercase · ends `↗` | `Check dates ↗` |

> 🔒 `price_value` is **deliberately empty** in current code (`$ / night`) — the producer may want to keep it that way until exact pricing is locked. If you fill it, double-check it lines up with what the inquiry response says.

## Voice constraints

- The Stay section is the warmest block on the site (warm gradients, intimate captions). Voice can soften slightly — but no resort-brochure language.
- Captions are *pictorial*: they describe the photo, not market it. *Porch, sunrise* (good). *Tranquil porch with breathtaking sunrise* (avoid).
- The price card's value can stay placeholder until the producer confirms a number. Don't invent prices.

## Out of scope

- Inquiry form fields (`components/forms/StayInquiryForm.tsx`).
- Real photography (placeholder gradients only in v1).
