---
section: journal-meta
component: components/sections/Journal.tsx
component_lines: 27-147
synced: false
---

# Journal Meta — Content Schema

The *header* and *chrome* of the Journal section on the landing page — NOT the journal entries themselves.

> The actual journal posts live in `/content/journal/*.md` and are validated by `lib/journal-schema.ts`. They have their own frontmatter (`title`, `date`, `kind`, `excerpt`, `visibility`). Authoring entries is out of scope for this folder.

## Component anchor

- **File:** `components/sections/Journal.tsx`
- **Lines:** 27–147
- **Section id:** `#journal`

## Copy slots

### Header

| Slot key | Type | Constraints | Currently |
|---|---|---|---|
| `headline_lead` | string | ≤16 chars · plain | `From the` |
| `headline_emphasis` | string | ≤16 chars · italic accent-2 · ends `.` | `field.` |
| `subhead` | string | ≤180 chars · 1–2 sentences · explains public-vs-private dual visibility | `Public posts showcase projects. Private entries track experiments — producer only.` |

### Filter chips (3, fixed structure, visual-only filter in v1)

| Slot key | Constraint | Currently |
|---|---|---|
| `chip_all` | ≤10 chars · mono uppercase | `All` |
| `chip_projects` | ≤14 chars · matches a `kind` value in `lib/journal-schema.ts` | `Projects` |
| `chip_experiments` | ≤14 chars · matches a `kind` value | `Experiments` |

> ⚠️ `chip_projects` and `chip_experiments` map to the `kind` enum in `lib/journal-schema.ts`. Renaming them requires updating the schema and any existing entry frontmatter.

### Empty state

| Slot key | Constraint | Currently |
|---|---|---|
| `empty_state_text` | ≤32 chars · mono uppercase | `No entries yet.` |

### Featured card label

| Slot key | Constraint | Currently |
|---|---|---|
| `featured_prefix` | format: `Featured · <kind>` (the `<kind>` is data-driven, only the literal `Featured` is editable) | `Featured` |

## Voice constraints

- The journal positions Bellavista as a build-in-public project. The subhead must communicate the public-vs-private model in plain English in one breath.
- Chip labels should mirror the kinds the producer actually files journal entries under. Two clear buckets is better than five vague ones.
- Empty state shouldn't apologize. *No entries yet.* > *We haven't published anything yet — check back soon!*

## Out of scope

- All journal entries themselves (`/content/journal/*.md`).
- Slug page layout (`app/journal/[slug]/page.tsx`).
- The `kind` enum (TS schema, not editable as content).
