/**
 * lib/substack.ts — Substack RSS bridge.
 *
 * Fetches the publication's RSS feed and maps items to typed JournalCard
 * objects. Results are cached server-side for 5 minutes via Next.js
 * unstable_cache (no extra Redis/KV needed).
 *
 * Env vars:
 *   SUBSTACK_FEED_URL — full RSS feed URL, e.g.
 *     https://bellavistacoffee.substack.com/feed
 *     If unset or if the feed is unreachable, returns [] (graceful empty state).
 *
 * Design:
 *   - Server-only (no "use client"; rss-parser is a Node module).
 *   - Falls back to empty array on any error — never throws to the caller.
 *   - Returns at most `limit` posts (default 6).
 */

import Parser from "rss-parser";
import { unstable_cache } from "next/cache";

export interface JournalCard {
  title: string;
  excerpt: string;       // first ~200 chars of content or summary
  url: string;
  coverImageUrl: string | null;
  publishedAt: string;   // ISO date string
}

const parser = new Parser({
  customFields: {
    item: [
      ["content:encoded", "contentEncoded"],
      ["media:content", "mediaContent", { keepArray: false }],
    ],
  },
});

/** Extract a plain-text excerpt from HTML content. */
function toExcerpt(html: string, maxLen = 200): string {
  // Strip HTML tags; collapse whitespace; trim to maxLen
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
}

/** Extract cover image URL from various RSS item fields. */
function extractCover(item: Record<string, unknown>): string | null {
  // Substack often puts the hero image in the enclosure or media:content
  const enclosure = item.enclosure as { url?: string } | undefined;
  if (enclosure?.url) return enclosure.url;

  const media = item.mediaContent as { $?: { url?: string } } | undefined;
  if (media?.$?.url) return media.$.url;

  // Fall back: find first <img> src in content:encoded
  const content =
    (item.contentEncoded as string | undefined) ||
    (item.content as string | undefined) ||
    "";
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ?? null;
}

async function fetchPosts(limit: number): Promise<JournalCard[]> {
  const feedUrl = process.env.SUBSTACK_FEED_URL;
  if (!feedUrl) {
    // Feed URL not configured — return empty state, no error
    return [];
  }

  try {
    const feed = await parser.parseURL(feedUrl);
    return (feed.items ?? []).slice(0, limit).map((item) => {
      const raw = item as unknown as Record<string, unknown>;
      return {
        title: item.title ?? "Untitled",
        excerpt: toExcerpt(
          (raw.contentEncoded as string | undefined) ||
            item.content ||
            item.summary ||
            "",
          200
        ),
        url: item.link ?? feedUrl,
        coverImageUrl: extractCover(raw),
        publishedAt: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
      };
    });
  } catch (err) {
    // Network error, malformed feed, feed not yet live — all treated as empty.
    console.warn("[substack] RSS fetch failed:", (err as Error).message);
    return [];
  }
}

/**
 * Get recent Substack posts, cached for 5 minutes.
 * Returns [] when the feed is unavailable.
 */
export const getRecentPosts = unstable_cache(fetchPosts, ["substack-posts"], {
  revalidate: 300, // 5 minutes
  tags: ["substack"],
});
