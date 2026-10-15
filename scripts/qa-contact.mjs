import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

// Real route/schema code, isolated environment and mocked fetch. No network.
const root = process.cwd();
const require = createRequire(import.meta.url);
const schemaSource = await readFile(
  path.join(root, "lib/contact-schema.ts"),
  "utf8",
);
const routeSource = await readFile(
  path.join(root, "app/api/contact/route.ts"),
  "utf8",
);
const emailSource = await readFile(
  path.join(root, "lib/contact-email.ts"),
  "utf8",
);
const results = [];

function load(source, filename, additions = {}) {
  const compiledModule = { exports: {} };
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });
  vm.runInNewContext(
    compiled.outputText,
    {
      module: compiledModule,
      exports: compiledModule.exports,
      require,
      Response,
      Request,
      URL,
      TextDecoder,
      AbortController,
      Error,
      TypeError,
      SyntaxError,
      crypto,
      setTimeout,
      clearTimeout,
      ...additions,
    },
    { filename },
  );
  return compiledModule.exports;
}
const schema = load(schemaSource, "contact-schema.ts");
const email = load(emailSource, "contact-email.ts");
const valid = {
  fullName: "Website QA",
  email: "qa@example.test",
  company: "QA Agency",
  role: "Executive Assistant",
  message: "A local-only contact integration verification.",
  phone: "",
  website: "",
};

async function run(
  name,
  {
    env = {},
    body = valid,
    raw,
    headers = {},
    expected = 503,
    code = "not_connected",
    receiver,
    fastTimeout = false,
    diagnostic,
  } = {},
) {
  const calls = [];
  const logs = [];
  const route = load(routeSource, "contact-route.ts", {
    require: (id) =>
      id === "@/lib/contact-schema"
        ? schema
        : id === "@/lib/contact-email"
          ? email
          : require(id),
    process: { env },
    console: { error: (entry) => logs.push(JSON.parse(entry)) },
    ...(fastTimeout
      ? {
          setTimeout: (callback, milliseconds) =>
            setTimeout(callback, milliseconds === 10000 ? 1 : milliseconds),
        }
      : {}),
    fetch: async (url, options) => {
      assert.equal(options.redirect, "manual", "Worker-supported redirect mode");
      calls.push({ url: String(url), options });
      assert(receiver, "Unexpected attempted outbound request in test");
      return receiver(url, options);
    },
  });
  const request = new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: raw ?? JSON.stringify(body),
  });
  const response = await route.POST(request);
  const result = await response.json();
  assert.equal(response.status, expected, name);
  assert.equal(result.code, code, name);
  if (expected === 502 || expected === 429) {
    assert.equal(logs.length, 1, `${name}: one safe failure diagnostic`);
    assert.equal(logs[0].event, "contact_delivery_failed");
    assert.equal(typeof logs[0].elapsedMs, "number");
    for (const key of Object.keys(logs[0])) {
      assert([
        "event", "provider", "reason", "phase", "upstreamStatus", "elapsedMs", "errorType",
      ].includes(key));
    }
  } else {
    assert.equal(logs.length, 0, `${name}: no unnecessary delivery logs`);
  }
  if (diagnostic) {
    for (const [key, value] of Object.entries(diagnostic)) {
      assert.equal(logs[0]?.[key], value, `${name}: diagnostic ${key}`);
    }
  }
  const logText = JSON.stringify(logs);
  for (const sensitive of [
    ...Object.values(env), valid.fullName, valid.email, valid.company,
    valid.message, "private provider detail", "Provider error detail",
    "Mock network failure", "Mock timeout",
  ]) {
    if (sensitive) assert(!logText.includes(sensitive), `${name}: no sensitive log content`);
  }
  if (env.RESEND_API_KEY)
    assert(
      !JSON.stringify(result).includes(env.RESEND_API_KEY),
      "API keys never appear in responses",
    );
  if (!receiver)
    assert.equal(
      calls.length,
      0,
      "Invalid/unconfigured requests never reach a receiver",
    );
  results.push({ name, status: "passed", response: response.status });
  return calls;
}

