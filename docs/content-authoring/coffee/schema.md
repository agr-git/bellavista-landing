---
section: coffee
component: components/sections/Coffee.tsx
component_lines: 23-179
synced: false
---

# Coffee — Content Schema

*What we grow.* Two product lanes side by side (B2B green coffee · Direct roasted), each with its own CTA into a form modal. Followed by a pull-quote slab.

## Component anchor

- **File:** `components/sections/Coffee.tsx`
- **Lines:** 23–179
- **Section id:** `#coffee`

## Copy slots

### Header

| Slot key | Type | Constraints | Currently |
|---|---|---|---|
| `headline_lead` | string | ≤16 chars · plain | `What we` |
| `headline_emphasis` | string | ≤8 chars · italic accent-2 · ends with `.` | `grow.` |

### B2B lane (left card)

| Slot key | Type | Constraints | Currently |
|---|---|---|---|
| `b2b_tag` | string | ≤6 chars · mono uppercase · accent-bordered pill | `B2B` |
| `b2b_pagination` | string | format: `01 / 02` | `01 / 02` |
| `b2b_h3` | string | ≤24 chars · serif h3 | `Green coffee` |
| `b2b_subhead` | string | ≤72 chars · sans-serif body | `for roasters · full lot specs + samples` |
| `b2b_chips` | string[3] | ≤14 chars each · mono uppercase | `caturra · pink bourbon · geisha` |
| `b2b_disclaimer` | string | ≤56 chars · mono uppercase · sets expectations vs e-commerce | `Lead-gen inquiry form · no cart yet` |
| `b2b_cta` | string | ≤22 chars · mono uppercase · ends `↗` | `Request samples ↗` |

### Direct lane (right card)

| Slot key | Type | Constraints | Currently |
|---|---|---|---|
| `direct_tag` | string | ≤6 chars | `Direct` |
| `direct_pagination` | string | format: `02 / 02` | `02 / 02` |
| `direct_h3` | string | ≤24 chars | `Roasted coffee` |
| `direct_subhead` | string | ≤72 chars | `for drinkers · small drops, ships from farm` |
| `direct_chips` | string[3] | ≤14 chars each · uppercase | `caturra · pink bourbon · geisha` |
| `direct_disclaimer` | string | ≤56 chars | `Join the drop list · small batches` |
| `direct_cta` | string | ≤22 chars · ends `↗` | `Join the waitlist ↗` |

### Pull quote slab

| Slot key | Type | Constraints | Currently |
|---|---|---|---|
| `quote_lead` | string | ≤80 chars · plain | `"We treat every lot like a deploy.` |
| `quote_emphasis` | string | ≤80 chars · italic accent-2 · ends `."` | `Versioned, logged, and reviewable."` |
| `quote_attribution` | string | ≤32 chars · mono uppercase · `— ` prefix | `— The producer` |

## Voice constraints

- The two lanes serve different audiences but should *feel like one product*. Symmetric structure (tag, pagination, subhead, chips) is intentional.
- Disclaimers ("no cart yet", "small batches") are honest about the v1 limits. Keep them — they earn trust.
- The pull quote is the hero one-liner of the section. The current "every lot like a deploy" is the founder voice; keep that engineering register.
- B2B copy reads like a roaster talking to roasters. Direct copy reads like a producer talking to drinkers. Different posture, same project.

## Out of scope

- The form fields inside the modals (live in `components/forms/RequestSamplesForm.tsx` and `WaitlistForm.tsx`).
- The 100×100 gradient placeholder image — design only, no copy.
