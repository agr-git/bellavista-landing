/**
 * lib/auth.ts — NextAuth v4 config (Google OAuth + Supabase user sync).
 *
 * Strategy: JWT sessions (no DB session table).
 * Admin: any user whose email matches ADMIN_EMAIL env var.
 * User store: bv_users table in Supabase (upserted on every sign-in).
 *
 * Exported helpers:
 *   authOptions   — pass to NextAuth() and getServerSession()
 *   getSession()  — get the current session in Server Components / Route Handlers
 *   requireUser() — redirect to /login if not authenticated
 *   requireAdmin()— redirect to / if not admin
 */

import type { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { upsertUser } from "@/lib/supabase";

// ─── NextAuth options ─────────────────────────────────────────────────────────

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          // Request email + profile so we get name + picture
          scope: "openid email profile",
        },
      },
    }),
  ],

  callbacks: {
    /** Sync the user to Supabase on first sign-in and any subsequent sign-in. */
    async signIn({ user }) {
      if (!user.email) return false; // reject sign-ins without an email
      try {
        await upsertUser({
          email: user.email,
          name: user.name,
          picture_url: user.image,
        });
      } catch (err) {
        // Log but don't block login — the site still works without Supabase sync.
        console.error("[auth] Supabase upsert failed:", err);
      }
      return true;
    },

    /** Embed email + isAdmin into the JWT so middleware can read them at the edge. */
    async jwt({ token, user, account }) {
      if (user?.email) {
        token.email = user.email;
        token.name = user.name ?? token.name;
        token.picture = user.image ?? token.picture;
      }
      if (account) {
        // Only compute isAdmin when the account is first linked (login event).
        token.isAdmin =
          user?.email?.toLowerCase() ===
          process.env.ADMIN_EMAIL?.toLowerCase();
      }
      return token;
    },

    /** Expose email + isAdmin on the session object for server components. */
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

/**
 * Get the current NextAuth session in a Server Component or Route Handler.
 * Returns null when unauthenticated.
 */
export async function getSession(): Promise<SessionWithRole | null> {
  const session = await getServerSession(authOptions);
  return (session as SessionWithRole) ?? null;
}

/**
 * Require an authenticated user. Redirects to /login if not signed in.
 * Use at the top of any members-only Server Component.
 */
export async function requireUser(): Promise<SessionWithRole> {
  const session = await getSession();
  if (!session) redirect("/login?callbackUrl=" + encodeURIComponent("/members"));
  return session;
}

/**
 * Require admin access. Redirects to / if not the admin email.
 * Use at the top of any admin-only Server Component.
 */
export async function requireAdmin(): Promise<SessionWithRole> {
  const session = await getSession();
  if (!session) redirect("/login?callbackUrl=" + encodeURIComponent("/admin"));
  if (!session.isAdmin) redirect("/");
  return session;
}
