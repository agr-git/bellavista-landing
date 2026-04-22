# Deploy — Lightsail (Docker)

Simple, sequential. Read top to bottom. Stop at the first step that errors and report back.

> **Assumes:** Lightsail instance already exists, runs n8n in Docker, and you can SSH in.

---

## 0. What this sets up

One additional Docker stack at `/srv/bellavista/`, independent of n8n:

```
bellavista-app     Next.js runtime, internal :3000, 512 MB cap
bellavista-nginx   :80 (and :443 after S1), proxies app + serves /media
```

Two containers. One bridge network (`bellavista-net`). n8n is never touched.

---

## 1. Prereqs (your laptop)

- [ ] A registered domain (e.g. `bellavista-coffee.com.co`) — DNS pointed later in S1, not now.
- [ ] SSH access to the Lightsail instance, user with `sudo` + Docker group membership.
- [ ] A Lightsail **static IP** already assigned to the instance. (Lightsail console → Networking → Attach static IP.)

---

## 2. Pre-flight (on the server, before anything else)

SSH in, then run each check. If anything looks wrong, STOP and report:

```bash
# Docker present and modern enough?
docker --version            # expect 20.10+
docker compose version      # expect v2.x

# n8n healthy right now? (so we know we haven't broken it later)
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

# Free RAM and disk?
free -m                     # look at the "available" column
df -h /                     # /srv will land on this filesystem

# Does anything already listen on :80 or :443?
sudo ss -tlnp | grep -E ':80|:443'
```

### Decision point: port 80/443

- **Nothing listens on :80/:443** → continue, Bellavista's nginx will bind them.
- **n8n or another process already binds :80/:443** → **STOP and tell me**. We have two options (put n8n behind this nginx, or put Bellavista on a different port) and I'll adjust `nginx/conf.d/bellavista.conf` accordingly.

---

## 3. Clone the repo on the server

```bash
sudo mkdir -p /srv/bellavista
sudo chown -R "$USER":"$USER" /srv/bellavista
cd /srv/bellavista
git clone https://github.com/agr-git/bellavista-landing.git .
```

Confirm you see `Dockerfile`, `docker-compose.yml`, and the `nginx/` folder.

---

## 4. Create `.env` alongside compose

```bash
cp .env.example .env
nano .env
```

Fill in **at minimum** for first boot:

```
RESEND_API_KEY=           # can be blank for first boot; dev fallback will log
RESEND_FROM=leads@bellavistacoffee.co
NOTION_TOKEN=             # blank OK for first boot
NOTION_RESOURCES_DB_ID=
ADMIN_EMAIL=gil.rivera.a@gmail.com
NEXTAUTH_SECRET=          # openssl rand -base64 32
NEXTAUTH_URL=http://<your-static-ip>   # temporary until S1
ADMIN_PASSWORD_HASH=      # B10 / optional for now
```

> The app will run with blanks; forms will log to container stdout instead of sending. That's deliberate — we verify the stack first, wire creds in V1.

---

## 5. First build (on-server)

Open a second SSH session with `htop` running — you will watch RAM in real time.

In the original session:

```bash
cd /srv/bellavista
docker compose build 2>&1 | tee /tmp/bv-build.log
```

**Watch RAM.** The build compiles Next.js + TypeScript in Docker.

| Seen RAM used | Action |
|---|---|
| Peaks under ~85% | ✅ Continue. On-server build works. |
| Exceeds ~85% or kills n8n | ❌ Cancel with Ctrl-C. Switch to **B11B** (we'll build on your laptop or GitHub Actions and push the image). Tell me. |

Typical duration: 3–6 minutes on a 2 GB / 2-vCPU instance.

---

## 6. Start the stack

```bash
docker compose up -d
docker compose ps
```

Expected:

```
NAME                STATUS                 PORTS
bellavista-app      Up (healthy-ish)       3000/tcp
bellavista-nginx    Up                     0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
```

---

## 7. Verify

```bash
# From the server itself:
curl -I http://localhost                   # expect 200 on "/"
curl -s http://localhost/tokens | head     # the dev token sanity page should render

# From your laptop:
curl -I http://<static-ip>                 # expect 200
# Or open http://<static-ip> in a browser — full landing page.
```

Confirm **n8n is still healthy** after bringing the Bellavista stack up:

```bash
docker ps --format 'table {{.Names}}\t{{.Status}}'
```

---

## 8. Media directory (optional for now)

Real drone video + photography will land here post-ship:

```bash
mkdir -p /srv/bellavista/media
# Upload via rsync from your laptop when files are ready:
#   rsync -avP ./media/ user@<ip>:/srv/bellavista/media/
```

Nginx already serves `/media/*` with a 30-day cache.

---

## 9. Done — what to tell me

Paste back the output of:

```bash
docker compose ps
curl -sI http://localhost | head -n1
docker ps --format 'table {{.Names}}\t{{.Status}}' | head -n 10
free -m | head -n2
```

If all four look healthy and n8n is still up, we proceed to **V1 (Validate)**.

---

## Troubleshooting

**`port is already allocated` on `:80`** → a pre-existing container/service holds the port. Run `sudo ss -tlnp | grep :80` to find it. See the Decision Point in §2.

**Build OOMs / instance hangs** → trigger **B11B** path. Abort the build, `docker system prune -f`, and we'll rebuild from CI instead.

**App container restarts in a loop** → `docker compose logs app --tail=100`. Usually a bad env var or a missing `.next/standalone` artifact. Rebuild: `docker compose build --no-cache app`.

**`502 Bad Gateway` from nginx** → app container isn't ready. `docker compose logs app | tail -n 30` should show a `ready` line. If it crashed, same as above.

**n8n goes unhealthy after we start** → immediate rollback: `docker compose down`. n8n should recover. Report back with `docker logs <n8n-container> --tail=100` and RAM snapshot.

---

## Pulling updates later

After I push new commits:

```bash
cd /srv/bellavista
git pull
docker compose build app
docker compose up -d app
```

Nginx config changes:

```bash
docker compose exec nginx nginx -t   # test config
docker compose restart nginx
```
