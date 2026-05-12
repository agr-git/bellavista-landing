"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="font-mono text-label uppercase tracking-[var(--ls-label)] text-ink-3 hover:text-accent transition-colors"
    >
      Sign out
    </button>
  );
}
