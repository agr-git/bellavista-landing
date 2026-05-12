/**
 * /admin/members — read-only members viewer.
 * Shows all signed-in users, sorted by join date (newest first).
 */

import { requireAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MembersAdminPage() {
  await requireAdmin();

  const { data, error } = await supabase
    .from("bv_users")
    .select("id, email, name, created_at")
    .order("created_at", { ascending: false });

  const users = data ?? [];

  return (
    <div>
      <div className="mb-10">
        <Link
          href="/admin"
          className="font-mono text-meta uppercase tracking-[var(--ls-meta)] text-ink-3 hover:text-accent transition-colors"
        >
          ← Admin
        </Link>
        <h1 className="font-serif text-h2 text-ink mt-2">Members</h1>
        <p className="font-mono text-meta text-ink-3 mt-1">
          {users.length} total
        </p>
      </div>

      {error && (
        <div className="border border-line rounded-[var(--radius)] p-6 text-ink-2 mb-8">
          <p className="font-mono text-label text-accent mb-1">Supabase error</p>
          <p className="text-small">{error.message}</p>
        </div>
      )}

      {users.length === 0 && !error && (
        <p className="text-small text-ink-3 font-mono">No members yet.</p>
      )}

      {users.length > 0 && (
        <ul className="border border-line rounded-[var(--radius)] divide-y divide-line">
          {users.map((user: { id: string; email: string; name: string | null; created_at: string }) => (
            <li
              key={user.id}
              className="p-4 flex flex-wrap items-baseline justify-between gap-3"
            >
              <div>
                <span className="text-ink">{user.email}</span>
                {user.name && (
                  <span className="ml-3 text-small text-ink-3">
                    ({user.name})
                  </span>
                )}
              </div>
              <time className="font-mono text-meta text-ink-3">
                Joined {user.created_at.slice(0, 10)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
