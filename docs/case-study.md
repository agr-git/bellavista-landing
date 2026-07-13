# Bellavista Landing — Ship case study

## Executive summary

Bellavista Landing moved from a no-web-presence farm story to a production-ready storytelling site for Bellavista Coffee: farm narrative, cinematic media, public field notes, lead surfaces, Docker/Lightsail deployment, TLS automation, and a members/auth module in `main`.

The release is not being declared fully shipped until the remaining production gates close. Production currently serves the public landing site, while auth/members reconciliation, V1 evidence, social metadata, dependency remediation, and final documentation are tracked as GitHub issues.

## Product problem

Bellavista Coffee needed a web property that could do three jobs without becoming a heavy CMS project:

1. Tell the farm story with enough texture to make the operation credible.
2. Capture demand from roasters, consumers, stay guests, and partners.
3. Give Alejo a maintainable editorial path for field notes and future member content.

## Architecture choices

- Next.js App Router with MDX content for fast static public pages.
- CSS custom properties as the design-token source of truth.
- Resend-first form delivery with Notion as best-effort backup.
- Docker deployment on Lightsail, sharing edge infrastructure without touching the separate n8n stack.
- NextAuth Google OAuth with Supabase user/waitlist/CMS tables for the members module.

## What shipped in repository scope

- Full public storytelling landing page.
- Journal schema, reader, public entries, and dynamic journal pages.
- Lead API route, email wrapper, Notion backup wrapper, and rate limiter.
- Brand v3 assets and guidelines.
- Dockerfile, compose file, nginx references, TLS runbook, and certificate check script.
- Google OAuth/Supabase members code path in `main`.
- Privacy and terms pages required for OAuth review.

## Remaining release gates

- Issue #1: Production must be reconciled with `main` and auth/members must be enabled through Google OAuth, Supabase migration, VPS env, deployment, and smoke tests.
- Issue #2: Resend + Notion production lead funnels are intentionally deferred pending PM decision.
- Issue #3: V1 validation evidence must be published with deferred Resend scope clearly marked.
- Issue #4: Social image and metadata must be merged and verified.
- Issue #5: Dependency remediation must be reviewed and merged.
- Issue #6: This documentation package must be reviewed.

## Results so far

- Local baseline build, lint, and content validation pass on `main`.
- Production root responds over HTTPS.
- TLS renewal is documented and automated.
- Production currently does not expose routes present in `main` such as `/login`, `/members`, `/privacy`, and `/terms`; this is the central gap behind issue #1.

## Risks and mitigations

- Production/auth gap: mitigated by issue #1 readiness runbook and smoke-test gates.
- Lead-funnel uncertainty: mitigated by explicitly deferring issue #2 rather than mixing it into V1.
- Dependency drift: tracked by issue #5; high/critical advisories must be addressed or explicitly accepted before release.
- Operational coupling with n8n: deployment docs continue to forbid touching the shared n8n compose stack.

## Reuse pattern

This project is a useful template for future farm or specialty-product microsites when the product needs story, field notes, lightweight lead capture, and a small authenticated layer without introducing a full CMS.
