# PROJECT BLUEPRINT
## Bellavista Coffee — Landing Page MVP

**Framework:** AutonomIA+ v3.4
**Portfolio:** BVC (Bellavista Coffee)
**Program:** Cross Program
**Sprint:** 2026-04-21 → 2026-04-26
**Notion project:** https://www.notion.so/349ca4b1fd248143a900ec8df7f719b8
**Target domain:** www.bellavista-coffee.com.co

---

## Problem

Bellavista Coffee is a specialty coffee farm in Manizales, Colombia (1,300 MASL) with no web presence. The producer needs a site that:
1. Tells the farm's story cinematically — from "code to coffee trees"
2. Drives four lead-gen funnels (B2B samples, consumer waitlist, farm-stay inquiries, partner contact)
3. Hosts a dual-visibility journal (public field notes + private experiment log)
4. Is manageable by a solo non-technical operator after handoff

## Stakeholders

| Stakeholder | Goal | Success signal |
|---|---|---|
| Producer (Alejo) | Showcase farm, generate leads, manage journal | All 4 funnels live, admin works |
| B2B roasters | Evaluate green coffee, request samples | Sample inquiry form → email in <5 min |
| Direct consumers | Discover roasted drops, join waitlist | Waitlist form → confirmation email |
| Farm-stay guests | Learn about stay, book dates | Booking CTA or inquiry form |
| Partners / investors | Open a conversation | Contact surface |

## Success criteria

- [ ] Site live on HTTPS at production domain
- [ ] All 4 lead-gen forms deliver email to producer and write to Notion Resources DB
- [ ] Journal: public posts visible to all; private posts 404 for unauthenticated
- [ ] Admin: producer can log in, view all entries, read form submissions
- [ ] Lighthouse: Performance ≥90, Accessibility ≥95, SEO ≥95
- [ ] Cross-browser: Chrome, Safari (iOS + desktop), Firefox, mobile Chrome

## Constraints

| Constraint | Detail |
|---|---|
| VPS RAM | 2GB — on-server Next.js build may OOM → B11B CI/CD fallback |
| n8n coexistence | n8n runs on same Lightsail instance; must not disrupt it |
| No Notion on read path | Notion API is write-only (form submissions). Content via MDX |
| Solo operator | Admin UX must be minimal; no CMS training required |
| English-only v1 | i18n routing stubbed but disabled; ES copy TBD |
| No payments v1 | Roasted drops = waitlist only; no cart |
| Budget | No paid CDN v1; self-host media on Lightsail/Nginx |

## Architecture (locked)

See `docs/ARCHITECTURE.md` for full diagram. Summary:

```
Browser
  └─ Next.js 14 App Router (SSG / RSC)
       ├─ /content/**/*.md  ← Obsidian (local MDX editor)
       ├─ /app/api/leads    ← Resend (email-first) → Notion Resources DB
       ├─ /admin/*          ← NextAuth JWT (Credentials)
       └─ Docker + Nginx on AWS Lightsail
            └─ n8n (separate compose, shared network, read-only)
```

**Locked decisions** (ADRs in `/docs/decisions/`):
- MDX + Obsidian over Notion-as-CMS → ADR-001
- CSS custom properties ↔ Tailwind bridge → ADR-002
- Email-first form fallback → ADR-003
- On-server build with CI/CD fallback → ADR-004
- Self-hosted video v1 → ADR-005

## Phase status

| Phase | Name | Status |
|---|---|---|
| 0 | Discover | ✅ Complete |
| 1 | Design | 🟡 In Progress |
| 2 | Build | ⬜ |
| 3 | Validate | ⬜ |
| 4 | Ship | ⬜ |

## Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Build OOM on 2GB VPS | High | B11B: GitHub Actions + GHCR fallback |
| Chapter scrolly fails on iOS Safari | High | Isolated lab page before integration |
| n8n disruption during deploy | High | Separate docker-compose.yml |
| Form silent failure | Medium | Email-first; Notion errors logged, non-blocking |
| Bad MDX breaks prod build | Medium | Zod prebuild validator (`scripts/validate-content.ts`) |
| Video hosting cost | Low | Self-host on Lightsail, Nginx long-cache headers |

## Out of scope (v1)

- Spanish copy (wire-up ready, copy TBD)
- E-commerce / payment processing
- Third-party booking platform integration (inquiry form fallback only)
- Analytics (Plausible optional post-ship)
- OG image + favicon (post-ship)
- CMS UI for content editing (Obsidian + git push is the editorial workflow)
