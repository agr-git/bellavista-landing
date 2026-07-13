# Auth production readiness runbook (Google OAuth + Supabase)

Scope: issue #1 only — NextAuth Google login, Supabase-backed member records, VPS environment, deployment, rollback, and verification. Resend/Notion remediation is explicitly out of scope.

Production origin: `https://bellavista-coffee.com.co`  
Google callback: `https://bellavista-coffee.com.co/api/auth/callback/google`

## Safety rules and ownership gates

- Never paste client secrets, service-role keys, `.env`, shell history, screenshots, or validator input into Git, an issue, a PR, chat, or logs.
- The readiness validator prints variable names and pass/fail metadata, never values. Still run it from a trusted machine.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and bypasses RLS. Never prefix it with `NEXT_PUBLIC_`.
- Make no Google Cloud or VPS change without an authenticated human operator at the relevant gate.
- Do not alter `/opt/automation/docker-compose.yml`; it owns the shared n8n edge stack.
- Stop on the first failed gate. A passing repository fixture proves validator behavior, not production credentials or infrastructure.

### Responsibility boundary

**Composio-supported Supabase lane (when an authenticated Supabase connection and the required actions are available):**

1. Reconcile the intended Supabase organization/project and record the project reference outside Git.
2. Inspect project/API configuration metadata without exposing key values.
3. Apply `supabase/migrations/0001_init.sql` only after the operator confirms the target project.
4. Perform read-only schema/table verification after migration.

If the active Composio Supabase connector does not expose one of those actions, stop and use the Supabase Dashboard/manual lane; do not infer success. Composio does **not** remove the human approval gate and must not receive secrets in free-text prompts.

**Manual credential gates (not delegated to Composio):**

- Google Cloud Console: OAuth consent screen, OAuth client creation, authorized origins/redirects, and client-secret retrieval.
- Supabase Dashboard when connector actions are unavailable: project creation, migration execution, URL and service-role-key retrieval.
- VPS over SSH: `.env` write, backup, build/restart, log inspection, and rollback.

## 1. Repository preflight (no credentials)

From a clean checkout of the approved commit:

```bash
npm ci
npm run lint
npm run validate:content
npm run test:auth-readiness
npm run validate:auth:fixture
npm run build
```

Expected: all commands exit 0. Fixture mode uses obvious non-secret placeholders and does not call the network.

The production command is:

```bash
npm run validate:auth -- \
  --env-file /srv/bellavista/.env \
  --base-url https://bellavista-coffee.com.co
```

Optional read-only route probes add `--check-http`. They send unauthenticated `GET` requests with redirects disabled to `/login`, `/members`, `/privacy`, `/terms`, and `/api/auth/providers`; they never attempt login, writes, or OAuth callbacks.

## 2. Supabase gate

### 2.1 Confirm the target

Before applying SQL, confirm all of the following without copying credentials into notes:

- correct organization and project name;
- production project reference;
- API URL belongs to that project;
- environment is production, not a personal/test project.

Use either the Composio-supported lane above or the Supabase Dashboard. Record who approved the target and when in the deployment record.

### 2.2 Apply the migration once

Source-controlled migration: `supabase/migrations/0001_init.sql`.

- Preferred with an available, authenticated Composio action: execute that exact file against the confirmed project, then use the connector's read-only SQL/action to verify.
- Manual fallback: Supabase Dashboard → SQL Editor → paste the exact tracked file → Run.
- CLI fallback for an already linked and authenticated project: `supabase db push`; inspect the target project reference before confirmation.

The SQL is idempotent at table/index creation level (`IF NOT EXISTS`), but it is not a schema-drift reconciler. Do not treat a second successful run as proof that existing columns match.

Read-only verification query:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('bv_users', 'bv_waitlist', 'bv_cms_blocks', 'bv_cms_images')
order by table_name;
```

Expected: exactly four rows. Also inspect the tracked migration locally:

```bash
npm run validate:auth:fixture
```

Credential retrieval is a manual Dashboard gate: Project Settings → API. Put `SUPABASE_URL` and the **service_role** key directly in the VPS `.env`; do not display them in terminal output.

## 3. Google Cloud manual gate

A human with access to the correct Google Cloud project must:

1. Configure the OAuth consent screen and required support/developer contact details.
2. Add the production domain and publish/test the app according to Google policy. If the app remains in Testing, explicitly add test users.
3. Create a **Web application** OAuth 2.0 client.
4. Set authorized JavaScript origin to `https://bellavista-coffee.com.co` if the console/workflow requires it.
5. Set the exact authorized redirect URI to:
   `https://bellavista-coffee.com.co/api/auth/callback/google`
6. Retrieve the client ID and secret directly into the secure operator workflow. Never commit or paste either value.
7. If Google rotates the secret, update the VPS first during an approved window, verify, then revoke the old secret.

A trailing slash, `www` hostname, HTTP scheme, or alternate domain is a distinct redirect URI. It will not match the production callback above.

## 4. VPS environment gate

