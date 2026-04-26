# Content Authoring — Bellavista Landing

Workspace for drafting and approving the copy that gets wired into landing-page sections. Each section has its own folder; an LLM (Claude, Gemini, …) reads the schema + system prompt and helps the producer draft the copy outside the React codebase, so writers don't need to touch JSX.

## Why this exists

- The components live in `components/sections/*.tsx` with copy currently hardcoded inline.
- We want to decouple copywriting from code edits so any LLM (cheaper or local) can do drafting, and a smarter agent only handles the JSX wiring at the end.
- Content can be private (e.g. unannounced milestones, exact pricing). The repo is public — so drafts/production/previews are gitignored.

## Folder layout

```
docs/content-authoring/
├── README.md                  ← you are here (tracked)
├── _authoring-guide.md        ← workflow + roles (tracked)
├── _template.html             ← preview HTML template (tracked)
├── _gemini-quickstart.md      ← how to outsource drafting to Gemini (tracked)
├── hero/
│   ├── schema.md              ← copy slots, anchored to component file (tracked)
│   ├── system-prompt.md       ← LLM instructions for drafting this section (tracked)
│   ├── draft.md               ← work-in-progress copy (gitignored)
│   ├── production.md          ← approved copy + sync status (gitignored)
│   └── preview.html           ← visual sanity check (gitignored)
└── … (story, farm, chapter-la-vega, chapter-el-bosque, chapter-la-cumbre,
       coffee, stay, journal-meta, footer)
```

**Tracked** = scaffold (schema, prompt, template, guides). **Gitignored** = the actual content. See `.gitignore` rules.

## Sections

| Folder | Component | Purpose |
|---|---|---|
| `hero/` | `components/sections/Hero.tsx` | Full-bleed hero, headline, primary CTA, chapter strip |
| `story/` | `components/sections/Story.tsx` | Chapter 01 — the producer's story |
| `farm/` | `components/sections/Farm.tsx` (+ `FarmMap.tsx`) | Chapter 02 — farm overview, stats, milestones |
| `chapter-villa-paula/` | `components/sections/Chapters.tsx` (instance 1) | Chapter 02b · VILLA PAULA scrolly (was LA VEGA — rename pending wiring) |
| `chapter-bambu-stream/` | `components/sections/Chapters.tsx` (instance 2) | Chapter 03 · BAMBU STREAM scrolly (was EL BOSQUE — rename pending wiring) |
| `chapter-terra-preta/` | `components/sections/Chapters.tsx` (instance 3) | Chapter 04 · TERRA PRETA scrolly (was LA CUMBRE — rename pending wiring) |
| `coffee/` | `components/sections/Coffee.tsx` | What we grow — B2B + Direct lanes, pull quote |
| `stay/` | `components/sections/Stay.tsx` | Sleep at Bellavista — bento grid + price card |
| `journal-meta/` | `components/sections/Journal.tsx` | Journal section header + filter labels (entries themselves live in `/content/journal/*.md`) |
| `footer/` | `components/Footer.tsx` | Contact slab + subscribe CTA |

## Workflow (TL;DR)

1. Pick a section folder.
2. Open `schema.md` → understand slots and constraints.
3. Hand `schema.md` + `system-prompt.md` to your LLM of choice (see `_gemini-quickstart.md`).
4. LLM gathers context interactively, drafts into `draft.md`.
5. Producer reviews. When approved, the LLM (or you) copies into `production.md` and sets `synced: false`.
6. Open `preview.html` in a browser to sanity-check the visuals before any JSX edit.
7. A wiring agent (Claude Code) reads `production.md`, edits the component, sets `synced: true` + `synced_at: <date>`.

Full details in `_authoring-guide.md`.
