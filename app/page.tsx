export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-ink flex items-center justify-center p-10">
      <div className="max-w-xl space-y-4">
        <p className="font-mono text-meta uppercase text-ink-3">
          Manizales · Colombia · 1,300 MASL
        </p>
        <h1 className="font-serif text-h2">
          Bellavista <em className="text-accent-2">Coffee</em>.
        </h1>
        <p className="font-sans text-body text-ink-2">
          Tokens wired (B2). Shell + nav + motion boundary land next in B3.
        </p>
        <p className="font-mono text-meta uppercase text-ink-3">
          Dev only:{" "}
          <a href="/tokens" className="text-accent underline underline-offset-4">
            /tokens
          </a>{" "}
          shows the full token system.
        </p>
      </div>
    </main>
  );
}
