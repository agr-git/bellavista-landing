/**
 * /terms — Terms of Service.
 * Required public terms for member access and future OAuth review.
 */

import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service · Bellavista Coffee",
  description: "Terms of use for Bellavista Coffee member accounts.",
};

const UPDATED = "May 2026";
const EMAIL = "hello@bellavistacoffee.co";

export default function TermsPage() {
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
          <h1 className="font-serif text-h1 text-ink mb-3">Terms of Service</h1>
          <p className="font-mono text-meta text-ink-3 mb-12">
            Last updated: {UPDATED}
          </p>

          <div className="space-y-10 font-sans text-body text-ink-2 leading-relaxed">
            <section>
              <h2 className="font-serif text-h3 text-ink mb-4">
                1. Acceptance of terms
              </h2>
              <p>
                By creating a member account at{" "}
                <strong>bellavista-coffee.com.co</strong> you agree to these
                terms. If you do not agree, do not use the service.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-h3 text-ink mb-4">
                2. What the service provides
              </h2>
              <p>
                The members area provides access to field journal previews,
                waitlist registration for upcoming coffee lots, and informational
                content about Bellavista Coffee&apos;s production. No purchase is
                required to create a member account in V1.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-h3 text-ink mb-4">
                3. Account responsibility
              </h2>
              <p>
                You are responsible for the security of any member access
                credentials or access codes. Notify us immediately of any
                unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-h3 text-ink mb-4">
                4. Waitlist
              </h2>
              <p>
                Joining a waitlist does not guarantee allocation of a coffee lot.
                Waitlist priority and allocation decisions rest solely with
                Bellavista Coffee. No payment is collected at the waitlist
                stage.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-h3 text-ink mb-4">
                5. Intellectual property
              </h2>
              <p>
                All content on this site — text, photography, video, data — is
                the property of Bellavista Coffee unless otherwise noted.
                Reproduction without written permission is prohibited.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-h3 text-ink mb-4">
                6. Limitation of liability
              </h2>
              <p>
                The service is provided &ldquo;as is&rdquo;. Bellavista Coffee
                makes no warranties as to availability, accuracy, or fitness for
                a particular purpose and is not liable for any damages arising
                from use of the service.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-h3 text-ink mb-4">7. Contact</h2>
              <p>
                Questions?{" "}
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
