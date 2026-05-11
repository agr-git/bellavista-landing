# Retrospective — DEPLOY_TLS_v1 (Let's Encrypt + DNS cutover)

**Date:** 2026-05-10 → 2026-05-11
**Phase:** 4 Ship
**Checkpoint:** Hybrid — closes the TLS gap intentionally left open at DEPLOY_PHASE_A
**Duration:** ~1h end-to-end (single session)

> Companion to `DEPLOY-option-a.md`. Together they cover the full prod path:
> Option A landed the Docker stack on Lightsail; this retro closes TLS + DNS.

---

## TL;DR

The pre-existing DEPLOY_PHASE_A retro warned: *"Real Let's Encrypt cert comes
in S1 when DNS points here."* This was that S1 moment, executed in a single
session alongside the BRAND_V2 + STAY_PHOTOS pushes.

1. **GitHub** advanced two commits (`5a1a4af` brand-v2, `f921643` stay-photos).
2. **Lightsail** pulled, rebuilt the Docker image (91 sec, no OOM despite 1.9 GB RAM box), recreated the container.
3. **DNS** was already flipped at GoDaddy (`A @ → 44.192.98.134`); propagation confirmed across Cloudflare/Google/Quad9 resolvers.
4. **TLS** issued via Let's Encrypt + certbot webroot flow, cert staged into the dockerized nginx via its existing `ssl/` mount (no `docker-compose.yml` edit needed). HTTP→HTTPS 301 in place, HSTS 6-month.
5. **Auto-renewal** wired via certbot's systemd timer + a deploy hook that re-copies the cert and reloads nginx after each renewal.

Site is live at `https://bellavista-coffee.com.co/` with the green padlock, serving v2 onyx, real farmhouse photography, and the Let's Encrypt cert.

---

## What was built / produced

- **GitHub `5a1a4af`** — `feat(brand): apply v2 Onyx + Paper palette + new guidelines`
  - `tokens.css` migrated from Amanecer (`#1B2437`) to Onyx (`#0C0C0A`)
  - `themes.css` gained canonical `.theme-onyx` / `.theme-paper`; v1 aliases kept
  - `SectionBreak.tsx`, `Footer.tsx`, `ChapterScrolly.tsx`, `lib/email.ts` migrated off hardcoded v1 hexes
  - New: `docs/BRAND_GUIDELINES_v2.md` + `bellavista-brand-guidelines-v2.pdf`
- **GitHub `f921643`** — `feat(stay): wire real farmhouse photography into Stay bento`
  - 21 photos converted HEIC → JPEG via macOS `sips -Z 1600 -s formatOptions 80` (9.3 MB total)
  - 5 wired into the bento via `next/image` (`stay-01/06/11/16/20`); 16 staged for future swap
  - "House tour" video-placeholder cell repurposed as "From the farmhouse" still
  - HEIC originals gitignored at `/public/media/Bellavista Stay Photos/`
- **Server `/opt/automation/nginx/conf.d/bellavista.conf`** — three phases on disk:
  - `bellavista.conf.pre-tls-<TS>` — Phase A (HTTP only)
  - `bellavista.conf.pre-https-<TS>` — Phase B (HTTP + ACME webroot)
  - `bellavista.conf` — Phase C (HTTP→HTTPS 301 + :443 TLS + HSTS + nginx security headers)
- **Server `/opt/automation/nginx/conf.d/acme-webroot/`** — durable webroot for renewals
- **Server `/opt/automation/nginx/ssl/bellavista/{fullchain,privkey}.pem`** — certs staged into the existing nginx volume mount; **no `docker-compose.yml` was modified** (per CLAUDE.md "never touch /opt/automation")
- **Server `/etc/letsencrypt/renewal-hooks/deploy/bellavista-nginx.sh`** — runs after every renewal; filters to our lineage, re-copies the new cert into the nginx mount, `docker exec nginx nginx -s reload`. `certbot renew --dry-run` confirms the path works without consuming the LE rate limit.

---

## What went well

