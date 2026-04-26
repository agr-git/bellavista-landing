---
section: footer
component: components/Footer.tsx
component_lines: 23-119
synced: false
---

# Footer — Content Schema

Contact slab + subscribe form + admin link + bottom legal/tagline strip. Lives at `id="contact"` so the nav's "Contact" link scrolls here.

## Component anchor

- **File:** `components/Footer.tsx`
- **Lines:** 23–119
- **Section id:** `#contact`

## Copy slots

### Left block — contact

| Slot key | Type | Constraints | Currently |
|---|---|---|---|
| `contact_label` | string | mono uppercase · ≤10 chars | `Contact` |
| `contact_headline` | string | italic serif h3 · ≤80 chars · 1 line at desktop | `Come visit. Or stay in touch.` |
| `contact_lines` | string | ≤120 chars · ` · `-separated email + handle | `hello@bellavistacoffee.co · @bellavista.coffee` |

### Right block — subscribe

| Slot key | Type | Constraints | Currently |
|---|---|---|---|
| `subscribe_placeholder` | string | input placeholder · ≤32 chars | `you@roastery.com` |
| `subscribe_button_idle` | string | ≤14 chars · mono uppercase · button label | `Subscribe` |
| `subscribe_button_sending` | string | ≤14 chars · `…` ellipsis · loading state | `Sending…` |
| `subscribe_success` | string | ≤72 chars · mono uppercase | `Thanks — we'll be in touch.` |
| `admin_link_label` | string | ≤10 chars · mono uppercase · ends `→` | `Admin →` |

### Bottom strip

| Slot key | Type | Constraints | Currently |
|---|---|---|---|
| `copyright_text` | string | ≤80 chars · format: `© <year> Bellavista Coffee · <city>, <country>` (the year is `new Date().getFullYear()` — leave the literal `<year>` placeholder when handing back to the wiring agent) | `© <year> Bellavista Coffee · Manizales, Colombia` |
| `bottom_tagline` | string | ≤120 chars · mono uppercase · 1-line restatement of the site thesis | `Documented in drone footage, field notes, and every batch we ship.` |

## Voice constraints

- The footer is the closing handshake. `contact_headline` (italic serif) is the most "human" line on the page — it should feel direct and personal, but not cute.
- Subscribe copy never assumes commercial intent. The producer doesn't know yet who's signing up. *Thanks — we'll be in touch.* > *Welcome to the Bellavista family!*
- The bottom tagline echoes the hero `intro_paragraph` thesis. Don't paraphrase it accidentally — make sure the two are deliberately different sentences saying the same thing.

## Out of scope

- Subscribe form wiring (uses `submitLead("subscribe", …)` from `lib/submit-lead.ts`).
- Admin route (gated by NextAuth in B10, currently parked).
- Year value (computed at render time).