await run("No receiver: truthful unsent response");
await run("Public Host and HTTPS proxy protocol accepted", {
  headers: {
    Host: "staff.example.test",
    Origin: "https://staff.example.test",
    "X-Forwarded-Proto": "https",
  },
});
await run("Cross-origin rejected", {
  headers: { Host: "staff.example.test", Origin: "https://other.example.test" },
  expected: 403,
  code: "invalid_origin",
});
await run("Malformed JSON rejected", {
  raw: "{",
  expected: 400,
  code: "invalid_json",
});
await run("Wrong content type rejected", {
  headers: { "Content-Type": "text/plain" },
  expected: 415,
  code: "invalid_content_type",
});
await run("Invalid email rejected", {
  body: { ...valid, email: "bad-address" },
  expected: 400,
  code: "invalid_fields",
});
await run("Invalid role rejected", {
  body: { ...valid, role: "Unlisted role" },
  expected: 400,
  code: "invalid_fields",
});
await run("Filled honeypot rejected", {
  body: { ...valid, website: "spam.example.test" },
  expected: 400,
  code: "invalid_fields",
});
await run("Oversized body rejected", {
  body: { ...valid, message: "x".repeat(17000) },
  expected: 413,
  code: "too_large",
});
await run("Insecure receiver rejected", {
  env: { CONTACT_WEBHOOK_URL: "http://receiver.example.test" },
});

const calls = await run("Accepted receiver confirms receipt", {
  env: {
    CONTACT_WEBHOOK_URL: "https://receiver.example.test/enquiries",
    CONTACT_WEBHOOK_TOKEN: "test-token",
  },
  expected: 200,
  code: "received",
  receiver: async () => new Response(null, { status: 202 }),
});
assert.equal(calls.length, 1);
assert.equal(calls[0].options.headers.Authorization, "Bearer test-token");
assert.equal(calls[0].options.redirect, "manual");
const forwarded = JSON.parse(calls[0].options.body);
assert.equal(forwarded.role, "Executive Assistant");
assert(!("website" in forwarded), "Honeypot is not forwarded");
assert.equal(forwarded.source, "real-estate-staff-website");

await run("Rejected receiver never reports success", {
  env: { CONTACT_WEBHOOK_URL: "https://receiver.example.test/enquiries" },
  expected: 502,
  code: "delivery_failed",
  receiver: async () => new Response(null, { status: 500 }),
});
await run("Network failure reports unconfirmed delivery", {
  env: { CONTACT_WEBHOOK_URL: "https://receiver.example.test/enquiries" },
  expected: 502,
  code: "delivery_unknown",
  receiver: async () => {
    throw new Error("Mock network failure");
  },
});

const resendEnv = {
  RESEND_API_KEY: "re_qa_not_a_real_key",
  CONTACT_FROM_EMAIL: "website@notifications.example.test",
  CONTACT_TO_EMAIL: "client@example.test",
};
for (const [name, env] of [
  ["Missing Resend key", { ...resendEnv, RESEND_API_KEY: "" }],
  ["Missing sender", { ...resendEnv, CONTACT_FROM_EMAIL: "" }],
  ["Missing recipient", { ...resendEnv, CONTACT_TO_EMAIL: "" }],
  [
    "Sender header injection",
    {
      ...resendEnv,
      CONTACT_FROM_EMAIL: "sender@example.test\r\nBcc: other@example.test",
    },
  ],
  [
    "Multiple recipients in configuration",
    {
      ...resendEnv,
      CONTACT_TO_EMAIL: "client@example.test,other@example.test",
    },
  ],
  [
    "Invalid API key characters",
    { ...resendEnv, RESEND_API_KEY: "re_key\ninvalid" },
  ],
])
  await run(`${name}: fails closed without network`, { env });

