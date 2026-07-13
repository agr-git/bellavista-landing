#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import process from "node:process";
import { fileURLToPath } from "node:url";

export const REQUIRED_ENV = [
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "ADMIN_EMAIL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];

export const REQUIRED_TABLES = [
  "bv_users",
  "bv_waitlist",
  "bv_cms_blocks",
  "bv_cms_images",
];

export const DEFAULT_MIGRATION = "supabase/migrations/0001_init.sql";
export const DEFAULT_ROUTES = [
  { path: "/login", statuses: [200] },
  { path: "/members", statuses: [200, 302, 307, 308] },
  { path: "/privacy", statuses: [200] },
  { path: "/terms", statuses: [200] },
  { path: "/api/auth/providers", statuses: [200] },
];

const CALLBACK_PATH = "/api/auth/callback/google";

function diagnostic(level, code, message) {
  return { level, code, message };
}

export function parseEnvFile(source) {
  const env = {};
  for (const rawLine of source.split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/u);
    if (!match) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    } else {
      value = value.replace(/\s+#.*$/u, "").trim();
    }
    env[match[1]] = value;
  }
  return env;
}

function normalizedBaseUrl(raw) {
  const url = new URL(raw);
  if (!new Set(["http:", "https:"]).has(url.protocol)) {
    throw new Error("must use http or https");
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new Error("must not contain credentials, a query, or a fragment");
  }
  if (url.pathname !== "/") {
    throw new Error("must be an origin without a path");
  }
  const local = new Set(["localhost", "127.0.0.1", "::1"]).has(url.hostname);
  if (!local && url.protocol !== "https:") {
    throw new Error("must use https outside local development");
  }
  return url.origin;
}

export function validateEnvironment(env, expectedBaseUrl) {
  const diagnostics = [];
  for (const name of REQUIRED_ENV) {
    if (typeof env[name] !== "string" || env[name].trim() === "") {
      diagnostics.push(diagnostic("error", "ENV_MISSING", `${name} is not set`));
    } else {
      diagnostics.push(diagnostic("pass", "ENV_PRESENT", `${name} is set`));
    }
  }

  let baseUrl;
  if (env.NEXTAUTH_URL?.trim()) {
    try {
      baseUrl = normalizedBaseUrl(env.NEXTAUTH_URL.trim());
      diagnostics.push(diagnostic("pass", "BASE_URL_VALID", "NEXTAUTH_URL is a valid base origin"));
    } catch (error) {
      diagnostics.push(diagnostic("error", "BASE_URL_INVALID", `NEXTAUTH_URL ${error.message}`));
    }
  }

  let expected;
  if (expectedBaseUrl?.trim()) {
    try {
      expected = normalizedBaseUrl(expectedBaseUrl.trim());
      diagnostics.push(diagnostic("pass", "EXPECTED_BASE_VALID", "expected base URL is a valid origin"));
    } catch (error) {
      diagnostics.push(diagnostic("error", "EXPECTED_BASE_INVALID", `expected base URL ${error.message}`));
    }
  }

  if (baseUrl && expected) {
    diagnostics.push(
      baseUrl === expected
        ? diagnostic("pass", "BASE_URL_MATCH", "NEXTAUTH_URL matches the expected base URL")
        : diagnostic("error", "BASE_URL_MISMATCH", "NEXTAUTH_URL does not match the expected base URL")
    );
  }

  if (baseUrl) {
    try {
      const callback = new URL(CALLBACK_PATH, `${baseUrl}/`);
      diagnostics.push(
        callback.origin === baseUrl && callback.pathname === CALLBACK_PATH
          ? diagnostic("pass", "REDIRECT_VALID", "Google callback resolves from the configured base URL")
          : diagnostic("error", "REDIRECT_INVALID", "Google callback does not resolve as expected")
      );
    } catch {
      diagnostics.push(diagnostic("error", "REDIRECT_INVALID", "Google callback could not be resolved"));
    }
  }

  if (env.ADMIN_EMAIL?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(env.ADMIN_EMAIL.trim())) {
    diagnostics.push(diagnostic("error", "ADMIN_EMAIL_INVALID", "ADMIN_EMAIL is not email-shaped"));
  } else if (env.ADMIN_EMAIL?.trim()) {
    diagnostics.push(diagnostic("pass", "ADMIN_EMAIL_VALID", "ADMIN_EMAIL is email-shaped"));
  }

  if (env.SUPABASE_URL?.trim()) {
    try {
      const url = new URL(env.SUPABASE_URL.trim());
      diagnostics.push(
        url.protocol === "https:"
          ? diagnostic("pass", "SUPABASE_URL_VALID", "SUPABASE_URL uses https")
          : diagnostic("error", "SUPABASE_URL_INVALID", "SUPABASE_URL must use https")
      );
    } catch {
      diagnostics.push(diagnostic("error", "SUPABASE_URL_INVALID", "SUPABASE_URL is not a valid URL"));
    }
  }

  return diagnostics;
}

