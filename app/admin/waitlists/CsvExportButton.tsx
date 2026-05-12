"use client";

interface Row {
  tier_slug: string;
  created_at: string;
  source: string;
  bv_users: { email: string; name: string | null } | null;
}

export default function CsvExportButton({ rows }: { rows: Row[] }) {
  function handleExport() {
    const header = "tier,email,name,source,joined_at";
    const lines = rows.map((r) =>
      [
        r.tier_slug,
        r.bv_users?.email ?? "",
        r.bv_users?.name ?? "",
        r.source,
        r.created_at.slice(0, 10),
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bv-waitlists-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="font-mono text-label uppercase tracking-[var(--ls-label)] border border-line text-ink-2 px-4 py-2 hover:border-accent hover:text-ink transition-colors rounded-[var(--radius)]"
    >
      Export CSV
    </button>
  );
}
