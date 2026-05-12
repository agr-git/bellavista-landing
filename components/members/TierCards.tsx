"use client";

/**
 * TierCards — 4 coffee access tier cards.
 *
 * Washed:     Active → links to Substack subscription.
 * Honey / Natural / On-demand: "Coming soon" → "Join waitlist" button.
 *
 * Optimistic UI: clicking join immediately updates button state,
 * then confirms (or rolls back on error) once the API responds.
 */

import { useState, useTransition } from "react";

interface Tier {
  slug: string;
  label: string;
  tagline: string;
  perks: string[];
  active: boolean;
  substackUrl?: string;
}

const TIERS: Tier[] = [
  {
    slug: "washed",
    label: "Washed",
    tagline: "The full record, from harvest to cup.",
    perks: [
      "Every journal entry — public + private",
      "Beneficio process logs",
      "Weekly cup scores",
      "Season-end retrospectives",
    ],
    active: true,
    substackUrl: process.env.NEXT_PUBLIC_SUBSTACK_URL ?? "https://substack.com",
  },
  {
    slug: "honey",
    label: "Honey",
    tagline: "Batch-level traceability + exclusive lots.",
    perks: [
      "Everything in Washed",
      "Batch traceability dashboard",
      "First access to honey-process lots",
      "Roasting sample notes per batch",
    ],
    active: false,
  },
  {
    slug: "natural",
    label: "Natural",
    tagline: "Direct relationship with the producer.",
    perks: [
      "Everything in Honey",
      "1:1 producer Q&A (calendar link)",
      "Natural process micro-lots",
      "Priority allocation",
    ],
    active: false,
  },
  {
    slug: "on-demand",
    label: "On-demand",
    tagline: "Live from the farm, on your schedule.",
    perks: [
      "Everything in Natural",
      "Live virtual farm tours (booking link)",
      "Farmhouse stay discount",
      "Custom lot co-design",
    ],
    active: false,
  },
];

type JoinState = "idle" | "loading" | "joined" | "duplicate" | "error";

interface TierCardsProps {
  /** The signed-in user's email — available for future personalization (e.g. "already joined" pre-load). */
  userEmail: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function TierCards({ userEmail }: TierCardsProps) {
  const [joinStates, setJoinStates] = useState<Record<string, JoinState>>(
    () => Object.fromEntries(TIERS.map((t) => [t.slug, "idle"]))
  );
  const [, startTransition] = useTransition();

  async function handleJoin(slug: string) {
    setJoinStates((prev) => ({ ...prev, [slug]: "loading" }));

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: slug }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        alreadyJoined?: boolean;
      };

      if (!res.ok || !json.ok) {
        startTransition(() =>
          setJoinStates((prev) => ({ ...prev, [slug]: "error" }))
        );
        return;
      }

      startTransition(() =>
        setJoinStates((prev) => ({
          ...prev,
          [slug]: json.alreadyJoined ? "duplicate" : "joined",
        }))
      );
    } catch {
      startTransition(() =>
        setJoinStates((prev) => ({ ...prev, [slug]: "error" }))
      );
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {TIERS.map((tier) => {
        const state = joinStates[tier.slug];
        return (
          <div
            key={tier.slug}
            className={`border rounded-[var(--radius)] p-6 flex flex-col gap-4 ${
              tier.active
                ? "border-accent bg-surface/60"
                : "border-line bg-surface/30"
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-meta uppercase tracking-[var(--ls-meta)] text-accent mb-1">
                  {tier.label}
                </p>
                <p className="font-sans text-small text-ink-2 leading-snug">
                  {tier.tagline}
                </p>
              </div>
              {tier.active ? (
                <span className="font-mono text-label uppercase tracking-[var(--ls-label)] text-[10px] bg-accent text-bg px-2 py-1 rounded-sm whitespace-nowrap">
                  Active
                </span>
              ) : (
                <span className="font-mono text-label uppercase tracking-[var(--ls-label)] text-[10px] border border-line text-ink-3 px-2 py-1 rounded-sm whitespace-nowrap">
                  Coming soon
                </span>
              )}
            </div>

            {/* Perks */}
            <ul className="space-y-1.5">
              {tier.perks.map((perk) => (
                <li
                  key={perk}
                  className="flex gap-2 font-sans text-small text-ink-2 leading-snug"
                >
                  <span className="text-accent mt-[2px] shrink-0">·</span>
                  {perk}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-auto pt-2">
              {tier.active ? (
                <a
                  href={tier.substackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-mono text-label uppercase tracking-[var(--ls-label)] bg-accent text-bg px-5 py-3 hover:bg-accent-2 transition-colors rounded-[var(--radius)]"
                >
                  Subscribe on Substack ↗
                </a>
              ) : state === "joined" ? (
                <p className="font-mono text-label uppercase tracking-[var(--ls-label)] text-accent">
                  ✓ You&apos;re on the list
                </p>
              ) : state === "duplicate" ? (
                <p className="font-mono text-label uppercase tracking-[var(--ls-label)] text-ink-3">
                  Already on this list
                </p>
              ) : state === "error" ? (
                <div className="flex items-center gap-3">
                  <p className="font-mono text-label uppercase tracking-[var(--ls-label)] text-accent">
                    Something went wrong
                  </p>
                  <button
                    type="button"
                    onClick={() => handleJoin(tier.slug)}
                    className="font-mono text-meta underline text-ink-2 hover:text-ink"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={state === "loading"}
                  onClick={() => handleJoin(tier.slug)}
                  className="font-mono text-label uppercase tracking-[var(--ls-label)] border border-line text-ink-2 px-5 py-3 hover:border-accent hover:text-ink transition-colors rounded-[var(--radius)] disabled:opacity-50"
                >
                  {state === "loading" ? "Joining…" : "Join waitlist →"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
