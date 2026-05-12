/**
 * Zod schema for journal entry frontmatter.
 *
 * Two shapes live in one pipeline:
 *   - kind: 'project' | 'visit'     → narrative post, renders excerpt + body
 *   - kind: 'experiment'            → data post, renders metrics block
 *
 * `visibility: 'public' | 'members' | 'private'` is the single source of truth.
 * - public   → renders on /journal (unauthenticated)
 * - members  → reserved for logged-in members (not yet consumed in V1; forward-looking)
 * - private  → admin only
 *
 * Keep this schema strict — `validate-content.ts` runs in prebuild and
 * fails the build on bad frontmatter. Cheap guardrail, huge payoff.
 */

import { z } from "zod";

export const Plot = z.enum([
  "la_vega",
  "el_bosque",
  "la_cumbre",
  "beneficio",
]);

export const Metrics = z
  .object({
    ph: z.number().optional(),
    brix: z.number().optional(),
    temp_c: z.number().optional(),
    batch_id: z.string().optional(),
    notes: z.string().optional(),
  })
  .strict();

export const JournalFrontmatter = z
  .object({
    title: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "date must be ISO YYYY-MM-DD",
    }),
    kind: z.enum(["project", "experiment", "visit"]),
    visibility: z.enum(["public", "members", "private"]),
    plot: Plot.optional(),
    tags: z.array(z.string()).default([]),
    metrics: Metrics.optional(),
    cover_image_url: z.string().optional(),
    excerpt: z.string().optional(),
  })
  .strict();

export type JournalFrontmatter = z.infer<typeof JournalFrontmatter>;
export type JournalPlot = z.infer<typeof Plot>;
