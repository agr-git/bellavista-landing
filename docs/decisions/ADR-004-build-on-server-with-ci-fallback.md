# ADR-004 — On-Server Build with CI/CD Fallback

**Date:** 2026-04-21
**Status:** Accepted
**Deciders:** Alejo Gil

---

## Context

The deployment target is an AWS Lightsail VPS with 2GB RAM and 2 vCPUs — the same instance that runs n8n via Docker. Running `next build` inside a Docker container on this instance risks OOM-killing either the build or n8n.

Two deployment strategies were evaluated:

**Option A — Build on server (primary)**
`git push` → SSH into Lightsail → `git pull` → `docker build` → `docker compose up -d`
All compute happens on the VPS.

**Option B — Build in CI, deploy image (fallback)**
`git push` → GitHub Actions triggers → `docker build` → push to GitHub Container Registry (GHCR) → SSH into Lightsail → `docker compose pull` → `up -d`
Build happens on GitHub's infra (free runners, 7GB RAM); only image pull + container start on VPS.

---

## Decision

**Start with Option A. If the on-server build OOMs or destabilizes n8n, immediately activate Option B.**

Option B implementation is documented (checkpoint B11B) but not wired unless triggered.

---

## Reasons for trying Option A first

1. **Simpler operational model.** One fewer external dependency (GitHub Actions, GHCR token, secret management). Fewer moving parts = fewer failure modes.

2. **n8n may not be affected.** A Docker build is CPU/RAM-intensive but brief. n8n is not memory-intensive at idle. The risk is real but not certain — worth testing.

3. **No CI setup cost for v1.** GitHub Actions configuration, secrets management, and GHCR registry setup take time. Deferring until needed is YAGNI.

4. **RAM monitoring gives an early warning.** `watch docker stats` during the build makes OOM predictable. If usage peaks above 85%, stop the build and activate B11B before any disruption.

---

## Trigger criteria for activating B11B

Activate GitHub Actions + GHCR build if ANY of the following occur:
- `docker build` causes RAM to exceed 85% (`free -m` during build)
- `docker build` is OOM-killed by the kernel (`Killed` in output)
- n8n becomes unresponsive during or after a build

---

## B11B implementation (pre-designed, activate when needed)

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GHCR_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/${{ github.repository_owner }}/bellavista:latest

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: SSH deploy
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.LIGHTSAIL_HOST }}
          key: ${{ secrets.LIGHTSAIL_SSH_KEY }}
          script: |
            cd /srv/bellavista
            docker compose pull
            docker compose up -d
```

Required GitHub Secrets: `LIGHTSAIL_SSH_KEY`, `LIGHTSAIL_HOST`, `GHCR_TOKEN`
docker-compose.yml change: replace `build: .` with `image: ghcr.io/[user]/bellavista:latest`

---

## Consequences

- Option A keeps ops simple but carries OOM risk
- Option B adds CI complexity but removes all build RAM pressure from the VPS
- The conditional nature means B11B may never be needed — correct YAGNI behavior
- If B11B is activated, subsequent deploys are fully automated (`git push` → live)
