# ADR-002 — CSS Custom Properties as Token Source of Truth

**Date:** 2026-04-21
**Status:** Accepted
**Deciders:** Alejo Gil

---

## Context

The design uses a precise token system (Amanecer palette + type scale + spacing). Two options for managing tokens:

**Option A — Tailwind config as source of truth**
Define all colors, font sizes, spacing in `tailwind.config.ts`. Components use Tailwind utility classes directly.

**Option B — CSS custom properties as source of truth, Tailwind as consumer**
Define tokens in `app/styles/tokens.css` as `:root` CSS variables. `tailwind.config.ts` maps Tailwind tokens to `var(--token-name)`. Components use Tailwind classes that resolve to CSS vars.

---

## Decision

**Use CSS custom properties as the single source of truth. Tailwind consumes them via the config bridge.**

Token file: `app/styles/tokens.css`
Bridge: `tailwind.config.ts` maps all design tokens to `var(--token-name)`

---

## Reasons

1. **One-line visual updates.** Changing `--accent` in `tokens.css` updates every accent-colored element site-wide. With pure Tailwind, you'd need to grep-replace every class reference.

2. **Responsive token overrides are trivial.** The mobile type scale (`@media (max-width: 768px) { :root { --fs-h1: 40px; } }`) changes all h1 typography in one place. Tailwind responsive variants scatter this across every component.

3. **Runtime theming is possible** (dark mode toggle, seasonal palette swap) without a rebuild. CSS vars are live in the browser; Tailwind JIT values are baked at build time.

4. **Prototype fidelity.** The design handoff already uses CSS var names. Using the same names eliminates a translation layer.

5. **Tailwind still handles layout.** `gap-4`, `grid-cols-3`, `flex`, `px-8` — all structural, all Tailwind. The bridge only maps design tokens (colors, type, spacing values), not layout utilities.

---

## The bridge pattern

```css
/* app/styles/tokens.css */
:root {
  --bg: #1b2437;
  --accent: #e89b4a;
  --font-serif: "Instrument Serif", serif;
  --fs-h1: 84px;
  /* ... */
}
```

```ts
// tailwind.config.ts
theme: { extend: {
  colors: {
    bg: "var(--bg)",
    accent: { DEFAULT: "var(--accent)", 2: "var(--accent-2)" },
  },
  fontFamily: {
    serif: ["var(--font-serif)"],
  },
}}
```

```tsx
// Component — uses Tailwind classes that resolve to CSS vars
<h1 className="font-serif text-ink">...</h1>
<button className="bg-accent text-bg">...</button>
```

---

## Rules for future agents

| Request | Action |
|---|---|
| Change a color | Edit `tokens.css` only |
| Change font size (site-wide) | Edit `tokens.css` only |
| Change layout / padding | Edit component JSX (Tailwind classes) |
| Add a new token | Add to `tokens.css` AND add bridge entry in `tailwind.config.ts` |
| Hardcode a color in a component | NEVER — always use a token |

---

## Consequences

- Slightly more setup than pure Tailwind (two files to maintain in sync)
- Tailwind IntelliSense shows `var(--bg)` as the value — less readable in hover tooltips, but not a workflow blocker
- CSS vars are not tree-shaken; the full token set is always in the bundle (~500 bytes gzipped, acceptable)