SSH to the VPS using the operator's approved key. In `/srv/bellavista`, back up metadata without printing values:

```bash
cd /srv/bellavista
umask 077
cp -p .env ".env.backup-$(date -u +%Y%m%dT%H%M%SZ)"
chmod 600 .env .env.backup-*
```

Edit `.env` locally on the VPS. Required auth values:

```dotenv
NEXTAUTH_SECRET=<generated high-entropy secret>
NEXTAUTH_URL=https://bellavista-coffee.com.co
AUTH_EXPECTED_BASE_URL=https://bellavista-coffee.com.co
ADMIN_EMAIL=<approved Google account>
GOOGLE_CLIENT_ID=<Google web client ID>
GOOGLE_CLIENT_SECRET=<Google client secret>
SUPABASE_URL=<confirmed production project URL>
SUPABASE_SERVICE_ROLE_KEY=<server-only service_role key>
```

Generate `NEXTAUTH_SECRET` directly on the VPS (for example, `openssl rand -base64 32`) and paste it into the editor; do not run commands that echo the completed file. Preserve unrelated existing Resend/Notion values without changing them.

Validate before restart:

```bash
npm run validate:auth -- \
  --env-file /srv/bellavista/.env \
  --base-url https://bellavista-coffee.com.co
```

Expected: zero failures. This validates shape/presence and migration declarations; it cannot authenticate to Google or prove that the Supabase key belongs to the URL.

## 5. Deploy with rollback point

Capture the currently deployed revision/image and keep the env backup path in the private deployment record:

```bash
cd /srv/bellavista
git rev-parse HEAD
docker image inspect bellavista-app:latest --format '{{.Id}}' > /tmp/bellavista-pre-auth-image-id
docker tag bellavista-app:latest bellavista-app:pre-auth-rollback
```

Then update only to the reviewed issue #1 commit and deploy:

```bash
git fetch origin
git checkout <approved-issue-1-commit>
docker compose config --quiet
docker compose build app
docker compose up -d --no-deps app
docker compose ps
docker compose logs app --tail=100
```

Do not use `docker compose config` without `--quiet` in shared logs because rendered output can contain environment values. Do not edit or restart n8n.

## 6. Verification

### Automated, read-only

Run from a trusted operator machine or the VPS after the container is healthy:

```bash
npm run validate:auth -- \
  --env-file /srv/bellavista/.env \
  --base-url https://bellavista-coffee.com.co \
  --check-http
```

Expected:

- `/login`, `/privacy`, `/terms`, and `/api/auth/providers`: HTTP 200;
- `/members`: HTTP 200 or an unauthenticated redirect (302/307/308);
- all environment, base URL, redirect derivation, and table declaration checks pass.

Also verify container state and only non-sensitive log metadata:

```bash
docker compose ps
docker compose logs app --since=10m --tail=200
```

### Manual end-to-end

1. Open a private browser window at `/login`.
2. Start Google sign-in and confirm Google shows the intended app/domain.
3. Complete login with an allowed account; verify redirect to `/members`.
4. Confirm a `bv_users` row exists using a read-only Supabase query. Do not include the user's email in a public deployment log.
5. Sign out and confirm `/members` is protected again.
6. With the approved admin account, verify `/admin` access; with a non-admin account, verify denial.
7. Re-check `/privacy` and `/terms` without authentication.

## 7. Rollback

Rollback triggers include OAuth redirect/configuration failure, repeated application errors, wrong Supabase target, loss of member-route protection, or n8n impact.

Application rollback (does not modify shared nginx):

```bash
cd /srv/bellavista
docker tag bellavista-app:pre-auth-rollback bellavista-app:latest
docker compose up -d --no-deps --force-recreate app
docker compose ps
docker compose logs app --tail=100
```

Environment rollback, using the exact private backup path captured earlier:

```bash
cd /srv/bellavista
cp -p .env.backup-<UTC_TIMESTAMP> .env
chmod 600 .env
docker compose up -d --no-deps --force-recreate app
```

If a Git checkout is needed for subsequent builds, check out the previously recorded commit explicitly; never use a destructive reset with unreviewed VPS changes present.

Database rollback is **not** `DROP TABLE`: auth may already have written production rows. Disable/revert the application first, preserve data, and create a separately reviewed forward migration or recovery plan. If credentials may have leaked, rotate Google client secret, Supabase service-role key, and `NEXTAUTH_SECRET`, then revoke old credentials after the restored service is verified.

## Known limits / residual risk

- Static migration checks confirm declarations, not remote schema state, column drift, RLS policy, or key/project pairing.
- HTTP probes confirm route/status reachability, not an interactive OAuth exchange.
- Google consent-screen review/test-user status requires manual confirmation.
- JWT sessions remain valid according to NextAuth cookie/session behavior; rotating `NEXTAUTH_SECRET` invalidates existing sessions.
- Service-role access intentionally bypasses RLS. A server compromise therefore has broad project access.
- The application currently logs Supabase sync errors but permits login to continue; an OAuth success does not alone prove user synchronization succeeded.
