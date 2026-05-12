/**
 * /admin — dashboard landing.
 *
 * Phase 1: shows admin cards linking to the sub-sections.
 * Phase 3 sub-sections: CMS editors, waitlist viewer, members viewer.
 *
 * Protected by middleware (requires isAdmin in JWT).
 * We also call requireAdmin() server-side for defence-in-depth.
 */

import { requireAdmin } from "@/lib/auth";
import SignOutButton from "./SignOutButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

const CARDS = [
  {
    href: "/admin/waitlists",
    label: "Waitlists",
    description: "View tier waitlist signups.",
    emoji: "📋",
  },
  {
    href: "/admin/members",
    label: "Members",
    description: "All signed-in members.",
    emoji: "👥",
  },
  {
    href: "/admin/cms/coffee",
    label: "Coffee section",
    description: "Edit Coffee copy and images.",
    emoji: "☕",
  },
  {
    href: "/admin/cms/stay",
    label: "Stay section",
    description: "Edit Stay copy and photos.",
    emoji: "🏡",
  },
];

export default async function AdminPage() {
  const session = await requireAdmin();

  return (
    <div>
      {/* Header */}
      <header className="flex flex-wrap items-baseline justify-between gap-4 mb-12">
        <div>
          <p className="font-mono text-meta uppercase tracking-[var(--ls-meta)] text-ink-3">
            Bellavista · Admin
          </p>
          <h1 className="font-serif text-h2 text-ink mt-1">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4 text-small text-ink-2">
          <span className="font-mono text-meta">{session.user?.email}</span>
          <SignOutButton />
        </div>
      </header>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group border border-line rounded-[var(--radius)] p-6 hover:border-accent transition-colors bg-surface/40"
          >
            <div className="text-3xl mb-4">{card.emoji}</div>
            <p className="font-mono text-label uppercase tracking-[var(--ls-label)] text-ink mb-2 group-hover:text-accent transition-colors">
              {card.label}
            </p>
            <p className="font-sans text-small text-ink-2 leading-relaxed">
              {card.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Phase note */}
      <p className="mt-10 font-mono text-meta text-ink-3">
        CMS editors launch in Phase 3. Waitlists + Members are available now.
      </p>
    </div>
  );
}
