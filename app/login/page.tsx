/**
 * /login — Google OAuth entry point.
 *
 * Single CTA: "Continue with Google". No username/password form.
 * On success, NextAuth redirects to ?callbackUrl (default: /members).
 *
 * Uses the existing token system (theme-cream surface, accent CTA pattern).
 */

import type { Metadata } from "next";
import GoogleSignInButton from "./GoogleSignInButton";

export const metadata: Metadata = {
  title: "Sign in · Bellavista Coffee",
  description: "Sign in to your Bellavista Coffee member account.",
  robots: { index: false, follow: false },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  const callbackUrl = searchParams.callbackUrl ?? "/members";
  const errorMsg =
    searchParams.error === "OAuthAccountNotLinked"
      ? "That email is already linked to a different provider."
      : searchParams.error
      ? "Sign-in failed. Please try again."
      : null;

  return (
    <main
      className="min-h-screen theme-cream flex items-center justify-center px-6"
      style={{ paddingBlock: "clamp(80px, 12vh, 160px)" }}
    >
      <div className="w-full max-w-[400px]">
        {/* Header */}
        <p className="font-mono text-meta uppercase tracking-[0.2em] text-accent mb-4">
          Bellavista · Members
        </p>
        <h1 className="font-serif text-h2 leading-[1.1] text-ink mb-3">
          Sign in.
        </h1>
        <p className="font-sans text-body text-ink-2 leading-relaxed mb-10">
          Access your member journal, track our processing seasons, and join
          waitlists for upcoming coffee lots.
        </p>

        {/* Error */}
        {errorMsg && (
          <p
            role="alert"
            className="font-mono text-label text-accent border border-accent/30 rounded-[var(--radius)] px-4 py-3 mb-6"
          >
            {errorMsg}
          </p>
        )}

        {/* OAuth button */}
        <GoogleSignInButton callbackUrl={callbackUrl} />

        {/* Fine print */}
        <p className="mt-8 font-mono text-meta text-ink-3 leading-relaxed">
          By signing in you accept our{" "}
          <a href="/privacy" className="underline hover:text-ink transition-colors">
            privacy policy
          </a>{" "}
          and{" "}
          <a href="/terms" className="underline hover:text-ink transition-colors">
            terms
          </a>
          .
        </p>
      </div>
    </main>
  );
}
