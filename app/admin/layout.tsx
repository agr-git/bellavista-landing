import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-bg text-ink">
      <div className="max-w-[1200px] mx-auto px-8 pt-24 pb-20">{children}</div>
    </main>
  );
}
