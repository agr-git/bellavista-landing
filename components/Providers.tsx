"use client";

/**
 * Client-side providers wrapper.
 * Wraps the app in NextAuth's SessionProvider so any client component
 * can call useSession() without an extra fetch.
 */

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
