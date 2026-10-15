import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";

// Run the actual built OpenNext bundle in workerd, with dummy bindings and
// every outbound fetch intercepted. No Cloudflare deployment or real email.
// Requires npm run build:cloudflare first. Miniflare is supplied by Wrangler.
const output = path.resolve("output/qa/contact-worker");
await mkdir(output, { recursive: true });
const bundle = spawnSync(process.execPath, [
  path.resolve("node_modules/wrangler/bin/wrangler.js"),
  "deploy", "--dry-run", "--outdir", output,
], {
  encoding: "utf8",
  env: { ...process.env, WRANGLER_SEND_METRICS: "false" },
});
assert.equal(bundle.status, 0, bundle.stderr || "Local Worker bundle failed");

const body = {
  fullName: "Local Worker QA",
  email: "qa@example.test",
  company: "QA Agency",
  role: "Executive Assistant",
  message: "Isolated Worker runtime verification.",
  phone: "",
  website: "",
};
const bindings = {
  RESEND_API_KEY: "re_local_mock_key",
  CONTACT_FROM_EMAIL: "website@example.test",
  CONTACT_TO_EMAIL: "hello@example.test",
  CONTACT_WEBHOOK_URL: "",
  CONTACT_WEBHOOK_TOKEN: "",
};
const cases = [
  { name: "Successful Resend receipt", upstream: 200, receipt: { id: "local-mock-receipt" }, expected: 200, code: "received" },
  { name: "Provider authentication rejection", upstream: 401, expected: 502, code: "delivery_failed" },
  { name: "Provider rate limit", upstream: 429, expected: 429, code: "rate_limited" },
  { name: "Provider outage", upstream: 503, expected: 502, code: "delivery_unknown" },
  { name: "Redirect never forwards credentials", upstream: 302, expected: 502, code: "delivery_failed" },
  { name: "Missing provider receipt", upstream: 200, receipt: {}, expected: 502, code: "delivery_unknown" },
  { name: "Missing Preview settings", noSettings: true, expected: 503, code: "not_connected" },
];
const results = [];
for (const test of cases) {
  const calls = [];
  const mf = new Miniflare(convertV4MiniflareOptions({
    modules: true,
    scriptPath: path.join(output, "worker.js"),
    compatibilityDate: "2026-10-06",
    compatibilityFlags: ["nodejs_compat", "global_fetch_strictly_public"],
    cf: false,
    telemetry: { enabled: false },
    bindings: test.noSettings
      ? Object.fromEntries(Object.keys(bindings).map((key) => [key, ""]))
      : bindings,
    serviceBindings: {
      ASSETS: () => new Response("Not found", { status: 404 }),
    },
    outboundService: async (request) => {
      // Any followed Location or unmocked destination fails the test.
      assert.equal(request.url, "https://api.resend.com/emails");
      assert.equal(request.method, "POST");
      assert.equal(request.headers.get("authorization"), "Bearer re_local_mock_key");
      const payload = await request.json();
      assert.equal(payload.from, "Real Estate Staff <website@example.test>");
      assert.deepEqual(payload.to, ["hello@example.test"]);
      assert.equal(payload.reply_to, body.email);
      calls.push(request.url);
      return Response.json(test.receipt ?? { name: "mock_provider_error" }, {
        status: test.upstream,
        headers: test.upstream === 302
          ? { Location: "https://other.example.test/collect" }
          : {},
      });
    },
  }));
  try {
    // Miniflare rewrites dispatchFetch's Host; omit Origin for this direct API
    // runtime test. Browser same-origin validation is covered by test:contact.
    const response = await mf.dispatchFetch("https://staff.example.test/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const receipt = await response.json();
    assert.equal(response.status, test.expected, test.name);
    assert.equal(receipt.code, test.code, test.name);
    assert.equal(calls.length, test.noSettings ? 0 : 1, test.name);
    results.push({ name: test.name, status: "passed" });
  } finally {
    await mf.dispose();
  }
}
await writeFile(path.join(output, "report.json"), JSON.stringify({ results }, null, 2));
console.log(JSON.stringify({ status: "passed", checks: results.length, externalRequests: 0 }, null, 2));