await run("Invalid submission identifier rejected", {
  env: resendEnv,
  headers: { "Idempotency-Key": "invalid" },
  expected: 400,
  code: "invalid_request",
});
await run("Visitor cannot override recipient", {
  env: resendEnv,
  body: { ...valid, to: "other@example.test" },
  expected: 400,
  code: "invalid_fields",
});
await run("Visitor cannot override sender", {
  env: resendEnv,
  body: { ...valid, from: "other@example.test" },
  expected: 400,
  code: "invalid_fields",
});

const submissionId = "0ce788f8-3142-4d10-8f41-bb2f80de15f0";
const receipt = () =>
  Response.json({ id: "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" });
const specialValues = {
  ...valid,
  fullName: 'QA <Sender> & "Team"',
  company: 'QA & Partners <script>alert("x")</script>',
  phone: "+64 9 555 0100",
  message:
    'Please help with <script>alert("x")</script> & admin.\nSecond line.',
};
const sent = await run("Resend accepts a complete notification", {
  env: resendEnv,
  body: specialValues,
  headers: { "Idempotency-Key": submissionId },
  expected: 200,
  code: "received",
  receiver: async () => receipt(),
});
assert.equal(sent.length, 1);
assert.equal(sent[0].url, "https://api.resend.com/emails");
assert.equal(
  sent[0].options.headers.Authorization,
  `Bearer ${resendEnv.RESEND_API_KEY}`,
);
assert.equal(sent[0].options.headers["User-Agent"], "real-estate-staff/1.0");
assert.equal(
  sent[0].options.headers["Idempotency-Key"],
  `contact/${submissionId}`,
);
assert.equal(sent[0].options.redirect, "manual");
assert.equal(sent[0].options.cache, "no-store");
const notification = JSON.parse(sent[0].options.body);
assert.equal(
  notification.from,
  `Real Estate Staff <${resendEnv.CONTACT_FROM_EMAIL}>`,
);
assert.deepEqual(notification.to, [resendEnv.CONTACT_TO_EMAIL]);
assert.equal(notification.reply_to, specialValues.email);
for (const value of [
  specialValues.fullName,
  specialValues.company,
  specialValues.phone,
  specialValues.role,
  specialValues.message,
])
  assert(
    notification.text.includes(value),
    "Plain text retains all enquiry details",
  );
assert(
  !notification.html.includes("<script>"),
  "Untrusted input cannot become email markup",
);
assert(notification.html.includes("&lt;script&gt;"));
assert(notification.html.includes("&amp;"));
assert(notification.html.includes("&quot;"));
assert(notification.html.includes("<br />Second line."));
assert(
  !notification.text.includes("Saving it does not send"),
  "Sent email is not the unsent download template",
);
assert(!("website" in notification));

const retry = await run("Retry keeps an identical Resend payload and key", {
  env: resendEnv,
  body: specialValues,
  headers: { "Idempotency-Key": submissionId },
  expected: 200,
  code: "received",
  receiver: async () => receipt(),
});
assert.equal(retry[0].options.body, sent[0].options.body);
assert.equal(
  retry[0].options.headers["Idempotency-Key"],
  sent[0].options.headers["Idempotency-Key"],
);
const generated = await run("Server creates an identifier when none supplied", {
  env: resendEnv,
  expected: 200,
  code: "received",
  receiver: async () => receipt(),
});
assert.match(
  generated[0].options.headers["Idempotency-Key"],
  /^contact\/[0-9a-f-]{36}$/,
);
assert(
  JSON.parse(generated[0].options.body).text.includes("Phone: Not provided"),
);

