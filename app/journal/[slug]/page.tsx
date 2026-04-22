/**
 * /journal/[slug] — public journal entry renderer.
 *
 * Server component: reads + parses the MDX file at build time (SSG via
 * generateStaticParams). Only renders public entries — private entries
 * return 404 here, shown only inside /admin (B10).
 *
 * Structured `metrics` block is rendered above the body for experiment
 * posts. Narrative posts render body-only.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import { getPublicEntries, getEntryBySlug } from "@/lib/journal";

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return getPublicEntries().map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const entry = getEntryBySlug(params.slug);
  if (!entry) return { title: "Not found" };
  return {
    title: `${entry.frontmatter.title} — Bellavista Journal`,
    description: entry.frontmatter.excerpt,
  };
}

function formatFullDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function JournalEntryPage({ params }: Params) {
  const entry = getEntryBySlug(params.slug);
  if (!entry) notFound();

  const { frontmatter, body } = entry;

  return (
    <main className="min-h-screen bg-bg">
      <article className="max-w-[720px] mx-auto px-6 md:px-10 py-24">
        <Link
          href="/#journal"
          className="font-mono text-meta uppercase text-ink-3 hover:text-ink transition-colors"
        >
          ← Back to journal
        </Link>

        <header className="mt-10 space-y-4">
          <p className="font-mono text-meta uppercase text-accent">
            {frontmatter.kind} · {formatFullDate(frontmatter.date)}
            {frontmatter.plot ? ` · ${frontmatter.plot.replace("_", " ")}` : ""}
          </p>
          <h1 className="font-serif text-h1 leading-[0.95] text-ink text-balance">
            {frontmatter.title}
          </h1>
          {frontmatter.excerpt && (
            <p className="font-serif italic text-h4 text-ink-2 leading-snug">
              {frontmatter.excerpt}
            </p>
          )}
        </header>

        {frontmatter.metrics && (
          <aside
            aria-label="Structured metrics"
            className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-2"
          >
            {frontmatter.metrics.batch_id && (
              <Stat label="Batch" value={frontmatter.metrics.batch_id} />
            )}
            {typeof frontmatter.metrics.ph === "number" && (
              <Stat label="PH" value={frontmatter.metrics.ph.toFixed(1)} />
            )}
            {typeof frontmatter.metrics.brix === "number" && (
              <Stat
                label="Brix"
                value={frontmatter.metrics.brix.toFixed(1)}
              />
            )}
            {typeof frontmatter.metrics.temp_c === "number" && (
              <Stat
                label="Temp"
                value={`${frontmatter.metrics.temp_c}°C`}
              />
            )}
          </aside>
        )}

        <div className="mt-10 font-sans text-body text-ink-2 leading-relaxed space-y-5 prose-journal">
          <MDXRemote source={body} />
        </div>

        {frontmatter.tags.length > 0 && (
          <footer className="mt-12 pt-6 border-t border-line">
            <ul className="flex flex-wrap gap-2">
              {frontmatter.tags.map((t) => (
                <li
                  key={t}
                  className="font-mono text-meta uppercase text-ink-3 border border-line px-2 py-[3px]"
                >
                  {t}
                </li>
              ))}
            </ul>
          </footer>
        )}
      </article>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line p-3 space-y-1">
      <p className="font-mono text-meta uppercase text-ink-3">{label}</p>
      <p className="font-serif italic text-[22px] leading-tight text-accent-2">
        {value}
      </p>
    </div>
  );
}
