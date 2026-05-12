/**
 * Members layout — auth gate + nav chrome.
 * The middleware already redirects unauthenticated users to /login,
 * but requireUser() here gives defence-in-depth at the RSC layer.
 */

import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth";
import MembersNav from "./MembersNav";

export default async function MembersLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireUser();

  return (
    <div className="min-h-screen bg-bg text-ink">
      <MembersNav
        email={session.user?.email ?? ""}
        name={session.user?.name ?? ""}
        isAdmin={session.isAdmin}
      />
      <main>{children}</main>
    </div>
  );
}