const priority = await run("Resend takes precedence over legacy webhook", {
  env: { ...resendEnv, CONTACT_WEBHOOK_URL: "https://receiver.example.test" },
  expected: 200,
  code: "received",
  receiver: async () => receipt(),
});
assert.equal(priority.length, 1);
assert.equal(priority[0].url, "https://api.resend.com/emails");
const rejected = await run(
  "Rejected Resend request never falls back to webhook",
  {
    env: { ...resendEnv, CONTACT_WEBHOOK_URL: "https://receiver.example.test" },
    expected: 502,
    code: "delivery_failed",
    receiver: async () =>
      Response.json({ message: "private provider detail" }, { status: 403 }),
  },
);
assert.equal(rejected.length, 1);
for (const status of [401, 403, 422, 429, 500, 503, 409])
  await run(`Resend ${status} never reports success`, {
    env: resendEnv,
    expected: status === 429 ? 429 : 502,
    code:
      status === 429
        ? "rate_limited"
        : status >= 500 || status === 409
          ? "delivery_unknown"
          : "delivery_failed",
    receiver: async () =>
      Response.json(
        { message: "Provider error detail", name: "mock_error" },
        { status },
      ),
    diagnostic: { reason: "upstream_rejected", upstreamStatus: status, provider: "resend" },
  });
for (const status of [301, 302, 303, 307, 308]) {
  const redirected = await run(`Resend ${status} redirect is rejected without following Location`, {
    env: { ...resendEnv, CONTACT_WEBHOOK_URL: "https://receiver.example.test" },
    expected: 502,
    code: "delivery_failed",
    receiver: async () => new Response(null, {
      status,
      headers: { Location: "https://other.example.test/collect" },
    }),
    diagnostic: { reason: "upstream_rejected", upstreamStatus: status },
  });
  assert.equal(redirected.length, 1, "No redirect or fallback request");
}
await run("Legacy webhook redirect is also rejected", {
  env: { CONTACT_WEBHOOK_URL: "https://receiver.example.test" },
  expected: 502,
  code: "delivery_failed",
  receiver: async () => new Response(null, {
    status: 302,
    headers: { Location: "https://other.example.test/collect" },
  }),
  diagnostic: { reason: "upstream_rejected", upstreamStatus: 302, provider: "webhook" },
});
await run("Resend 2xx without a receipt is unconfirmed", {
  env: resendEnv,
  expected: 502,
  code: "delivery_unknown",
  receiver: async () => Response.json({}),
  diagnostic: { reason: "invalid_receipt", phase: "receipt" },
});
await run("Unreadable Resend receipt is unconfirmed", {
  env: resendEnv,
  expected: 502,
  code: "delivery_unknown",
  receiver: async () => new Response("not json", { status: 200 }),
  diagnostic: { reason: "invalid_receipt", phase: "receipt" },
});
await run("Resend network failure is unconfirmed", {
  env: resendEnv,
  expected: 502,
  code: "delivery_unknown",
  receiver: async () => {
    throw new Error("Mock network failure");
  },
  diagnostic: { reason: "network_error", phase: "request", errorType: "Error" },
});
await run("Immediate fetch TypeError is classified without leaking its message", {
  env: resendEnv,
  expected: 502,
  code: "delivery_unknown",
  receiver: async () => {
    throw new TypeError(`Request failed for ${valid.email} with ${resendEnv.RESEND_API_KEY}`);
  },
  diagnostic: { reason: "network_error", errorType: "TypeError" },
});
await run("Untrusted exception names are excluded from logs", {
  env: resendEnv,
  expected: 502,
  code: "delivery_unknown",
  receiver: async () => {
    const error = new Error("private provider detail");
    error.name = valid.email;
    throw error;
  },
  diagnostic: { reason: "network_error", errorType: "unknown" },
});
await run("Resend timeout aborts request and never reports success", {
  env: resendEnv,
  expected: 502,
  code: "delivery_unknown",
  fastTimeout: true,
  diagnostic: { reason: "timeout", phase: "request" },
  receiver: async (_url, options) =>
    new Promise((_resolve, reject) =>
      options.signal.addEventListener(
        "abort",
        () => reject(new Error("Mock timeout")),
        { once: true },
      ),
    ),
});

await mkdir(path.join(root, "output/qa"), { recursive: true });
await writeFile(
  path.join(root, "output/qa/contact-email-preview.html"),
  notification.html,
);
await writeFile(
  path.join(root, "output/qa/contact-report.json"),
  JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2),
);
console.log(
  JSON.stringify(
    { status: "passed", checks: results.length, externalRequests: 0 },
    null,
    2,
  ),
);
