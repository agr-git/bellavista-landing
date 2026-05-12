/**
 * /admin/cms/coffee — Coffee section editor.
 * Phase 3 — placeholder until CMS build.
 */

import { requireAdmin } from "@/lib/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CoffeeCmsPage() {
  await requireAdmin();

  return (
    <div>
      <Link
        href="/admin"
        className="font-mono text-meta uppercase tracking-[var(--ls-meta)] text-ink-3 hover:text-accent transition-colors"
      >
        ← Admin
      </Link>
      <h1 className="font-serif text-h2 text-ink mt-2 mb-6">Coffee CMS</h1>
      <div className="border border-line rounded-[var(--radius)] p-8 text-center">
        <p className="font-mono text-label uppercase tracking-[var(--ls-label)] text-ink-3 mb-2">
          Phase 3
        </p>
        <p className="font-sans text-body text-ink-2">
          The Coffee section editor is coming in Phase 3. For now, edit{" "}
          <code className="font-mono text-small bg-surface px-1">
            components/sections/Coffee.tsx
          </code>{" "}
          and push to GitHub.
        </p>
      </div>
    </div>
  );
}
