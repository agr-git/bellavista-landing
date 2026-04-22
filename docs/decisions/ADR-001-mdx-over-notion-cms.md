# ADR-001 — MDX + Obsidian over Notion-as-CMS

**Date:** 2026-04-21
**Status:** Accepted
**Deciders:** Alejo Gil (producer + dev)

---

## Context

The site needs a content store for the Journal (public posts + private experiment logs) and section copy. Two realistic options were evaluated:

**Option A — Notion as CMS**
Use Notion pages as the content source. Fetch entries via Notion API at build time or runtime.

**Option B — MDX files + Obsidian**
Store content as `.md` files in `/content/`. Edit locally with Obsidian (or any editor). Commit and push to publish.

---

## Decision

**Use MDX files in `/content/` edited via Obsidian.**

---

## Reasons

1. **No rate limits on the read path.** Notion API has rate limits (3 req/s). A build that reads 50+ content blocks during `next build` risks hitting them, causing flaky builds. MDX reads from disk — zero network dependency.

2. **Build-time validation.** Zod frontmatter validation runs in `prebuild` via `scripts/validate-content.ts`. A malformed entry fails the build locally before reaching production — no silent bad data.

3. **Obsidian is already in the operator's workflow.** The producer uses Obsidian for field notes. Pointing it at `/content/` means no new tool to learn.

4. **Private entries stay private.** `/content/private/` is in `.gitignore`. Experiment logs, pH readings, batch plans never touch the repo. Notion would require careful page permissions; git is a harder guarantee.

5. **Offline editing.** Farm may have unreliable connectivity. Obsidian + git works offline; Notion does not.

6. **Simpler architecture.** MDX removes an entire external dependency from the build pipeline. Notion remains write-only (form submissions to Resources DB) — much easier to reason about.

---

## Consequences

- **Publishing flow:** write `.md` → commit → `git push` → server pulls + rebuilds. Not instant (vs. Notion's near-real-time). Acceptable for a journal that updates weekly.
- **No rich media embeds** from Notion (callouts, toggles). MDX allows custom components to compensate.
- **Team editing** would require git access. Sole operator in v1, so this is not a constraint.
- **Migration path:** if volume grows beyond ~100 posts or multi-author becomes needed, Contentlayer or Sanity can replace the file system layer without changing components (same frontmatter schema).

---

## Alternatives rejected

| Option | Reason rejected |
|---|---|
| Notion as CMS | Rate limits on read path, external network dependency in build |
| Sanity / Contentlayer | Over-engineered for solo operator + 50-post v1 scope |
| Supabase Postgres | Requires migrations, connection pooling, extra infra cost |
