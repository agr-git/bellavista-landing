# S1 Ship retrospective — Bellavista Landing

**Date:** 2026-07-13  
**Scope:** Ship closure artifacts and production-readiness truth state for the Bellavista Landing MVP.  
**Related issue:** #6 — Ship closure documentation.

## Status

Ship is **in progress**, not complete. The repository contains the V1 product and deployment artifacts, but production must still be reconciled with `main` before the project can be declared fully shipped.

## What changed in this closure pass

- README was rewritten from early-build language to current operational state.
- Case-study artifact was created at `docs/case-study.md`.
- Document Registry was updated with the Ship artifacts and current open gates.
- PLAN status was reconciled to show Build complete, Validate/Ship in progress.

## Evidence available before final V1 gate

- Public production root is reachable over HTTPS.
- Repository `main` builds locally with the V1 routes present.
- Auth/members routes exist in `main` but are not live in production yet.
- TLS runbook and certificate-check script exist.
- Notion task contamination around S1 retrospective was already removed during grooming; this repo document contains only Bellavista Landing scope.

## Open gates

1. **Production/auth reconciliation** — issue #1. Production must expose `/login`, `/members`, `/privacy`, `/terms`, and NextAuth provider/session endpoints from `main`.
2. **Lead funnels** — issue #2. Resend + Notion production remediation is deferred while the PM decision is pending.
3. **V1 evidence** — issue #3. Validation report must mark Resend/Notion production E2E as `DEFERRED`, not pass/fail.
4. **Social preview** — issue #4. OG image and metadata need merge and post-deploy preview validation.
5. **Dependency remediation** — issue #5. High/critical advisories must be remediated or accepted with rationale.

## Lessons

- GitHub should remain the technical backlog. Notion is useful for project status, ownership, and human context, but duplicating technical acceptance criteria in two places creates drift.
- Ship documentation should not claim completion before production evidence exists. A truthful `in progress` artifact is more useful than a polished but inaccurate launch story.
- Resend/Notion work must stay separate from auth reconciliation and V1 validation because it has its own PM/product decision pending.

## Next action

Finish issues #1, #4, #5, then run issue #3 validation with issue #2 explicitly deferred. Revisit this retrospective after the approved production deploy and update status from `in progress` to `complete` only when evidence supports it.
