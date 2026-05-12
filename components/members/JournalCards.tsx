/**
 * JournalCards — displays Substack preview cards.
 *
 * Server component (no "use client"). Receives pre-fetched posts from the
 * parent page. Renders empty state when posts array is empty.
 */

import type { JournalCard } from "@/lib/substack";
import Image from "next/image";

interface JournalCardsProps {
  posts: JournalCard[];
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function JournalCards({ posts }: JournalCardsProps) {
  if (posts.length === 0) {
    return (
      <div className="border border-line rounded-[var(--radius)] p-8 text-center">
        <p className="font-mono text-meta uppercase tracking-[var(--ls-meta)] text-ink-3 mb-2">
          Journal
        </p>
        <p className="font-sans text-body text-ink-2">
          The field log is on its way. Check back soon, or read directly on{" "}
          <a
            href={process.env.NEXT_PUBLIC_SUBSTACK_URL ?? "https://substack.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-2 transition-colors underline"
          >
            Substack ↗
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {posts.map((post) => (
        <a
          key={post.url}
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group border border-line rounded-[var(--radius)] overflow-hidden hover:border-accent transition-colors bg-surface/40 flex flex-col"
        >
          {/* Cover image */}
          <div className="relative aspect-[16/9] bg-surface overflow-hidden">
            {post.coverImageUrl ? (
              <Image
                src={post.coverImageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background:
                    "linear-gradient(135deg, var(--surface) 0%, var(--bg) 100%)",
                }}
              />
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col gap-2 flex-1">
            <time className="font-mono text-meta text-ink-3">
              {formatDate(post.publishedAt)}
            </time>
            <h3 className="font-serif text-h4 text-ink leading-snug group-hover:text-accent transition-colors">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="font-sans text-small text-ink-2 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            )}
            <span className="mt-auto font-mono text-meta uppercase tracking-[var(--ls-meta)] text-accent pt-3">
              Read on Substack ↗
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}
