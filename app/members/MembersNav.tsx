"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

interface MembersNavProps {
  email: string;
  name: string;
  isAdmin: boolean;
}

export default function MembersNav({ email, name, isAdmin }: MembersNavProps) {
  return (
    <header className="border-b border-line px-6 md:px-10 py-4 flex items-center justify-between gap-4">
      <Link
        href="/"
        className="font-serif text-[20px] leading-none text-ink hover:text-accent transition-colors"
      >
        Bellavista
      </Link>

      <div className="flex items-center gap-4 text-small">
        {isAdmin && (
          <Link
            href="/admin"
            className="font-mono text-meta uppercase tracking-[var(--ls-meta)] text-ink-3 hover:text-accent transition-colors"
          >
            Admin
          </Link>
        )}
        <span className="font-mono text-meta text-ink-3 hidden sm:inline">
          {name || email}
        </span>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="font-mono text-meta uppercase tracking-[var(--ls-meta)] text-ink-3 hover:text-accent transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
