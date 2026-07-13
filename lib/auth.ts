/**
 * lib/auth.ts — simple credentials auth backed by Supabase user records.
 *
 * Strategy: HTML email form → NextAuth Credentials provider → server-side
 * Supabase check/upsert → JWT session. No Google OAuth in this PR; OAuth was
 * split to issue #12.
 *
 * Admin: any user whose email matches ADMIN_EMAIL env var.
 * Member access: ADMIN_EMAIL always passes; non-admin users must already exist
 * in bv_users. Optional MEMBERS_ACCESS_CODE can add a shared-code gate without
 * exposing Supabase credentials to the client.
 */

import type { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getUserByEmail, upsertUser } from "@/lib/supabase";

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

function displayName(email: string, storedName?: string | null): string {
  return storedName?.trim() || email.split("@")[0] || "Member";
}

function isAdminEmail(email: string): boolean {
  return email === process.env.ADMIN_EMAIL?.trim().toLowerCase();
}

// ─── NextAuth options ─────────────────────────────────────────────────────────

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email access",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        accessCode: {
          label: "Access code",
          type: "password",
          placeholder: "Optional access code",
        },
      },
      async authorize(credentials) {
        const email = normalizeEmail(credentials?.email);
        if (!email) return null;

        const configuredCode = process.env.MEMBERS_ACCESS_CODE?.trim();
        if (configuredCode) {
          const submittedCode = credentials?.accessCode?.trim() ?? "";
          if (submittedCode !== configuredCode) return null;
        }

        const admin = isAdminEmail(email);
        const dbUser = await getUserByEmail(email);

        // Admin gets a bootstrap path so the first operator can enter even when
        // bv_users is still empty. Everyone else must already have a Supabase row.
        if (!admin && !dbUser) return null;

        if (admin && !dbUser) {
          await upsertUser({ email, name: "Bellavista Admin", picture_url: null });
        }

        return {
          id: dbUser?.id ?? email,
          email,
          name: displayName(email, dbUser?.name),
          image: dbUser?.picture_url ?? null,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
        token.name = user.name ?? token.name;
        token.picture = user.image ?? token.picture;
      }
      if (typeof token.email === "string") {
        token.isAdmin = isAdminEmail(token.email.toLowerCase());
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string | null;
        (session as SessionWithRole).isAdmin = !!token.isAdmin;
      }
      return session;
    },
  },
};

// ─── Extended session type ────────────────────────────────────────────────────

export interface SessionWithRole extends Session {
  isAdmin: boolean;
}

// ─── Server-side helpers ──────────────────────────────────────────────────────

export async function getSession(): Promise<SessionWithRole | null> {
  const session = await getServerSession(authOptions);
  return (session as SessionWithRole) ?? null;
}

export async function requireUser(): Promise<SessionWithRole> {
  const session = await getSession();
  if (!session) redirect("/login?callbackUrl=" + encodeURIComponent("/members"));
  return session;
}

export async function requireAdmin(): Promise<SessionWithRole> {
  const session = await getSession();
  if (!session) redirect("/login?callbackUrl=" + encodeURIComponent("/admin"));
  if (!session.isAdmin) redirect("/");
  return session;
}
