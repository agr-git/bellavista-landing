# Retrospective — DEPLOY_PHASE_A (Option A)

**Date:** 2026-04-24
**Phase:** Effectively the execution of B11_INFRA on the live Lightsail VPS.
**Outcome:** ✅ Site reachable at `http://bellavista.test/` (pre-DNS validation). n8n unaffected.

---

## TL;DR

We deployed Bellavista behind the **same edge nginx** that was already serving n8n, instead of bringing up our own nginx on :80/:443. Pre-flight found n8n's stack (`/opt/automation/`) already owned both ports. Three paths were possible: share the edge (A), alternate ports (B), or replace the edge (C). We chose **A** because it lands the production architecture immediately, forces no later migration, and nginx's `-t` + atomic-reload semantics make the "touching a shared file" risk small and recoverable.

The one late-breaking surprise: the `.co` TLD is on the browser HSTS preload list, so the planned `bellavista-coffee.com.co` hostname cannot be served over HTTP or with a self-signed cert — Chrome/Arc/Safari refuse to let the user bypass. Pivoted to a `bellavista.test` alias (RFC-reserved, not preloaded) for pre-DNS staging. This dissolves in S1 when real DNS + Let's Encrypt land.

---

## What landed on the server

```
/srv/bellavista/                            ← our stack
  ├── docker-compose.yml                    ← drops `nginx` service; joins automation_automation as external
  ├── .env                                  ← placeholders (real creds land at S1_CREDS)
  └── <git clone of bellavista-landing>

/opt/automation/                            ← n8n stack (NOT OURS — never edit compose)
  ├── docker-compose.yml                    ← n8n + nginx services; untouched
  └── nginx/conf.d/
      ├── n8n.conf                          ← one word added: `listen 80 default_server;`
      ├── n8n.conf.backup-20260424-023750   ← byte-for-byte pre-edit backup
      ├── n8n.conf.sedbak                   ← sed -i's automatic backup (belt + suspenders)
      ├── bellavista.conf                   ← NEW — our server block
      ├── bellavista.conf.backup-20260424-024237   ← backup before .test alias added
      └── bellavista.conf.sedbak            ← sed backup of same
```

Running containers:
```
bellavista-app    bellavista-app:latest    Up     3000/tcp  (internal only)
nginx             nginx:alpine             Up     :80 :443  (edge, n8n's stack)
n8n               docker.n8n.io/...        Up     5678/tcp  (internal, behind edge)
```

Routing rules (effective):
```
:80 + Host: bellavista.test                → Bellavista
:80 + Host: bellavista-coffee.com.co       → Bellavista   (ready for DNS flip)
:80 + Host: www.bellavista-coffee.com.co   → Bellavista
:80 + any other Host                       → n8n (301 → https)
:443 + any Host                            → n8n (only :443 block that exists)
```

---

## Decisions made this session

### Option A vs B vs C (architecture)

Framed to Alejo as a PM-style program decision:

| | A — share edge | B — alt ports | C — replace edge |
|---|---|---|---|
| Time to land | 45–60 min | 10 min | 2+ hrs |
| Risk to n8n | Low (additive shared config) | Zero | High |
| Rework before launch | None | Required migration | None |
| End-state URL | Clean domain | `:8080` | Clean domain |
| TLS path | Rides existing cert pipeline | Awkward | Rides existing |

Chose A. B guarantees rework; C risks the running neighbor.

### Private vs public repo

Repo started private → server `git clone` over HTTPS failed prompting for creds. Three fixes (public / deploy key / PAT). Alejo chose **public for now, flip back private post-launch** — the code is a marketing site with no secrets; .env stays on server.

### `.co` HSTS pivot

Unexpected: attempted to validate at `http://bellavista-coffee.com.co` (via `/etc/hosts`). Arc/Chrome upgraded to HTTPS due to HSTS preload on `.co` (hardcoded in browser since 2017), hit the n8n IP cert → `ERR_CERT_AUTHORITY_INVALID` → "proceed anyway" hidden because of HSTS. **Cannot be bypassed in the browser.** Pivoted to an RFC-reserved `bellavista.test` alias (added to nginx server_name list alongside the real domain). Real domain still routes server-side; it will just become the primary once DNS + LE land in S1.

---

## Risk mitigation pattern (reusable)

Every server-side edit followed the same shape — worth codifying for S1_TLS_CUTOVER:

1. `nginx -t` baseline (prove current config is valid before touching).
2. `cp` the file(s) being edited to a **timestamped backup** (`*.backup-YYYYMMDD-HHMMSS`).
3. Use `sed -i.sedbak` so we get a second-layer backup automatically.
4. Make the edit.
5. `diff` old vs new — confirm exactly what changed.
6. `nginx -t` on the NEW config — **if fails, script auto-rolls back** and exits non-zero.
7. `nginx -s reload` (atomic; in-flight connections preserved).
8. Curl-verify both tenants independently.
9. Print the rollback command so the human can revert without digging.

This inverted the default deploy ergonomic (ship-and-hope → prove-and-commit).

---

## What didn't go according to plan

- **Docker Compose's "nginx" service removed pre-deploy** — the original compose had our own nginx. Had to refactor to Option A shape (drop nginx service, attach app to external `automation_automation` network). Landed cleanly in commit `a964b1e`.
- **First build failed on missing `public/` directory** — Dockerfile's runner stage does `COPY /app/public`. We didn't have one. Fixed with `public/.gitkeep` in `65d75d4`. Rebuild ~83 s. Next.js compile itself was fine.
- **Shell's backgrounded RAM logger exited non-zero under SIGTERM** — cosmetic, the build output made clear the image was built. Exit code 143 can be ignored when output shows success.
- **`ubuntu` user not in `docker` group** — needed `sudo usermod -aG docker ubuntu` + new SSH session. Should be baked into the new `docs/deploy.md`.

---

## Open follow-ups (tracked in Notion)

| Notion task | Why |
|---|---|
| DOCS_DEPLOY_UPDATE | `docs/deploy.md` still describes Option B. Rewrite for Option A. |
| DEV_CLEANUP | Delete `/app/(dev)/` routes (`/scrolly`, `/tokens`) before S1. |
| DEV_ROBOTS | Add `robots.txt` + `sitemap.xml` before S1. |
| S1_TLS_CUTOVER | Depends on S1_DNS. Let's Encrypt + :443 block + HTTP→HTTPS redirect + drop `.test` alias. Reuse the risk-mitigation pattern above. |
| V1_VALIDATE | Lighthouse, cross-browser, **iOS Safari sticky scrolly** (B6 risk, now testable on real URL). |

Reduced-motion Framer gate is still a B6 follow-up — should be verified as part of V1.

---

## For the next session

Read in order:
1. `/CLAUDE.md` (≤200 lines, surgical context).
2. `/PLAN.md` "Current status" block + "Phase 2 — completed checkpoints summary".
3. This retrospective.

Minimum context to resume:
- Server is reachable at `44.192.98.134` with `~/.ssh/` key (Alejo: `Lightsail_Autonomia.pem`).
- Stack is up, site validated at `http://bellavista.test/` with `/etc/hosts` override.
- Next natural checkpoint is V1_VALIDATE **after content + design v2 land** (owner: Alejo, coarse-grained Notion tasks in place).
- B10 (admin auth) is **parked by explicit request** — do not resume it without asking.
- Credential tasks (Resend, Notion) are parked for S1_CREDS at cutover, per project guidance — do not create pre-cutover env-wiring sub-tasks.
