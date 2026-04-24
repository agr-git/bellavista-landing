# Deploy — Lightsail (Docker, Option A: shared edge nginx)

Simple, sequential. Read top to bottom. Stop at the first step that errors and report back.

> **Reality check (2026-04-24, DEPLOY_PHASE_A):** The Lightsail box already runs an
> n8n stack at `/opt/automation/` with its own nginx bound to `:80/:443`. We deployed
> Bellavista **behind that same edge** instead of standing up our own. This doc reflects
> that reality — Option A, as decided in `docs/retrospectives/DEPLOY-option-a.md`.

---

## 0. Architecture (Option A)

```
                 ┌─────────────────────────────────────────────────┐
                 │  Lightsail VPS (44.192.98.134)                  │
                 │                                                 │
 Internet ─► :80 │  edge nginx  ─┬─ Host: bellavista.{test,com.co} │
              443│  (n8n stack)  │   ─► bellavista-app:3000        │
                 │               └─ any other Host / :443 any      │
                 │                   ─► n8n:5678                   │
                 │                                                 │
                 │  Networks: automation_automation (shared)       │
                 └─────────────────────────────────────────────────┘
```

Two independent Docker Compose projects on the same box:

| Stack | Path | Owner | Touch? |
|---|---|---|---|
| n8n + edge nginx | `/opt/automation/` | pre-existing | **Never edit the compose file.** nginx conf is touched surgically per §6. |
| Bellavista app | `/srv/bellavista/` | us | ours to own |

Our app container joins the `automation_automation` external network so edge nginx can reach it by container DNS (`bellavista-app:3000`). No host port bindings on our side; the edge is the only thing public.

---

## 1. Prereqs (your laptop)

- [ ] A registered domain (e.g. `bellavista-coffee.com.co`) — DNS pointed later in S1, not now.
- [ ] SSH access to the Lightsail instance. Current key: `~/Downloads/AI/Certs/Lightsail_Autonomia.pem` (chmod 400).
- [ ] A Lightsail **static IP** already assigned. (Current: `44.192.98.134`.)

---

## 2. Pre-flight (on the server, before anything else)

SSH in, then run each check. Stop and report if anything looks wrong:

```bash
# Docker present and modern?
docker --version            # expect 20.10+
docker compose version      # expect v2.x

# Is the ubuntu user in the docker group?
groups                      # must include "docker"
# If missing:
#   sudo usermod -aG docker ubuntu
#   exit and reconnect SSH for the group to activate.

# n8n healthy right now?
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

# Free RAM and disk?
free -m
df -h /

# Who owns :80 and :443?
sudo ss -tlnp | grep -E ':80|:443'
```

### Port 80/443 decision point

- **Nothing listens** → you could run your own nginx. Not our situation.
- **`nginx` (from /opt/automation/) already binds both** → this is Option A. Continue below. **Never stop the n8n nginx**; we slot in behind it.
- **Something else binds them** → STOP and report.

---

## 3. Clone the repo on the server

```bash
sudo mkdir -p /srv/bellavista
sudo chown -R "$USER":"$USER" /srv/bellavista
cd /srv/bellavista
git clone https://github.com/agr-git/bellavista-landing.git .
```

> The repo is public during build/launch so HTTPS clone works without creds. Flip back to private post-S1 (CONTENT_LEGAL or its own Notion task).

Confirm you see `Dockerfile`, `docker-compose.yml`, and the `nginx/` folder (the latter kept for reference only — Option A uses the edge nginx at `/opt/automation/`, not this folder).

---

## 4. Create `.env` alongside compose

```bash
cp .env.example .env
nano .env
```

Fill in for first boot (blanks allowed — the API will log to stdout in dev-fallback mode):

```
RESEND_API_KEY=           # blank OK for smoke-test
RESEND_FROM=leads@bellavistacoffee.co
NOTION_TOKEN=             # blank OK
NOTION_RESOURCES_DB_ID=
ADMIN_EMAIL=gil.rivera.a@gmail.com
NEXTAUTH_SECRET=          # openssl rand -base64 32
NEXTAUTH_URL=http://bellavista.test      # will become https://bellavista-coffee.com.co at S1
ADMIN_PASSWORD_HASH=      # B10 parked; blank OK
```

Real creds land at **S1_CREDS**, not before.

---

## 5. First build (on-server)

Open a second SSH session with `htop` running — watch RAM live.

```bash
cd /srv/bellavista
docker compose build 2>&1 | tee /tmp/bv-build.log
```

Typical: 60–90 seconds on a 2 vCPU / 2 GB instance, peaks well under 85% RAM. If it OOMs, abort and switch to B11B (build on laptop, push image).

> **Known gotcha:** if `public/` doesn't exist, the Dockerfile runner stage fails on `COPY /app/public`. Fixed by `public/.gitkeep` in commit `65d75d4`.

---

## 6. Bring up our container (Option A)

```bash
cd /srv/bellavista
docker compose up -d
docker compose ps
```

Expected:

```
NAME                IMAGE                        STATUS     PORTS
bellavista-app      bellavista-app:latest        Up         3000/tcp
```

Note: **no host port mapping**. Correct for Option A.

---

## 7. Wire edge nginx to route us (the paranoid ritual)

