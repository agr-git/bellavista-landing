import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  checkRoutes,
  fixtureEnvironment,
  parseEnvFile,
  validateEnvironment,
  validateMigration,
} from "./auth-readiness.mjs";

test("parseEnvFile handles comments, export, and quoted values", () => {
  const parsed = parseEnvFile(`
# ignored
export NEXTAUTH_URL="https://example.com"
ADMIN_EMAIL=admin@example.com # safe comment
EMPTY=
`);
  assert.deepEqual(parsed, {
    NEXTAUTH_URL: "https://example.com",
    ADMIN_EMAIL: "admin@example.com",
    EMPTY: "",
  });
});

test("fixture environment passes presence and URL checks", () => {
  const env = fixtureEnvironment();
  const results = validateEnvironment(env, env.NEXTAUTH_URL);
  assert.equal(results.filter((result) => result.level === "error").length, 0);
  assert.ok(results.some((result) => result.code === "CREDENTIALS_CALLBACK_VALID"));
  assert.ok(results.some((result) => result.code === "BASE_URL_MATCH"));
});

test("validation reports names but never secret values", () => {
  const sentinel = "DO-NOT-LEAK-THIS-VALUE";
  const env = { ...fixtureEnvironment(), SUPABASE_SERVICE_ROLE_KEY: sentinel };
  const output = JSON.stringify(validateEnvironment(env, env.NEXTAUTH_URL));
  assert.equal(output.includes(sentinel), false);
  assert.equal(output.includes("SUPABASE_SERVICE_ROLE_KEY"), true);
});

test("validation rejects missing variables and unsafe production HTTP", () => {
  const env = { ...fixtureEnvironment(), SUPABASE_URL: "", NEXTAUTH_URL: "http://example.com" };
  const results = validateEnvironment(env, "https://example.com");
  assert.ok(results.some((result) => result.code === "ENV_MISSING"));
  assert.ok(results.some((result) => result.code === "BASE_URL_INVALID"));
});

test("repository migration declares every required table", async () => {
  const sql = await readFile(new URL("../supabase/migrations/0001_init.sql", import.meta.url), "utf8");
  const results = validateMigration(sql);
  assert.equal(results.filter((result) => result.level === "error").length, 0);
  assert.equal(results.length, 4);
});

test("migration validation identifies a missing table", () => {
  const results = validateMigration("CREATE TABLE IF NOT EXISTS bv_users (id uuid);");
  assert.ok(results.some((result) => result.code === "TABLE_MISSING"));
});

test("HTTP checks use GET, do not follow redirects, and accept protected redirect", async () => {
  const calls = [];
  const fakeFetch = async (url, options) => {
    calls.push({ url: url.toString(), options });
    const status = url.pathname === "/members" ? 307 : 200;
    return new Response(null, { status });
  };
  const results = await checkRoutes("https://example.com", fakeFetch, 100);
  assert.equal(results.filter((result) => result.level === "error").length, 0);
  assert.equal(calls.length, 5);
  assert.ok(calls.every((call) => call.options.method === "GET"));
  assert.ok(calls.every((call) => call.options.redirect === "manual"));
});
