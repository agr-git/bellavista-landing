# Cert renewal — runbook

> **TL;DR — under normal conditions you do nothing.** Renewal is fully automated.
> Run `./scripts/check-cert.sh` once a quarter to confirm it's healthy.
> Set up by `DEPLOY_TLS_v1` (2026-05-11). See `docs/retrospectives/DEPLOY-tls-v1.md`.

---

## When it happens

| Cert | Lineage | Issued | Expires | Auto-renew target |
|---|---|---|---|---|
| `bellavista-coffee.com.co` + `www.bellavista-coffee.com.co` | `/etc/letsencrypt/live/bellavista-coffee.com.co/` | 2026-05-11 | **2026-08-09** | Approx **2026-07-10** (~30 days before expiry) |

Let's Encrypt certs are 90 days. Certbot renews when ≤30 days remain.

The `certbot.timer` systemd unit fires **twice daily** (early morning + midday UTC, with a randomised delay). Most runs do nothing because the cert isn't yet eligible for renewal. The one that matters lands sometime in the 60-day window between issuance and the 30-days-to-expiry threshold.

---

## What happens automatically — the chain

```
1. systemd certbot.timer  ──fires twice/day──►  certbot.service
                                                     │
2.                                       certbot renew  (checks all lineages)
                                                     │
3.        ┌────────────────────────────────────────┘
          │   only proceeds if cert has ≤30 days left
          ▼
4. ACME HTTP-01 challenge to bellavista-coffee.com.co
     → token written to /opt/automation/nginx/conf.d/acme-webroot/.well-known/acme-challenge/
     → Let's Encrypt fetches it via nginx (port 80, "ACME location" block)
     → cert reissued, saved to /etc/letsencrypt/live/bellavista-coffee.com.co/
          │
5. Certbot runs every executable in /etc/letsencrypt/renewal-hooks/deploy/
     → bellavista-nginx.sh (this repo's hook):
        a. Filters $RENEWED_LINEAGE — only acts on OUR cert
        b. install -m 644 fullchain.pem → /opt/automation/nginx/ssl/bellavista/
        c. install -m 600 privkey.pem   → /opt/automation/nginx/ssl/bellavista/
        d. docker exec nginx nginx -s reload
        e. logger "Renewed cert ... reloaded nginx"
          │
6. nginx (in the n8n stack) picks up the new cert on its next worker
   cycle. Public TLS now serves the freshly issued cert.
```

**Nothing in this chain touches the application container or its image.** Renewal is purely a TLS-layer event handled by certbot + nginx.

---

## Verifying it actually happened

The one-command check:

```bash
./scripts/check-cert.sh
```

Run that any time. Healthy output looks like:

```
CERT     bellavista-coffee.com.co
ISSUER   C=US, O=Let's Encrypt, CN=E7
EXPIRES  2026-08-09 01:12:08 UTC   (89 days remaining)
SAN      DNS:bellavista-coffee.com.co, DNS:www.bellavista-coffee.com.co
PUBLIC   HTTP/1.1 200 OK
TIMER    active (waiting); next: Mon 2026-05-11 18:05:53 UTC
```

If "days remaining" drops below 25 and the issued date hasn't moved → renewal is failing. Jump to **Troubleshooting** below.

