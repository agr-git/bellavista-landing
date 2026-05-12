/**
 * /members — member dashboard.
 *
 * Phase 1: welcome shell with tier preview cards.
 * Phase 2 adds: Substack journal cards (Lane E) + waitlist signup flow (Lane C).
 */

import { requireUser } from "@/lib/auth";
import TierCards from "@/components/members/TierCards";
import JournalCards from "@/components/members/JournalCards";
import { getRecentPosts } from "@/lib/substack";
import { getUserByEmail } from "@/lib/supabase";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const session = await requireUser();
  const email = session.user?.email ?? "";
  const name = session.user?.name ?? email.split("@")[0];

  // Fetch join date (best-effort — null if Supabase not configured)
  const dbUser = email ? await getUserByEmail(email) : null;
  const memberSince = dbUser?.created_at
    ? new Date(dbUser.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : null;

  // Fetch Substack posts (cached, graceful fallback on error/missing URL)
  const posts = await getRecentPosts(6);

  return (
    <>
      <div
        className="px-6 md:px-10 max-w-[1280px] mx-auto"
        style={{ paddingBlock: "clamp(64px, 10vh, 120px)" }}
      >
        {/* Welcome hero */}
        <section className="mb-16">
          <p className="font-mono text-meta uppercase tracking-[0.2em] text-accent mb-3">
            Members area
          </p>
          <h1 className="font-serif text-h1 leading-[1] text-ink mb-4">
            Welcome back,{" "}
            <em className="italic text-accent-2">{name}</em>.
          </h1>
          {memberSince && (
            <p className="font-mono text-meta text-ink-3">
              Member since {memberSince}
            </p>
          )}
        </section>

        {/* Journal section */}
        <section className="mb-20">
          <div className="flex items-baseline justify-between gap-4 mb-8">
            <h2 className="font-serif text-h3 text-ink">From the field log</h2>
            <a
              href={process.env.NEXT_PUBLIC_SUBSTACK_URL ?? "https://substack.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-meta uppercase tracking-[var(--ls-meta)] text-accent hover:text-accent-2 transition-colors"
            >
              All posts ↗
            </a>
          </div>
          <JournalCards posts={posts} />
        </section>

        {/* Tier showcase */}
        <section className="mb-20">
          <h2 className="font-serif text-h3 text-ink mb-3">Coffee access tiers</h2>
          <p className="font-sans text-body text-ink-2 leading-relaxed mb-8 max-w-[600px]">
            The Washed subscription is live. Honey, Natural, and On-demand are
            coming next — join the waitlist for early access.
          </p>
          <TierCards userEmail={email} />
        </section>
      </div>

      <Footer />
    </>
  );
}
