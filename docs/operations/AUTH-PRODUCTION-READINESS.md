# Auth production readiness runbook (simple auth + Supabase)

Scope: issue #1 / PR #7 only — simple member login, Supabase-backed member records, VPS environment, deployment, rollback, and verification. Google OAuth has been split to issue #12 and is intentionally out of scope for this PR. Resend/Notion remediation is also out of scope.

Production base URL: `https://bellavista-coffee.com.co`
Simple credentials callback: `https://bellavista-coffee.com.co/api/auth/callback/credentials`
Supabase project: `udtzzagtlnbpoqetugec`

## 1. Safety rules

- Never print, commit, or paste `NEXTAUTH_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `MEMBERS_ACCESS_CODE`, Resend keys, Notion tokens, SSH keys, or database credentials.
- Keep the Bellavista app isolated from the n8n stack. Do not edit `/opt/automation/docker-compose.yml` for this app.
- Use the existing `/srv/bellavista` app stack and the shared edge nginx/network described in `docs/deploy.md`.
- No destructive database rollback. Preserve production rows and fix forward unless explicitly approved.

## 2. Required production env

Set these on the VPS `.env` for the Bellavista app:

```bash
NEXTAUTH_SECRET=<generated secret>
NEXTAUTH_URL=https://bellavista-coffee.com.co
ADMIN_EMAIL=<approved admin email>
SUPABASE_URL=https://udtzzagtlnbpoqetugec.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<Supabase service role key>
# Optional: if set, login requires this shared access code in addition to email.
MEMBERS_ACCESS_CODE=<optional shared code>
```

Notes:

- `ADMIN_EMAIL` is the bootstrap path: that email can sign in and will be upserted into `bv_users` if missing.
- Non-admin users must already exist in `bv_users` unless an operator creates them through an approved flow.
- `MEMBERS_ACCESS_CODE` is optional. If blank, existing `bv_users` emails can sign in without a code.
- Google OAuth variables are not required for this PR.

## 3. Supabase readiness

The migration `supabase/migrations/0001_init.sql` must exist and declare:

- `bv_users`
- `bv_waitlist`
- `bv_cms_blocks`
- `bv_cms_images`

The production project for this PR is `udtzzagtlnbpoqetugec`. The initial migration has already been applied there through the approved Supabase/Composio workflow.

## 4. Local validation

From the repo root:

```bash
npm run lint
npm run validate:content
npm run test:auth-readiness
npm run validate:auth:fixture
npm run build
```

Optional route probes after deploy:

```bash
NEXTAUTH_URL=https://bellavista-coffee.com.co npm run validate:auth -- --check-http
```

The validator reports variable names and check results, never secret values.

## 5. VPS deploy gate

Only proceed when SSH access and env write access are available.

1. Backup the current app state:

```bash
cd /srv/bellavista
git rev-parse HEAD > /tmp/bellavista-prev-sha.txt
cp .env /tmp/bellavista-env-backup-$(date +%Y%m%d%H%M%S)
```

2. Pull the approved commit/merge result.
3. Verify `.env` includes the required variables above.
4. Build and restart only the Bellavista app stack:

```bash
docker compose build app
docker compose up -d app
docker compose ps
```

5. Do not restart or modify the n8n compose stack.

## 6. Production verification

Unauthenticated checks:

- `/` returns 200.
- `/login` returns 200 and renders the email/access-code form.
- `/privacy` returns 200.
- `/terms` returns 200.
- `/api/auth/providers` returns 200 and includes the credentials provider.
- `/members` redirects unauthenticated users to `/login` or returns a protected redirect status.

Authenticated checks:

- Admin email can sign in through `/login`.
- `/members` renders after sign-in.
- `/admin` is available only to `ADMIN_EMAIL`.
- A non-admin, non-member email is rejected.
- If `MEMBERS_ACCESS_CODE` is set, a wrong code is rejected.

Supabase checks:

- Admin bootstrap upserts a row in `bv_users` for `ADMIN_EMAIL` if it did not already exist.
- Existing `bv_users` emails can access `/members`.
- Waitlist actions write to `bv_waitlist` without exposing Supabase credentials client-side.

## 7. Rollback

Rollback triggers include broken `/login`, member-route bypass, repeated application errors, wrong Supabase target, or n8n impact.

Application rollback:

```bash
cd /srv/bellavista
git checkout $(cat /tmp/bellavista-prev-sha.txt)
docker compose build app
docker compose up -d app
```

Database rollback is not `DROP TABLE`. Preserve rows and create a reviewed forward fix. If secrets may have leaked, rotate `NEXTAUTH_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, and any affected access code through the approved secure channel.

## 8. Deferred work

Google OAuth setup is tracked separately in issue #12. It must not block this PR.