You can also do a **dry-run renewal** any time (consumes no LE rate-limit, exercises the full path including the deploy hook against LE's staging server):

```bash
ssh -i ~/Downloads/AI/Certs/Lightsail_Autonomia.pem ubuntu@44.192.98.134 \
  'sudo certbot renew --dry-run'
```

Last line should read `Congratulations, all simulated renewals succeeded`.

---

## What you (the human) need to do

| Frequency | Action |
|---|---|
| **Never under normal conditions** | Nothing. The chain above runs without you. |
| **Quarterly (every 90 days)** | Run `./scripts/check-cert.sh` from your laptop. ~5 sec. |
| **One-time, after a real renewal lands** | Optional: confirm the issued date moved. |
| **If `check-cert.sh` reports < 25 days remaining and no recent renewal** | Follow **Troubleshooting** below |
| **If you change the domain** | Re-issue with `certbot certonly --webroot -w /opt/automation/nginx/conf.d/acme-webroot -d <new-domain>` |

No calendar reminder is strictly required — the timer is reliable — but a quarterly `check-cert.sh` is cheap insurance.

---

## Troubleshooting

### "check-cert.sh says renewal is overdue"

SSH into the server and dig into the logs:

```bash
ssh -i ~/Downloads/AI/Certs/Lightsail_Autonomia.pem ubuntu@44.192.98.134
sudo journalctl -u certbot.service --since "30 days ago" --no-pager | tail -80
sudo tail -200 /var/log/letsencrypt/letsencrypt.log
```

Common causes and fixes:

| Symptom in logs | Likely cause | Fix |
|---|---|---|
| `Timeout during connect` / `urn:ietf:params:acme:error:connection` | Port 80 closed or nginx down | `sudo ss -tlnp | grep ':80 '`; restart nginx: `cd /opt/automation && docker compose restart nginx` |
| `404 Not Found` at challenge URL | nginx ACME location block missing or webroot deleted | Restore from `conf.d/bellavista.conf.pre-https-*` backup, or re-add `^~ /.well-known/acme-challenge/` location |
| `403 Forbidden` at challenge URL | The dot-file deny rule is matching first | Confirm the ACME location uses `^~` modifier (beats regex priority) |
| `Bad Gateway` after renewal | Deploy hook didn't reload nginx | `docker exec nginx nginx -t && docker exec nginx nginx -s reload` |
| `Permission denied` reading webroot | acme-webroot permissions changed | `sudo chmod 755 /opt/automation/nginx/conf.d/acme-webroot{,/.well-known,/.well-known/acme-challenge}` |

### "Force-renew now"

```bash
ssh -i ~/Downloads/AI/Certs/Lightsail_Autonomia.pem ubuntu@44.192.98.134 \
  'sudo certbot renew --force-renewal'
```

Note: Let's Encrypt rate-limits to **5 duplicate certs per week**. Don't loop on `--force-renewal`.

### "I broke nginx, the site is down"

Roll back to the most recent working config in one command:

```bash
ssh -i ~/Downloads/AI/Certs/Lightsail_Autonomia.pem ubuntu@44.192.98.134 \
  'cd /opt/automation/nginx && \
   sudo cp $(ls -t conf.d/bellavista.conf.pre-*.* | head -1) conf.d/bellavista.conf && \
   docker exec nginx nginx -t && docker exec nginx nginx -s reload'
```

(The `.pre-*` backups live next to the active config — every change leaves one behind.)

### "The deploy hook didn't run / certs are new in /etc/letsencrypt but not in /opt/automation/nginx/ssl/"

Manually trigger the same effect:

```bash
ssh -i ~/Downloads/AI/Certs/Lightsail_Autonomia.pem ubuntu@44.192.98.134 \
  'sudo install -m 644 /etc/letsencrypt/live/bellavista-coffee.com.co/fullchain.pem \
                       /opt/automation/nginx/ssl/bellavista/fullchain.pem && \
   sudo install -m 600 /etc/letsencrypt/live/bellavista-coffee.com.co/privkey.pem \
                       /opt/automation/nginx/ssl/bellavista/privkey.pem && \
   docker exec nginx nginx -s reload'
```

Then investigate why the hook didn't fire:

```bash
ls -la /etc/letsencrypt/renewal-hooks/deploy/
# Must include: bellavista-nginx.sh, executable (-rwxr-xr-x)
sudo cat /etc/letsencrypt/renewal-hooks/deploy/bellavista-nginx.sh
```

---

## Where things live (for future-agent orientation)

| Path | What |
|---|---|
| `/etc/letsencrypt/live/bellavista-coffee.com.co/` | Source of truth — symlinks to the latest cert |
| `/etc/letsencrypt/archive/bellavista-coffee.com.co/` | Historical cert versions |
| `/etc/letsencrypt/renewal/bellavista-coffee.com.co.conf` | Renewal config (authenticator=webroot, paths) |
| `/etc/letsencrypt/renewal-hooks/deploy/bellavista-nginx.sh` | The hook that copies + reloads |
| `/opt/automation/nginx/conf.d/bellavista.conf` | nginx server blocks (HTTP redirect + HTTPS) |
| `/opt/automation/nginx/conf.d/bellavista.conf.pre-*` | Rollback snapshots |
| `/opt/automation/nginx/conf.d/acme-webroot/` | Where ACME challenge tokens land during renewal |
| `/opt/automation/nginx/ssl/bellavista/` | Where nginx reads the cert from (inside container: `/etc/nginx/ssl/bellavista/`) |
| `/var/log/letsencrypt/letsencrypt.log` | Certbot's log — first place to look on failure |

## Cost reminder

Let's Encrypt is **free**. No invoice ever lands. If anyone proposes paying for an SSL cert for this domain, push back — the LE cert is identical in security and browser-trust to any paid alternative, and we've already automated its lifecycle.
