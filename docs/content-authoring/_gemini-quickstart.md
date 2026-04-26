# Outsourcing content drafting to Gemini (or any other LLM)

This is the playbook for handing a section off to a non-Claude model. The goal: keep premium Anthropic tokens for deep wiring and review work, while a cheaper/faster LLM does the conversational drafting.

Works equivalently with Gemini 2.5 Pro/Flash, GPT-4o, GPT-4o-mini, or any local model that handles long-context instructions.

## Step 1 — Pick a section

```bash
ls docs/content-authoring/   # see all 10 sections
```

Pick one. Note its folder name (e.g. `hero`).

## Step 2 — Bundle the context

In the Gemini chat (or Gemini CLI), paste **two files in this exact order**:

1. The section's `system-prompt.md` (this is the drafting LLM's role + workflow rules)
2. The section's `schema.md` (the copy slots + constraints + component anchor)

Optional but useful: also paste the **shared style** files so Gemini stays on voice across sections:

3. `_authoring-guide.md` (workflow conventions)
4. `app/styles/tokens.css` (so it knows the design vocabulary)

A good single bundling prompt at the start of the session:

> ```
> You are about to draft copy for the Bellavista Coffee landing page.
> I'll paste four files. Read them and acknowledge before doing anything.
>
> 1. system-prompt.md — your role
> 2. schema.md — what to draft, with constraints
> 3. _authoring-guide.md — the broader workflow
> 4. tokens.css — the design vocabulary (font sizes, colors)
>
> After acknowledging, ask me 3–7 questions to gather context I haven't given you. Then draft v1.
> ```

## Step 3 — Iterate

Gemini drafts. You react. Common moves:

- "Tighter — cut 30%."
- "More like a field log entry, less like marketing."
- "The headline emphasis should land on a verb, not a noun."

Each iteration, ask Gemini to output **two artifacts in one turn**:

- The full updated `draft.md` (with frontmatter)
- The full updated `preview.html` (using `_template.html` as the base)

That way one copy-paste pair refreshes both the data file and the visual.

## Step 4 — Save the artifacts

Copy the two artifacts Gemini emits into:

- `docs/content-authoring/<section>/draft.md`
- `docs/content-authoring/<section>/preview.html`

(Both are gitignored — they only live on your laptop.)

## Step 5 — Visual check

Double-click `preview.html` (or open with `cmd+O` in your browser). It loads `tokens.css` from the project, so it'll match the real site's colors, fonts, and type scale.

Iterate Steps 3–5 until you're happy.

## Step 6 — Promote to production

When the draft is approved, ask Gemini:

> ```
> Final pass: copy draft.md into production.md. Set frontmatter
> status: production, synced: false, synced_at: null,
> last_edit_by: <your initials>. Output the full production.md.
> ```

Save the output to `docs/content-authoring/<section>/production.md`.

## Step 7 — Wire it (back in this Claude Code session)

When you have one or more sections at `status: production, synced: false`, come back to Claude Code and say something like:

> "Wire the approved hero and story sections into the components."

Claude Code will:
- Find production.md files where `synced: false`
- Edit the matching component (path is in the schema's `component:` field)
- Flip `synced: true` and stamp `synced_at` with today's date

## Tips for keeping Gemini on voice

- The **first** turn that establishes voice is the most important. Don't rush it. Ask Gemini to write three variants of the headline before locking in.
- If voice keeps drifting across sections, paste the existing `production.md` files of already-finished sections at the start of a new section's session — Gemini will mirror the tone.
- Bellavista's voice (per existing components): plain, technical, slightly dry, never marketing-flavored. References to deploys, log lines, version control are *intentional*. Coffee romanticism is muted.

## When NOT to use this flow

- One-off micro-edits (a single word change). Just do it inline.
- Anything where the slot logic itself needs to change (new props, new layout). That's a JSX change, not a content change — handle in Claude Code.
