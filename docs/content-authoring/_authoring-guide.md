# Authoring Guide

The full workflow for drafting Bellavista landing copy with an LLM and shipping it into the React components without surprises.

## Roles

There are three roles in this workflow. They can be the same person, but the steps are distinct.

| Role | Who | What they do |
|---|---|---|
| **Producer** | Alejo | Owns the voice, approves drafts, supplies real-world context |
| **Drafting LLM** | Gemini / Claude / GPT / local model | Reads schema + system-prompt, asks the producer questions, drafts copy into `draft.md` and updates `preview.html` |
| **Wiring agent** | Claude Code (CLI in this repo) | Reads `production.md` (status `synced: false`), edits the component, marks `synced: true` |

Cheap drafting goes to the cheaper LLM. The wiring agent — which has to touch JSX safely — stays as Claude Code in this repo.

## File contract per section

Every section folder contains:

| File | Tracked? | Purpose |
|---|---|---|
| `schema.md` | ✅ | Copy slots, constraints, component anchor (file path + approx line range) |
| `system-prompt.md` | ✅ | The instruction set the drafting LLM gets at the start of a session |
| `draft.md` | ❌ | Work in progress. Multiple iterations OK. Frontmatter `status: draft` |
| `production.md` | ❌ | Approved copy. Frontmatter `status: production`, `synced: false → true` |
| `preview.html` | ❌ | Standalone HTML rendering of the current draft. Open with `file://` |

## The cycle

```
┌─────────────────────────────────────────────────────────────┐
│  1. PRODUCER hands schema.md + system-prompt.md to LLM      │
│  2. LLM asks 3–7 context questions (history, voice, facts)  │
│  3. LLM writes v1 of draft.md, regenerates preview.html      │
│  4. PRODUCER opens preview.html, reviews, gives feedback     │
│  5. LLM iterates draft.md + preview.html                     │
│  6. On approval → LLM copies draft.md → production.md        │
│         frontmatter: status: production, synced: false        │
│  7. CLAUDE CODE reads production.md, edits component         │
│         frontmatter: synced: true, synced_at: YYYY-MM-DD     │
└─────────────────────────────────────────────────────────────┘
```

## Frontmatter conventions

Every `draft.md` and `production.md` starts with frontmatter:

```yaml
---
section: hero
component: components/sections/Hero.tsx
status: draft        # draft | production
synced: false        # true once wired into component
synced_at: null      # ISO date set by wiring agent
last_edit_by: gemini # human label of who/what last edited
---
```

The wiring agent ONLY edits files where `status: production` and `synced: false`. It refuses to touch `status: draft` files. After editing the component, it flips `synced: true` and writes today's date into `synced_at`.

## Preview convention

`preview.html` is a self-contained file. It links the design tokens via:

```html
<link rel="stylesheet" href="../../../app/styles/tokens.css">
```

…and uses Tailwind via CDN for layout utilities. This is **for review only** — never used in production. Visual fidelity is intentionally rough (no Framer Motion, no exact JSX layout). The goal is: *does this copy land, is the hierarchy right, does it sound like Bellavista?*

When a section's draft changes, the LLM is expected to regenerate `preview.html` from `_template.html` so both stay in sync.

## Visual review without burning premium tokens

`preview.html` is plain text. Any LLM (Haiku, Gemini Flash, GPT-4o-mini, local llama) can update both `draft.md` and `preview.html` in the same turn. The producer just refreshes the browser tab.

Reserve premium tokens (Claude Opus / GPT-4o / etc.) for:
- Wiring approved copy into JSX (Claude Code, in this repo)
- Voice calibration when the section's tone keeps missing
- Cross-section consistency review at the end

## Sync status auditing

To see which sections still need wiring after a content sprint:

```bash
grep -l "synced: false" docs/content-authoring/**/production.md
```

(Run from repo root. Returns paths of approved-but-not-yet-wired sections.)

## Out of scope for this folder

- Journal entries themselves (they live in `/content/journal/*.md` and use their own MDX schema validated by `lib/journal-schema.ts`). Only the journal *section header copy* lives in `journal-meta/`.
- Form labels and validation messages (live in `components/forms/*.tsx`, low-priority for content authoring v1).
- Admin surface copy (parked with B10).
