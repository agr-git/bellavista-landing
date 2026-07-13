#!/usr/bin/env node

const DEFAULT_BASE_URL = "https://www.bellavista-coffee.com.co";
const ROUTES = [
  { path: "/", expected: [200], gate: "public-home" },
  { path: "/robots.txt", expected: [200], gate: "seo" },
  { path: "/sitemap.xml", expected: [200], gate: "seo" },
  { path: "/login", expected: [200], gate: "auth-members" },
  { path: "/members", expected: [200, 302, 307, 308], gate: "auth-members" },
  { path: "/privacy", expected: [200], gate: "oauth-legal" },
  { path: "/terms", expected: [200], gate: "oauth-legal" },
  { path: "/api/auth/providers", expected: [200], gate: "auth-members" },
  { path: "/api/auth/session", expected: [200], gate: "auth-members" },
];

function statusFor(route, status) {
  return route.expected.includes(status) ? "PASS" : "FAIL";
}

async function checkRoute(baseUrl, route) {
  const url = new URL(route.path, baseUrl);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(url, {
      redirect: "manual",
      signal: controller.signal,
      headers: { "user-agent": "bellavista-v1-validator/1.0" },
    });
    await response.body?.cancel();
    return {
      path: route.path,
      expected: route.expected.join("/"),
      actual: response.status,
      gate: route.gate,
      status: statusFor(route, response.status),
    };
  } catch (error) {
    return {
      path: route.path,
      expected: route.expected.join("/"),
      actual: error?.name === "AbortError" ? "timeout" : "request-error",
      gate: route.gate,
      status: "FAIL",
    };
  } finally {
    clearTimeout(timeout);
  }
}

function markdown(results, baseUrl) {
  const lines = [];
  lines.push(`# Bellavista V1 route validation`);
  lines.push("");
  lines.push(`Base URL: ${baseUrl}`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");
  lines.push("| Status | Gate | Path | Expected | Actual |");
  lines.push("|---|---|---|---|---|");
  for (const result of results) {
    lines.push(`| ${result.status} | ${result.gate} | \`${result.path}\` | ${result.expected} | ${result.actual} |`);
  }
  lines.push("");
  lines.push("Deferred scope: Resend + Notion production lead-funnel E2E is DEFERRED pending PM decision on issue #2.");
  return lines.join("\n");
}

async function main() {
  const baseUrl = process.argv[2] ?? DEFAULT_BASE_URL;
  const results = [];
  for (const route of ROUTES) results.push(await checkRoute(baseUrl, route));
  console.log(markdown(results, baseUrl));
  const failures = results.filter((result) => result.status === "FAIL");
  process.exitCode = failures.length ? 1 : 0;
}

await main();
