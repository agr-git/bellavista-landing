/**
 * /privacy — Privacy Policy.
 * Required for Google OAuth consent screen verification.
 * Minimal but legally sufficient for a small-scale membership site.
 */

import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy · Bellavista Coffee",
  description: "How Bellavista Coffee collects and uses your data.",
};

const UPDATED = "May 2026";
const EMAIL = "hello@bellavistacoffee.co";

export default function PrivacyPage() {
  return (
    <>
      <main
        className="theme-cream px-6 md:px-10"
        style={{ paddingBlock: "clamp(96px, 12vh, 160px)" }}
      >
        <div className="max-w-[720px] mx-auto">
          <p className="font-mono text-meta uppercase tracking-[0.2em] text-accent mb-4">
            Bellavista Coffee
          </p>
          <h1 className="font-serif text-h1 text-ink mb-3">Privacy Policy</h1>
          <p className="font-mono text-meta text-ink-3 mb-12">
            Last updated: {UPDATED}
          </p>

          <div className="space-y-10 font-sans text-body text-ink-2 leading-relaxed">
            <section>
              <h2 className="font-serif text-h3 text-ink mb-4">
                What we collect
              </h2>
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  <strong>Account information</strong>: when you sign in with
                  Google we receive your email address, display name, and
                  profile picture.
                </li>
                <li>
                  <strong>Waitlist entries</strong>: if you join a tier
                  waitlist, we store your email and the tier you expressed
                  interest in.
                </li>
                <li>
                  <strong>Contact form submissions</strong>: messages sent
                  through our inquiry forms (coffee, stay, subscribe).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-h3 text-ink mb-4">
                How we use it
              </h2>
              <ul className="space-y-2 list-disc pl-5">
                <li>To authenticate you and maintain your member session.</li>
                <li>
                  To notify you when a coffee lot or feature you registered
                  interest in becomes available.
                </li>
                <li>To respond to direct inquiries.</li>
                <li>We do not sell your data to third parties.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-h3 text-ink mb-4">
                Third-party services
              </h2>
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  <strong>Google</strong>: sign-in authentication (Google
                  Privacy Policy applies).
                </li>
                <li>
                  <strong>Supabase</strong>: database storage for user accounts
                  and waitlist entries.
                </li>
                <li>
                  <strong>Resend</strong>: transactional email delivery.
                </li>
                <li>
                  <strong>Notion</strong>: CRM mirroring for lead management.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-h3 text-ink mb-4">
                Data retention &amp; deletion
              </h2>
              <p>
                We retain account data for as long as your account is active.
                To delete your data, email us at{" "}
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-accent hover:text-accent-2 transition-colors"
                >
                  {EMAIL}
                </a>{" "}
                and we will remove it within 30 days.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-h3 text-ink mb-4">Contact</h2>
              <p>
                Questions about this policy?{" "}
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-accent hover:text-accent-2 transition-colors"
                >
                  {EMAIL}
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
