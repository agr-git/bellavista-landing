"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SimpleSignInForm({
  callbackUrl,
}: {
  callbackUrl: string;
}) {
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const result = await signIn("credentials", {
      email,
      accessCode,
      callbackUrl,
      redirect: false,
    });

    setPending(false);

    if (result?.ok) {
      window.location.assign(result.url ?? callbackUrl);
      return;
    }

    setError(
      "We could not verify that email. Use the admin email or an existing member email."
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-2 block font-mono text-label uppercase tracking-[var(--ls-label)] text-ink-3">
          Email
        </span>
        <input
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-[var(--radius)] border border-ink/20 bg-bg px-4 py-3 font-sans text-body text-ink outline-none transition-colors focus:border-accent"
          placeholder="you@example.com"
        />
      </label>

      <label className="block">
        <span className="mb-2 block font-mono text-label uppercase tracking-[var(--ls-label)] text-ink-3">
          Access code
        </span>
        <input
          type="password"
          autoComplete="current-password"
          value={accessCode}
          onChange={(event) => setAccessCode(event.target.value)}
          className="w-full rounded-[var(--radius)] border border-ink/20 bg-bg px-4 py-3 font-sans text-body text-ink outline-none transition-colors focus:border-accent"
          placeholder="Leave blank unless one was provided"
        />
      </label>

      {error && (
        <p
          role="alert"
          className="font-mono text-label text-accent border border-accent/30 rounded-[var(--radius)] px-4 py-3"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-ink text-bg font-mono text-label uppercase tracking-[var(--ls-label)] py-4 px-6 rounded-[var(--radius)] hover:bg-ink-2 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
      >
        {pending ? "Checking..." : "Enter members area"}
      </button>
    </form>
  );
}