export function validateMigration(sql, migrationPath = DEFAULT_MIGRATION) {
  const diagnostics = [];
  for (const table of REQUIRED_TABLES) {
    const declaration = new RegExp(
      `\\bcreate\\s+table\\s+(?:if\\s+not\\s+exists\\s+)?(?:public\\.)?["\u0060]?${table}["\u0060]?\\s*\\(`,
      "iu"
    );
    diagnostics.push(
      declaration.test(sql)
        ? diagnostic("pass", "TABLE_DECLARED", `${table} is declared in ${migrationPath}`)
        : diagnostic("error", "TABLE_MISSING", `${table} is not declared in ${migrationPath}`)
    );
  }
  return diagnostics;
}

export async function checkRoutes(baseUrl, fetchImpl = fetch, timeoutMs = 8000) {
  const origin = normalizedBaseUrl(baseUrl);
  const diagnostics = [];
  for (const route of DEFAULT_ROUTES) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(new URL(route.path, `${origin}/`), {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: { "user-agent": "bellavista-auth-readiness/1.0" },
      });
      await response.body?.cancel();
      diagnostics.push(
        route.statuses.includes(response.status)
          ? diagnostic("pass", "ROUTE_OK", `${route.path} returned an expected status (${response.status})`)
          : diagnostic("error", "ROUTE_BAD_STATUS", `${route.path} returned unexpected status (${response.status})`)
      );
    } catch (error) {
      const reason = error?.name === "AbortError" ? "timed out" : "request failed";
      diagnostics.push(diagnostic("error", "ROUTE_FAILED", `${route.path} ${reason}`));
    } finally {
      clearTimeout(timeout);
    }
  }
  return diagnostics;
}

export function fixtureEnvironment() {
  return {
    NEXTAUTH_SECRET: "fixture-only-not-a-secret",
    NEXTAUTH_URL: "https://bellavista-coffee.com.co",
    ADMIN_EMAIL: "fixture@example.com",
    GOOGLE_CLIENT_ID: "fixture-client-id",
    GOOGLE_CLIENT_SECRET: "fixture-client-secret",
    SUPABASE_URL: "https://fixture.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "fixture-service-role-key",
  };
}

function usage() {
  return `Usage: node scripts/auth-readiness.mjs [options]\n\nOptions:\n  --env-file <path>       Read variables from a local env file (overrides process env)\n  --base-url <origin>     Expected base origin; defaults to AUTH_EXPECTED_BASE_URL\n  --migration <path>      Migration to inspect (default: ${DEFAULT_MIGRATION})\n  --check-http            Perform read-only GET checks for auth/legal routes\n  --fixture               Use non-secret fixture variables; HTTP checks remain opt-in\n  --help                  Show this help\n\nThe validator reports variable names and check results, never variable values.`;
}

function parseArgs(argv) {
  const options = { migration: DEFAULT_MIGRATION, checkHttp: false, fixture: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--check-http") options.checkHttp = true;
    else if (arg === "--fixture") options.fixture = true;
    else if (arg === "--help") options.help = true;
    else if (["--env-file", "--base-url", "--migration"].includes(arg)) {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${arg} requires a value`);
      options[{ "--env-file": "envFile", "--base-url": "baseUrl", "--migration": "migration" }[arg]] = value;
      index += 1;
    } else throw new Error(`unknown option: ${arg}`);
  }
  return options;
}

export async function main(argv = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(argv);
  } catch (error) {
    console.error(`[ERROR] ARGUMENT: ${error.message}`);
    console.error(usage());
    return 2;
  }
  if (options.help) {
    console.log(usage());
    return 0;
  }
  if (options.fixture && options.envFile) {
    console.error("[ERROR] ARGUMENT: --fixture and --env-file cannot be combined");
    return 2;
  }

  let env = { ...process.env };
  try {
    if (options.fixture) env = fixtureEnvironment();
    if (options.envFile) env = { ...env, ...parseEnvFile(await readFile(options.envFile, "utf8")) };
  } catch {
    console.error("[ERROR] ENV_FILE: could not read the requested env file");
    return 2;
  }

  const expectedBase = options.baseUrl ?? env.AUTH_EXPECTED_BASE_URL ?? (options.fixture ? env.NEXTAUTH_URL : undefined);
  let diagnostics = validateEnvironment(env, expectedBase);
  try {
    diagnostics = diagnostics.concat(validateMigration(await readFile(options.migration, "utf8"), options.migration));
  } catch {
    diagnostics.push(diagnostic("error", "MIGRATION_UNREADABLE", `${options.migration} could not be read`));
  }
  if (options.checkHttp) {
    if (env.NEXTAUTH_URL?.trim()) {
      try {
        diagnostics = diagnostics.concat(await checkRoutes(env.NEXTAUTH_URL.trim()));
      } catch {
        diagnostics.push(diagnostic("error", "HTTP_BASE_INVALID", "HTTP checks require a valid NEXTAUTH_URL"));
      }
    } else {
      diagnostics.push(diagnostic("error", "HTTP_BASE_MISSING", "HTTP checks require NEXTAUTH_URL"));
    }
  }

  for (const item of diagnostics) {
    console.log(`[${item.level === "pass" ? "PASS" : "ERROR"}] ${item.code}: ${item.message}`);
  }
  const errors = diagnostics.filter((item) => item.level === "error").length;
  console.log(`Summary: ${diagnostics.length - errors} passed, ${errors} failed.`);
  return errors === 0 ? 0 : 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exitCode = await main();
}
