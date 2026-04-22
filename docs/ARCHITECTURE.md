# Architecture — Bellavista Coffee Landing Page

**Status:** Locked (Phase 1 — Design)
**Last updated:** 2026-04-21

---

## System overview

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser                                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Next.js 14 App Router (SSG + RSC + client islands)     │  │
│  │                                                          │  │
│  │  Pages (SSG/RSC)          Client components             │  │
│  │  ├─ / (landing)           ├─ MotionWrapper (animation)  │  │
│  │  ├─ /journal/[slug]       ├─ Nav (IntersectionObserver) │  │
│  │  ├─ /admin (auth-gated)   ├─ ChapterScrolly             │  │
│  │  └─ /admin/login          └─ Form UIs + Modal           │  │
│  │                                                          │  │
│  │  API routes               Content (MDX)                 │  │
│  │  └─ POST /api/leads       └─ /content/journal/*.md      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         │ POST /api/leads             │ reads at build time
         ▼                             ▼
  ┌─────────────┐              ┌────────────────┐
  │   Resend    │              │ /content/*.md  │
  │  (email)    │              │ (Obsidian edits│
  │  PRIMARY    │              │  locally)      │
  └─────────────┘              └────────────────┘
         │ best-effort
         ▼
  ┌──────────────────┐
  │  Notion API      │
  │  Resources DB    │
  │  (form writes)   │
  └──────────────────┘

  ┌─────────────────────────────────────────────────┐
  │  AWS Lightsail VPS (2GB RAM, 2 vCPU, 60GB SSD) │
  │                                                 │
  │  docker-compose.yml (bellavista)                │
  │  ┌──────────────────┐  ┌───────────────────┐   │
  │  │  bellavista-app  │  │  bellavista-nginx  │   │
  │  │  Next.js :3000   │  │  :80 / :443        │   │
  │  │  (internal only) │  │  + Let's Encrypt   │   │
  │  └──────────────────┘  └───────────────────┘   │
  │                                                 │
  │  docker-compose.n8n.yml (separate, untouched)   │
  │  ┌──────────┐  shared network (read-only)       │
  │  │   n8n    │                                    │
  │  └──────────┘                                    │
  └─────────────────────────────────────────────────┘
```

---

## Data flows

### 1. Page render (marketing content)

```
Build time:
  /content/journal/*.md
    → gray-matter parses frontmatter
    → Zod validates schema
    → next-mdx-remote compiles body
    → RSC renders HTML

Runtime: fully static (ISR optional later)
```

### 2. Form submission

```
User fills form → POST /api/leads
  → validate with Zod (type, fields, honeypot check)
  → rate limit: 5 req/min per IP
  → Resend.send() — BLOCKING
      success → continue
      failure → return 500 (user sees error)
  → Notion.createPage(Resources DB) — NON-BLOCKING
      success → logged
      failure → logged, does NOT affect response
  → return 200 + success message
```

### 3. Admin auth

```
POST /admin/login → NextAuth Credentials provider
  → bcrypt.compare(password, ADMIN_PASSWORD_HASH)
  → issue JWT (signed with NEXTAUTH_SECRET)
  → set httpOnly cookie

Middleware (middleware.ts):
  → on every /admin/* request
  → verify JWT
  → redirect to /admin/login if invalid/expired
```

### 4. Journal visibility

```
/lib/journal.ts
  → reads all /content/journal/*.md
  → checks frontmatter.visibility
    'public'  → included in public feed + /journal/[slug]
    'private' → only visible behind admin auth
  → /journal/[slug] for private slugs:
    no session → 404 (not 403 — don't confirm the post exists)
    valid session → render
```

### 5. Deployment

```
Option A — on-server build (primary):
  Local: git push origin main
  Server: ssh → git pull → docker build → docker compose up -d
  Monitor: watch docker stats (flag if RAM >85%)

Option B — CI/CD fallback (B11B, if A OOMs):
  git push → GitHub Actions trigger
  → docker build → push to ghcr.io/[user]/bellavista:latest
  → SSH to Lightsail → docker compose pull → up -d
```

---

## Technology decisions

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 14 App Router | RSC for static content, API routes for forms, single deploy unit |
| Language | TypeScript | Type safety for MDX schema, form payloads, API responses |
| Styling | Tailwind (layout) + CSS custom properties (tokens) | Tailwind for structure; CSS vars for visual updates (one-line color changes) |
| Animation | Framer Motion | Single `<MotionWrapper>` client boundary — all other components stay RSC |
| Content | MDX + gray-matter + Zod | Local files, Obsidian-editable, Zod prevents bad frontmatter reaching prod |
| Forms / email | Resend | Reliable transactional email; free tier sufficient for v1 lead volume |
| Form storage | Notion Resources DB | Operator already uses Notion; zero extra tooling required |
| Auth | NextAuth JWT + Credentials | No DB required; single admin account; JWT httpOnly cookies |
| Deploy | Docker + Nginx + Lightsail | Existing VPS, lowest operational cost, n8n already running |
| SSL | Let's Encrypt / Certbot | Free, auto-renewing, Nginx-native |

---

## Scaling notes (post-v1, out of scope)

- Video CDN: upgrade from self-hosted Nginx to Cloudinary or Mux if bandwidth grows
- CMS: MDX + Obsidian scales to ~100 posts; beyond that consider Contentlayer or Sanity
- Database: Notion write-only is intentional; if analytics or CRM needed, add Supabase
- Auth: single-admin JWT is intentional; multi-user would need DB-backed sessions
- i18n: locale routing stubs exist; wire up once ES copy delivered
