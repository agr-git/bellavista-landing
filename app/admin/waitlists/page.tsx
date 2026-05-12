/**
 * /admin/waitlists — read-only tier waitlist viewer.
 * Grouped by tier. CSV export button.
 */

import { requireAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import CsvExportButton from "./CsvExportButton";

export const dynamic = "force-dynamic";

interface WaitlistRow {
  id: string;
  tier_slug: string;
  created_at: string;
  source: string;
  bv_users: { email: string; name: string | null } | null;
}

export default async function WaitlistsPage() {
  await requireAdmin();

  const { data, error } = await supabase
    .from("bv_waitlist")
    .select("id, tier_slug, created_at, source, bv_users(email, name)")
    .order("created_at", { ascending: false });

  const rows: WaitlistRow[] = ((data ?? []) as unknown as WaitlistRow[]);

  const tiers = ["honey", "natural", "on-demand"];
  const grouped = tiers.map((tier) => ({
    tier,
    rows: rows.filter((r) => r.tier_slug === tier),
  }));

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-10">
        <div>
          <Link
            href="/admin"
            className="font-mono text-meta uppercase tracking-[var(--ls-meta)] text-ink-3 hover:text-accent transition-colors"
          >
            ← Admin
          </Link>
          <h1 className="font-serif text-h2 text-ink mt-2">Waitlists</h1>
        </div>
        {rows.length > 0 && <CsvExportButton rows={rows} />}
      </div>

      {error && (
        <div className="border border-line rounded-[var(--radius)] p-6 text-ink-2 mb-8">
          <p className="font-mono text-label text-accent mb-1">Supabase error</p>
          <p className="text-small">{error.message}</p>
        </div>
      )}

      <div className="space-y-10">
        {grouped.map(({ tier, rows: tierRows }) => (
          <section key={tier}>
            <div className="flex items-baseline gap-4 mb-4">
              <h2 className="font-mono text-label uppercase tracking-[var(--ls-label)] text-ink capitalize">
                {tier}
              </h2>
              <span className="font-mono text-meta text-ink-3">
                {tierRows.length} {tierRows.length === 1 ? "signup" : "signups"}
              </span>
            </div>

            {tierRows.length === 0 ? (
              <p className="text-small text-ink-3 font-mono">No signups yet.</p>
            ) : (
              <ul className="border border-line rounded-[var(--radius)] divide-y divide-line">
                {tierRows.map((row) => (
                  <li key={row.id} className="p-4 flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <span className="text-ink">
                        {row.bv_users?.email ?? "—"}
                      </span>
                      {row.bv_users?.name && (
                        <span className="ml-3 text-small text-ink-3">
                          ({row.bv_users.name})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-meta text-ink-3">
                        {row.source}
                      </span>
                      <time className="font-mono text-meta text-ink-3">
                        {row.created_at.slice(0, 10)}
                      </time>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