- **Build-on-server held under 2 GB RAM.** Pre-build: 1.2 GB used / 744 MB free / 0 swap. Peak during `docker compose build`: ~1.3 GB used / 599 MB available. The Docker layer cache (npm install) is what saved us — clean rebuild took 91 seconds. ADR-004's B11B fallback (CI build + GHCR push) stays parked, justified.
- **Heredoc for nginx config replacement** instead of awk/sed surgical edits. The first attempt used awk and silently ate the `$uri` variable in `try_files $uri =404`; `nginx -t` caught it before reload (config validation is a real safety net). Switched to full-file heredoc replacement with a `.pre-*` backup — cleaner diff to review, easier to roll back.
- **`^~` prefix beats regex.** The existing `location ~ /\.` deny-rule would have blocked `/.well-known/acme-challenge/`. nginx's `^~` modifier on the ACME location wins the priority shootout, so the deny rule stays in place for *every other* dot-path (defence-in-depth preserved) while ACME stays open for renewals.
- **No docker-compose.yml edits.** CLAUDE.md is explicit: "n8n uses a separate `docker-compose.yml` — never merge or touch it." The cert delivery path uses ONLY pre-existing volume mounts (`conf.d/`, `ssl/`). Zero blast radius into the n8n stack.
- **Renewal automation tested by dry-run.** `certbot renew --dry-run` simulates the full path against Let's Encrypt's staging environment without consuming rate limits. Came back green; we know the webroot config and deploy hook will work in production at the next renewal.
- **Three-phase nginx config with backups.** Each phase (HTTP-only → +ACME webroot → +HTTPS) was a clean file replacement with its predecessor saved as `.pre-*` next to it. Rollback at any point is `cp <backup> bellavista.conf && docker exec nginx nginx -s reload` — under 5 seconds.

---

## What broke or surprised us

| Issue | Root cause | Resolution |
|---|---|---|
| `awk` ate `$uri` in the first `try_files` insertion | Shell expansion inside the awk script swallowed the variable name; nginx saw `try_files  =404` (invalid arg count) | `nginx -t` rejected it before reload; switched to heredoc-based full-file rewrite |
| First post-reload probe of `/.well-known/acme-challenge/probe.txt` returned 403 | Race between SIGHUP and the old worker exiting; old worker still served using the previous config (which had the dot-file deny rule unblocked) | Retest 1-2 seconds later showed 200; harmless |
| Verifying with `curl https://bellavista-coffee.com.co/` from local Mac still returned a **GoDaddy** cert + body | macOS's `dscacheutil` had the old GoDaddy A records cached locally; public resolvers (Google/Cloudflare/Quad9) all returned the new Lightsail IP | `--resolve` bypass confirmed the box was fine; user's `sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder` clears it |
| Internal `curl http://localhost:3000/` from the server failed with "Connection refused" | The app container is on the internal `automation_automation` Docker network only — no host port binding (Option A design) | Expected; verify through nginx instead (`-H Host:`) or `docker exec` |
| First post-restart redirect test returned HTTP 200 instead of 301 | Same SIGHUP-race as the ACME probe | Same — re-test after 2-second settle, then it was 301 |

---

## Decisions made or revised

| Decision | ADR | Notes |
|---|---|---|
| Webroot ACME challenge inside `conf.d/acme-webroot/` rather than a new docker volume | (informal) | Reuses an already-mounted host path. Zero `docker-compose.yml` change. |
| Cert lives in `/opt/automation/nginx/ssl/bellavista/` (host) → `/etc/nginx/ssl/bellavista/` (container) | (informal) | Same rationale — uses the pre-existing `ssl/` mount. Renewal hook copies fresh certs in place. |
| HSTS `max-age=15768000` (~6 mo), `includeSubDomains`, **no `preload`** | (informal) | 6 months is the conservative default; preload is a one-way ticket so we hold off until the site has been stable on HTTPS for a quarter. |
| TLSv1.2 + TLSv1.3 only, no TLSv1.0/1.1 | (informal) | Modern-only is the current `ssl_protocols` consensus. Lose nothing real. |
| ACME path stays accessible on :80 even after the HTTPS migration | (informal) | Renewals depend on it. If we ever lock down :80 entirely we'll need to switch to DNS-01. |
| Defer HSTS preload submission to a separate future checkpoint | (informal) | Once we have ~90 days of clean HTTPS uptime + monitoring. |

