#!/usr/bin/env bash
# check-cert.sh — one-command TLS health check for bellavista-coffee.com.co
#
# Reads remotely; never modifies anything. Safe to run any time.
# Set up by DEPLOY_TLS_v1 (2026-05-11). See docs/operations/CERT-RENEWAL.md.
#
# Usage:
#   ./scripts/check-cert.sh
#
# Exits 0 if healthy, 1 if cert has <25 days remaining (renewal overdue),
# 2 if the public HTTPS endpoint is unreachable.

set -euo pipefail

DOMAIN="bellavista-coffee.com.co"
SERVER_IP="44.192.98.134"
SSH_KEY="${SSH_KEY:-$HOME/Downloads/AI/Certs/Lightsail_Autonomia.pem}"
WARN_DAYS="${WARN_DAYS:-25}"

bold() { printf "\033[1m%s\033[0m" "$*"; }
dim()  { printf "\033[2m%s\033[0m" "$*"; }
red()  { printf "\033[31m%s\033[0m" "$*"; }
grn()  { printf "\033[32m%s\033[0m" "$*"; }
ylw()  { printf "\033[33m%s\033[0m" "$*"; }

# --- 1. Pull cert from the public TLS endpoint (bypass local DNS cache) ----
cert_pem=$(echo | openssl s_client \
  -connect "$SERVER_IP:443" \
  -servername "$DOMAIN" 2>/dev/null \
  | openssl x509 -outform PEM 2>/dev/null) || {
    echo "$(red "FAIL") could not retrieve cert from $SERVER_IP:443"
    exit 2
  }

issuer=$(echo "$cert_pem" | openssl x509 -noout -issuer | sed 's/^issuer=//')
not_after=$(echo "$cert_pem" | openssl x509 -noout -enddate | cut -d= -f2)
san=$(echo "$cert_pem" | openssl x509 -noout -ext subjectAltName 2>/dev/null \
      | tail -1 | sed 's/^[[:space:]]*//')

# Days remaining (BSD date on macOS vs GNU date on Linux)
if date -j -f "%b %d %T %Y %Z" "$not_after" "+%s" >/dev/null 2>&1; then
  end_epoch=$(date -j -f "%b %d %T %Y %Z" "$not_after" "+%s")
else
  end_epoch=$(date -d "$not_after" "+%s")
fi
now_epoch=$(date "+%s")
days_left=$(( (end_epoch - now_epoch) / 86400 ))

# --- 2. Public HTTPS reachability + content sanity ------------------------
http_status=$(curl -sS --resolve "${DOMAIN}:443:${SERVER_IP}" \
  -o /dev/null -w "%{http_code}" \
  "https://${DOMAIN}/" 2>/dev/null || echo "000")

# --- 3. Timer state on the server (best-effort; skip if SSH key missing) --
timer_line=""
if [[ -f "$SSH_KEY" ]]; then
  timer_line=$(ssh -i "$SSH_KEY" -o ConnectTimeout=8 -o BatchMode=yes \
                   "ubuntu@${SERVER_IP}" \
                   'systemctl list-timers certbot.timer --no-pager 2>/dev/null \
                    | awk "NR==2 {print \$0}"' 2>/dev/null || true)
fi

# --- 4. Report ------------------------------------------------------------
echo
echo "  $(bold CERT)     $DOMAIN"
echo "  $(bold ISSUER)   $issuer"
echo "  $(bold EXPIRES)  $not_after"
if (( days_left < WARN_DAYS )); then
  echo "           $(red "$days_left days remaining")  $(dim "(< $WARN_DAYS — renewal overdue)")"
elif (( days_left < 40 )); then
  echo "           $(ylw "$days_left days remaining")  $(dim "(within the 30-day renewal window)")"
else
  echo "           $(grn "$days_left days remaining")"
fi
echo "  $(bold SAN)      $san"
echo "  $(bold PUBLIC)   HTTP $http_status  $(dim "(via --resolve $DOMAIN:443:$SERVER_IP)")"
if [[ -n "$timer_line" ]]; then
  echo "  $(bold TIMER)    $(dim "$timer_line")"
else
  echo "  $(bold TIMER)    $(dim "(SSH key not available; skipped — runbook in docs/operations/CERT-RENEWAL.md)")"
fi
echo

# Issuer sanity — warn if we're back on GoDaddy or self-signed somehow
if [[ "$issuer" != *"Let's Encrypt"* ]]; then
  echo "  $(red WARNING) issuer is not Let's Encrypt — investigate immediately."
  echo "           See docs/operations/CERT-RENEWAL.md → Troubleshooting"
  exit 1
fi

# Public reachability
if [[ "$http_status" != "200" ]]; then
  echo "  $(red WARNING) public HTTPS returned $http_status, expected 200"
  exit 2
fi

# Renewal threshold
if (( days_left < WARN_DAYS )); then
  echo "  $(red ACTION)   renewal overdue. Run on the server:"
  echo "           sudo certbot renew --force-renewal"
  echo "           Full runbook: docs/operations/CERT-RENEWAL.md"
  exit 1
fi

echo "  $(grn OK)       cert is healthy. Next quarterly check ~$(date -v +90d +%Y-%m-%d 2>/dev/null || date -d '+90 days' +%Y-%m-%d)."
echo
