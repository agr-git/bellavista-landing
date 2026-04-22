/**
 * Journal loader — reads MDX from /content/journal, filters by
 * visibility, sorts newest first.
 *
 * Public feed: `getPublicEntries()` — used by the marketing page +
 * /journal/[slug] route. Filters out anything with
 * `visibility: 'private'` at the filesystem level, so private posts
 * never leak into the static bundle.
 *
 * Admin feed (B10): `getAllEntries({ includePrivate: true })` — reads
 * the full set including /content/private/*.md. Guarded by NextAuth
 * middleware, not by this function.
 *
 * Slug = filename minus .md/.mdx. Enforced unique across public entries
 * by validate-content.ts at prebuild.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { JournalFrontmatter } from "./journal-schema";

const PUBLIC_DIR = path.join(process.cwd(), "content", "journal");
const PRIVATE_DIR = path.join(process.cwd(), "content", "private");

export type JournalEntry = {
  slug: string;
  frontmatter: JournalFrontmatter;
  body: string;
};

function listMarkdown(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
}

function readEntry(dir: string, file: string): JournalEntry | null {
  const raw = fs.readFileSync(path.join(dir, file), "utf8");
  const { data, content } = matter(raw);
  const parsed = JournalFrontmatter.safeParse(data);
  if (!parsed.success) {
    // Skip invalid entries in runtime; prebuild validator is the gate
    // that prevents bad entries from reaching production.
    console.warn(
      `[journal] skipping ${file} — invalid frontmatter:`,
      parsed.error.flatten()
    );
    return null;
  }
  const slug = file.replace(/\.(md|mdx)$/, "");
  return { slug, frontmatter: parsed.data, body: content };
}

function sortDesc(a: JournalEntry, b: JournalEntry) {
  return a.frontmatter.date < b.frontmatter.date ? 1 : -1;
}

/** Public feed — safe to import into client-exposed pages. */
export function getPublicEntries(): JournalEntry[] {
  return listMarkdown(PUBLIC_DIR)
    .map((f) => readEntry(PUBLIC_DIR, f))
    .filter((e): e is JournalEntry => !!e)
    .filter((e) => e.frontmatter.visibility === "public")
    .sort(sortDesc);
}

/** Full feed — admin-only consumers must gate via NextAuth. */
export function getAllEntries(): JournalEntry[] {
  const pub = listMarkdown(PUBLIC_DIR).map((f) => readEntry(PUBLIC_DIR, f));
  const prv = listMarkdown(PRIVATE_DIR).map((f) => readEntry(PRIVATE_DIR, f));
  return [...pub, ...prv]
    .filter((e): e is JournalEntry => !!e)
    .sort(sortDesc);
}

export function getEntryBySlug(slug: string): JournalEntry | null {
  const files = listMarkdown(PUBLIC_DIR);
  const match = files.find((f) => f.replace(/\.(md|mdx)$/, "") === slug);
  if (!match) return null;
  const e = readEntry(PUBLIC_DIR, match);
  if (!e || e.frontmatter.visibility !== "public") return null;
  return e;
}