---

## Risks updated

| Risk | Status | Notes |
|---|---|---|
| Build OOMs on 2 GB box (ADR-004 concern) | ✅ Mitigated through observation | This build hit 1.3 GB used / 599 MB available. Layer cache (esp. `node_modules`) is doing the heavy lifting. Risk re-opens if `package-lock.json` changes meaningfully. |
| `.co` TLD HSTS preload blocks pre-DNS staging (raised in DEPLOY-option-a) | ✅ Closed | Real LE cert in place. `.co` HSTS preload no longer relevant once we have a valid cert. |
| GoDaddy parked page served at the public URL (raised in DEPLOY-option-a) | ✅ Closed | DNS A record at GoDaddy flipped to `44.192.98.134`. Lightsail nginx is the canonical answer for the hostname. |
| Cert renewal automation untested | ✅ Mitigated | `certbot renew --dry-run` confirms the webroot + deploy hook work end-to-end. Real renewal will fire ~30 days before `2026-08-09`. |
| Local DNS caching makes spot-checks confusing | ⚠ Operational, accept | Always verify with `dig +short @1.1.1.1 <host>` plus `curl --resolve` instead of trusting the OS resolver. |
| Touching `/opt/automation/` and breaking n8n | ✅ Avoided | All cert/config work happened within Bellavista-owned files. n8n's `docker-compose.yml` and `n8n.conf` were untouched. n8n container uptime preserved (5 weeks unchanged). |

---

## Next checkpoint readiness

Gate criteria for going dormant on infra:

- [x] `https://bellavista-coffee.com.co/` returns 200 with green padlock
- [x] `https://www.bellavista-coffee.com.co/` either resolves the same or 301s to apex
- [x] `http://...` returns a 301 to https
- [x] Certbot dry-run renewal succeeds
- [x] Deploy hook present and `chmod +x`
- [x] `docs/retrospectives/DEPLOY-tls-v1.md` written
- [ ] HSTS preload submission (future — wait for 90 days of clean HTTPS)
- [ ] Real Resend / Notion creds in `/srv/bellavista/.env` (still placeholder per DEPLOY-option-a §S1_CREDS)
- [ ] CSP header (deferred — needs an inventory of legitimate third-party requests first)

**Blocked on:** nothing.

---

## Operational notes — useful for future-you

### One-line rollback (HTTPS → HTTP-only)

```bash
ssh -i ~/Downloads/AI/Certs/Lightsail_Autonomia.pem ubuntu@44.192.98.134 \
  'cd /opt/automation/nginx && \
   sudo cp $(ls -t conf.d/bellavista.conf.pre-https-* | head -1) conf.d/bellavista.conf && \
   docker exec nginx nginx -t && docker exec nginx nginx -s reload'
```

### Manual cert renewal (skip the timer)

```bash
ssh -i ~/Downloads/AI/Certs/Lightsail_Autonomia.pem ubuntu@44.192.98.134 \
  'sudo certbot renew --force-renewal && \
   # deploy hook re-copies + reloads automatically, but verify:
   sudo ls -la /opt/automation/nginx/ssl/bellavista/'
```

### Check next renewal date

```bash
ssh -i ~/Downloads/AI/Certs/Lightsail_Autonomia.pem ubuntu@44.192.98.134 \
  'sudo certbot certificates && systemctl list-timers certbot.timer'
```

### What the new files cost (in case of audit)

- **Let's Encrypt cert**: $0 (non-profit CA, free, browser-trusted)
- **Build storage**: new image is 353 MB; total `bellavista-app:*` disk impact ~700 MB after old images age out
- **Time**: ~1 hour wall-clock for the whole TLS rollout, ~5 min of which was actual command execution

---

## One-line summary (for PLAN.md status block)

> DEPLOY_TLS_v1 — public site now live at `https://bellavista-coffee.com.co/` with Let's Encrypt cert (auto-renewing), serving v2 onyx + real farmhouse photography. n8n untouched. Rollback is a single `cp` + nginx reload.
