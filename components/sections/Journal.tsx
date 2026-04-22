/**
 * Journal section — "From the field."
 *
 * Server component: reads MDX from the filesystem at build/request time.
 *
 * Layout per handoff:
 * - Header row: h2 + subhead + filter chips (All · Projects · Experiments)
 *   Filter is visual-only here; switching client-side filtering is cheap
 *   follow-up but not a blocker for B8.
 * - Split grid: 1.4fr (Featured post) | 1fr (Recent list, 5 rows).
 *
 * Featured = newest public entry. Recent = next 5.
 * Empty state: if no entries, render a single meta line.
 */

import Link from "next/link";
import { getPublicEntries } from "@/lib/journal";

function formatDate(iso: string) {
  // "APR 18"
  const d = new Date(iso + "T00:00:00");
  return d
    .toLocaleDateString("en-US", { month: "short", day: "2-digit" })
    .toUpperCase();
}

export default function Journal() {
  const entries = getPublicEntries();
  const [featured, ...rest] = entries;
  const recent = rest.slice(0, 5);

  return (
    <section
      id="journal"
      className="border-t border-line py-24 px-6 md:px-10"
      aria-labelledby="journal-heading"
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header row */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div className="max-w-[620px]">
            <h2
              id="journal-heading"
              className="font-serif text-h2 leading-[1] text-ink text-balance"
            >
              From the <em className="italic text-accent-2">field.</em>
            </h2>
            <p className="mt-4 font-sans text-body text-ink-2 leading-relaxed">
              Public posts showcase projects. Private entries track
              experiments — producer only.
            </p>
          </div>

          <ul className="flex flex-wrap items-center gap-2" role="list">
            {[
              { label: "All", active: true },
              { label: "Projects" },
              { label: "Experiments" },
            ].map((chip) => (
              <li key={chip.label}>
                <span
                  className={`font-mono text-meta uppercase border px-3 py-[7px] ${
                    chip.active
                      ? "border-accent text-accent"
                      : "border-line text-ink-2"
                  }`}
                >
                  {chip.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {entries.length === 0 ? (
          <p className="font-mono text-meta uppercase text-ink-3">
            No entries yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-[1.4fr_1fr] gap-[18px]">
            {/* Featured */}
            {featured && (
              <article className="border border-line p-6 md:p-8 flex flex-col gap-4">
                <p className="font-mono text-meta uppercase text-accent">
                  Featured · {featured.frontmatter.kind}
                </p>
                <div
                  className="w-full bg-surface border border-line"
                  style={{
                    height: 180,
                    backgroundImage:
                      "linear-gradient(135deg, rgba(232,155,74,0.18), rgba(36,48,73,1) 70%)",
                  }}
                  aria-hidden
                />
                <p className="font-mono text-meta uppercase text-ink-3">
                  {formatDate(featured.frontmatter.date)} ·{" "}
                  {featured.frontmatter.kind} · Public
                </p>
                <h3 className="font-serif text-h3 text-ink leading-tight">
                  <Link
                    href={`/journal/${featured.slug}`}
                    className="hover:text-accent-2 transition-colors"
                  >
                    {featured.frontmatter.title}
                  </Link>
                </h3>
                {featured.frontmatter.excerpt && (
                  <p className="font-sans text-body text-ink-2 leading-relaxed">
                    {featured.frontmatter.excerpt}
                  </p>
                )}
              </article>
            )}

            {/* Recent */}
            <ul className="flex flex-col">
              {recent.map((e, i) => (
                <li
                  key={e.slug}
                  className={`grid grid-cols-[56px_1fr_72px] items-center gap-4 py-4 ${
                    i === 0 ? "" : "border-t border-line"
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase text-ink-3 leading-none">
                    {formatDate(e.frontmatter.date)}
                  </span>
                  <h4 className="font-serif text-[16px] leading-tight text-ink">
                    <Link
                      href={`/journal/${e.slug}`}
                      className="hover:text-accent-2 transition-colors"
                    >
                      {e.frontmatter.title}
                    </Link>
                  </h4>
                  <span className="justify-self-end font-mono text-meta uppercase border border-accent text-accent px-2 py-[3px]">
                    public
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