**This is the shared-file edit. Every step matters.** The exact same ritual we will re-use at S1_TLS_CUTOVER.

Work inside `/opt/automation/nginx/conf.d/`. Before anything:

```bash
cd /opt/automation/nginx/conf.d/
docker exec -it nginx nginx -t           # baseline: current config must be valid
ls -la                                   # see n8n.conf
```

### 7.1 Mark n8n's server block as the catchall

We need Host-based routing. Whatever Host doesn't match Bellavista should fall through to n8n. nginx does this with `default_server` on the `listen` directive.

```bash
# Timestamped backup
sudo cp n8n.conf n8n.conf.backup-$(date +%Y%m%d-%H%M%S)

# Add `default_server` to the :80 listen (sed -i.sedbak = second-layer backup)
sudo sed -i.sedbak 's/^\(\s*listen 80\);/\1 default_server;/' n8n.conf

# Diff
diff n8n.conf.sedbak n8n.conf    # expect one-line change: `listen 80 default_server;`
```

### 7.2 Add our server block

Create `bellavista.conf` at `/opt/automation/nginx/conf.d/bellavista.conf`:

```nginx
server {
    listen 80;
    server_name bellavista.test bellavista-coffee.com.co www.bellavista-coffee.com.co;

    # Proxy to our app on the shared docker network
    location / {
        proxy_pass http://bellavista-app:3000;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";
    }

    # Next.js static assets: long cache
    location /_next/static/ {
        proxy_pass http://bellavista-app:3000;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }
}
```

### 7.3 Test, reload, verify, or auto-roll-back

```bash
# Validate the NEW config inside the running nginx container
docker exec -it nginx nginx -t
# ↳ FAILS? Roll back immediately:
#     sudo mv n8n.conf.backup-<timestamp> n8n.conf && sudo rm bellavista.conf
#     docker exec -it nginx nginx -s reload
# ↳ PASSES? Atomic reload (in-flight connections preserved):
docker exec -it nginx nginx -s reload

# Independent verification of BOTH tenants:
curl -H "Host: bellavista.test"       http://127.0.0.1/ -I     # expect 200
curl -H "Host: whatever.example"      http://127.0.0.1/ -I     # expect 301 to https (n8n catchall)
curl -k https://127.0.0.1/ -I                                   # n8n still up
```

Print-the-rollback-command habit:

```bash
echo "Rollback: sudo mv n8n.conf.backup-<ts> n8n.conf && sudo rm bellavista.conf && docker exec -it nginx nginx -s reload"
```

---

## 8. Validate from your laptop (pre-DNS)

`.co` is on the browser HSTS preload list — Chrome/Arc/Safari will upgrade `bellavista-coffee.com.co` to HTTPS and refuse the self-signed IP cert with no bypass. So for pre-DNS staging we use the RFC-reserved `.test` TLD.

```bash
# Add to your laptop's /etc/hosts:
sudo tee -a /etc/hosts <<< "44.192.98.134  bellavista.test"

# Then open:
open http://bellavista.test/
```

The real `bellavista-coffee.com.co` hostname is already in the server_name list — it just needs DNS (S1_DNS) and a real cert (S1_TLS_CUTOVER) to start serving. No server-side changes needed then beyond §9 below.

---

## 9. Pulling updates later

```bash
cd /srv/bellavista
git pull
docker compose build app
docker compose up -d app
```

Edge nginx config changes (same ritual as §7.3):

```bash
docker exec -it nginx nginx -t
docker exec -it nginx nginx -s reload
```

---

## 10. Troubleshooting

**`port is already allocated` on `:80/:443`** → you tried to start your own nginx. Option A doesn't. Remove any `nginx` service from `docker-compose.yml` and any host port bindings from `app`. Our container only `expose`s 3000 to the shared network.

**Build OOMs** → trigger B11B (build on laptop or GHA, push image). `docker system prune -f` first.

**App restarts in a loop** → `docker compose logs app --tail=100`. Usually a bad env var or missing `.next/standalone`. Rebuild `--no-cache`.

**`502 Bad Gateway` from edge** → app container not ready yet, or not on `automation_automation` network. `docker network inspect automation_automation` should list both `nginx` and `bellavista-app`.

**n8n goes unhealthy after we touched nginx** → immediate rollback:
```bash
cd /opt/automation/nginx/conf.d/
sudo cp n8n.conf.backup-<latest-ts> n8n.conf
sudo rm -f bellavista.conf
docker exec -it nginx nginx -t && docker exec -it nginx nginx -s reload
```

**HSTS blocks browser test of `.co` domain** → expected. Use the `.test` alias (§8). Fully dissolves at S1_TLS_CUTOVER.

---

## Next checkpoints

| Checkpoint | What it unlocks |
|---|---|
| **V1_VALIDATE** | Lighthouse, cross-browser, iOS Safari scrolly check (tracked in Notion) |
| **S1_DNS** | Point `bellavista-coffee.com.co` A-record at `44.192.98.134` |
| **S1_TLS_CUTOVER** | Let's Encrypt cert, add :443 server block, HTTP→HTTPS 301, drop `.test` alias — reuse the §7.3 ritual |
| **S1_CREDS** | Real Resend + Notion creds into `.env`, `docker compose up -d` |
