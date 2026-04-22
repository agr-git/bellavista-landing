/**
 * Prebuild content validator.
 *
 * Runs before `next build` (wired via package.json `prebuild` script).
 * Fails the build if any MDX file in /content/journal/ or
 * /content/private/ has invalid frontmatter, a bad date, or a duplicate
 * slug among public entries.
 *
 * This is the ADR-005 guardrail: Obsidian edits go to production
 * unreviewed — we need schema enforcement at the gate.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { JournalFrontmatter } from "../lib/journal-schema";

const ROOTS = [
  path.join(process.cwd(), "content", "journal"),
  path.join(process.cwd(), "content", "private"),
];

type Problem = { file: string; message: string };

function listMarkdown(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
}

function main() {
  const problems: Problem[] = [];
  const publicSlugs = new Map<string, string>();

  for (const dir of ROOTS) {
    for (const file of listMarkdown(dir)) {
      const full = path.join(dir, file);
      const raw = fs.readFileSync(full, "utf8");
      const { data } = matter(raw);
      const parsed = JournalFrontmatter.safeParse(data);
      if (!parsed.success) {
        problems.push({
          file: full,
          message: JSON.stringify(parsed.error.flatten(), null, 2),
        });
        continue;
      }
      if (parsed.data.visibility === "public") {
        const slug = file.replace(/\.(md|mdx)$/, "");
        const prev = publicSlugs.get(slug);
        if (prev) {
          problems.push({
            file: full,
            message: `duplicate public slug "${slug}" also used by ${prev}`,
          });
        } else {
          publicSlugs.set(slug, full);
        }
      }
    }
  }

  if (problems.length === 0) {
    const total = Array.from(ROOTS).reduce(
      (sum, d) => sum + listMarkdown(d).length,
      0
    );
    console.log(
      `[validate-content] ✓ ${total} entries validated, ${publicSlugs.size} public`
    );
    return;
  }

  console.error(`[validate-content] ✗ ${problems.length} problem(s):\n`);
  for (const p of problems) {
    console.error(`  ${p.file}`);
    console.error(`    ${p.message.replace(/\n/g, "\n    ")}\n`);
  }
  process.exit(1);
}

main();
