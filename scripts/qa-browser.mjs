import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createServer } from "node:net";

// Uses an existing browser: no browser download or runtime dependency required.
// The owned local server has enquiry delivery explicitly disabled.
const root = process.cwd();
const rolesOnly = process.argv.includes("--roles-only");
const previewUrl = rolesOnly
  ? process.env.QA_BASE_URL || "http://localhost:3000"
  : null;
if (previewUrl) {
  const preview = new URL(previewUrl);
  assert(
    ["localhost", "127.0.0.1", "[::1]"].includes(preview.hostname),
    "Role layout checks must use a local preview",
  );
}
const output = path.join(
  root,
  "output",
  "qa",
  ...(rolesOnly ? ["roles-development"] : []),
);
const browserPath =
  process.env.BROWSER_PATH ||
  [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].find(existsSync);
assert(
  browserPath,
  "Set BROWSER_PATH to an installed Chrome or Edge executable.",
);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const results = [];
const errors = [];
let server;
let browser;
let cdp;

async function freePort() {
  const socket = createServer();
  await new Promise((resolve) => socket.listen(0, "127.0.0.1", resolve));
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  return port;
}

async function waitFor(check, message, timeout = 20000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      if (await check()) return;
    } catch {
      /* wait for startup/render */
    }
    await delay(150);
  }
  throw new Error(`Timed out: ${message}`);
}

class DevTools {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.pending = new Map();
    this.id = 0;
    this.socket.addEventListener("message", ({ data }) => {
      const message = JSON.parse(data);
      if (message.id) {
        const operation = this.pending.get(message.id);
        if (!operation) return;
        this.pending.delete(message.id);
        clearTimeout(operation.timeout);
        if (message.error)
          operation.reject(new Error(JSON.stringify(message.error)));
        else operation.resolve(message.result);
      } else if (message.method === "Runtime.exceptionThrown") {
        errors.push(
          message.params.exceptionDetails.exception?.description ||
            message.params.exceptionDetails.text,
        );
      }
    });
  }
  async ready() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`CDP timeout: ${method}`));
      }, 25000);
      this.pending.set(id, { resolve, reject, timeout });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }
  async evaluate(expression) {
    const result = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails)
      throw new Error(
        result.exceptionDetails.exception?.description ||
          result.exceptionDetails.text,
      );
    return result.result.value;
  }
}

function passed(name, details) {
  results.push({ name, status: "passed", ...(details ? { details } : {}) });
}

async function screenshot(filename, fullPage = true) {
  const metrics = await cdp.send("Page.getLayoutMetrics");
  const size = fullPage
    ? metrics.cssContentSize
    : {
        width: metrics.cssLayoutViewport.clientWidth,
        height: metrics.cssLayoutViewport.clientHeight,
      };
  const result = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: size.width, height: size.height, scale: 1 },
  });
  await writeFile(
    path.join(output, filename),
    Buffer.from(result.data, "base64"),
  );
}

async function accessibilityAudit(label) {
  const source = await readFile(
    path.join(root, "node_modules/axe-core/axe.min.js"),
    "utf8",
  );
  await cdp.evaluate(source);
  const audit = await cdp.evaluate(
    `axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']}}).then(r => ({violations: r.violations.map(v => ({id:v.id, impact:v.impact, help:v.help, url:v.helpUrl, nodes:v.nodes.map(n=>({target:n.target, failure:n.failureSummary}))})), incomplete: r.incomplete.map(v=>({id:v.id, targets:v.nodes.map(n=>n.target)})), passedRules:r.passes.length}))`,
  );
  await writeFile(
    path.join(output, `accessibility-${label}.json`),
    JSON.stringify(audit, null, 2),
  );
  assert.deepEqual(
    audit.violations,
    [],
    `Automated WCAG A/AA checks: ${label}`,
  );
  passed(`Automated WCAG 2.2 A/AA checks: ${label}`, audit);
}

async function screenshotElement(selector, filename) {
  const clip = await cdp.evaluate(`(() => {
    const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();
    return {x:0,y:Math.max(0,r.top+scrollY-16),width:innerWidth,height:r.height+32,scale:1};
  })()`);
  const shot = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip,
  });
  await writeFile(
    path.join(output, filename),
    Buffer.from(shot.data, "base64"),
  );
}

async function fillEnquiry() {
  for (const [id, text] of Object.entries({
    "contact-name": "Website QA",
    "contact-email": "qa@example.test",
    "contact-company": "QA Agency",
    "contact-message": "This is a local-only enquiry validation check.",
  })) {
    await cdp.evaluate(
      `document.getElementById(${JSON.stringify(id)}).focus()`,
    );
    await cdp.send("Input.insertText", { text });
  }
  await cdp.evaluate(
    `document.getElementById('contact-role').value = 'Executive Assistant'; document.getElementById('contact-role').dispatchEvent(new Event('change', {bubbles:true}))`,
  );
}

try {
  await mkdir(output, { recursive: true });
  const sitePort = previewUrl ? null : await freePort();
  const debugPort = await freePort();
  const base = previewUrl || `http://127.0.0.1:${sitePort}`;
  if (!previewUrl)
    server = spawn(
      process.execPath,
      [
        "node_modules/next/dist/bin/next",
        "start",
        "--hostname",
        "127.0.0.1",
        "--port",
        String(sitePort),
      ],
      {
        cwd: root,
        windowsHide: true,
        stdio: "ignore",
        env: {
          ...process.env,
          CONTACT_WEBHOOK_URL: "",
          CONTACT_WEBHOOK_TOKEN: "",
          RESEND_API_KEY: "",
          CONTACT_FROM_EMAIL: "",
          CONTACT_TO_EMAIL: "",
          NEXT_TELEMETRY_DISABLED: "1",
        },
      },
    );
  await waitFor(async () => (await fetch(base)).ok, "local website");
  browser = spawn(
    browserPath,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-background-networking",
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${path.join(root, ".next", `qa-profile-${process.pid}`)}`,
      "about:blank",
    ],
    {
      windowsHide: true,
      stdio: "ignore",
    },
  );
  const debugUrl = `http://127.0.0.1:${debugPort}`;
  await waitFor(
    async () => (await fetch(`${debugUrl}/json/version`)).ok,
    "headless browser",
  );
  const target = await (
    await fetch(`${debugUrl}/json/new?about:blank`, { method: "PUT" })
  ).json();
  cdp = new DevTools(target.webSocketDebuggerUrl);
  await cdp.ready();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });

  for (const width of [320, 375, 390, 768, 1024, 1280, 1440, 1920]) {
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    await cdp.send("Page.navigate", { url: base });
    await waitFor(
      () =>
        cdp.evaluate(
          'document.readyState === "complete" && !!document.querySelector("#contact")',
        ),
      `page at ${width}px`,
    );
    await cdp.evaluate("document.fonts.ready.then(() => true)");
    await delay(350);
    const height = await cdp.evaluate("document.documentElement.scrollHeight");
    for (let position = 0; position < height; position += 850) {
      await cdp.evaluate(`window.scrollTo(0, ${position})`);
      await delay(60);
    }
    await waitFor(
      () =>
        cdp.evaluate(
          "[...document.images].every(image => image.complete && image.naturalWidth > 0)",
        ),
      "all local photographs",
    );
    await cdp.evaluate("window.scrollTo(0, 0)");
    const layout = await cdp.evaluate(`({
      viewport: innerWidth, document: document.documentElement.scrollWidth,
      headingCount: document.querySelectorAll('h1').length,
      roleCount: document.querySelectorAll('#roles article').length,
      roleGridDisplay: getComputedStyle(document.querySelector('#roles article').parentElement).display,
      benefitsHeadingColor: getComputedStyle(document.querySelector('#benefits-heading')).color,
      missingAnchors: [...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')).filter(h=>h.length>1&&!document.getElementById(h.slice(1))),
      brokenImages: [...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),
      font: getComputedStyle(document.body).fontFamily,
      containerWidth: document.querySelector('.site-container').getBoundingClientRect().width,
      cards: [...document.querySelectorAll('#roles article')].slice(0,8).map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}}),
      smallestContentFont: Math.min(...[...document.querySelectorAll('main p, main h3, main label, main button, main a, .nav-link, .footer-bottom a')].filter(el=>el.getClientRects().length).map(el=>parseFloat(getComputedStyle(el).fontSize))),
      smallText: [...document.querySelectorAll('main p, main h3, main label, main button, main a, .nav-link, .footer-bottom a')].filter(el=>el.getClientRects().length && parseFloat(getComputedStyle(el).fontSize)<16).map(el=>({tag:el.tagName,cls:el.className,text:el.textContent.slice(0,80),size:getComputedStyle(el).fontSize}))
    })`);
    assert(
      layout.document <= layout.viewport + 1,
      `Horizontal overflow at ${width}px: ${JSON.stringify(layout)}`,
    );
    assert.equal(layout.headingCount, 1, "One semantic homepage heading");
    assert(layout.roleCount >= 8, "All eight staffing roles are present");
    assert.equal(
      layout.roleGridDisplay,
      "grid",
      "The role grid rule is applied by the running server",
    );
    assert.equal(
      layout.benefitsHeadingColor,
      "rgb(255, 255, 255)",
      "Dark section heading contrast",
    );
    assert.deepEqual(
      layout.missingAnchors,
      [],
      "All same-page anchors have targets",
    );
    assert.deepEqual(layout.brokenImages, [], "No broken photographs");
    assert.match(layout.font, /manrope/i, "Manrope is applied");
    assert(layout.containerWidth <= 1201, "Content width stays within 1200px");
    assert(
      layout.smallestContentFont >= 16,
      `Content and actions are at least 16px: ${JSON.stringify(layout.smallText)}`,
    );
    if (width >= 600) {
      assert(
        Math.abs(layout.cards[0].y - layout.cards[1].y) < 1 &&
          layout.cards[2].y > layout.cards[0].y,
        "Two compact role cards share each row",
      );
      assert(
        Math.max(...layout.cards.map((c) => c.height)) < 440,
        "Role cards do not stretch into empty rows",
      );
    }
    passed(`Responsive layout ${width}px`, layout);
    if (width === 390) {
      await screenshot("mobile-390.png");
      await screenshot("mobile-390-top.png", false);
      await screenshotElement(".hero-services", "services-mobile.png");
    }
    if (width === 1440) {
      await screenshot("desktop-1440.png");
      await screenshot("desktop-1440-top.png", false);
      await screenshotElement(".hero-services", "services-desktop.png");
      const roleBounds = await cdp.evaluate(
        `(() => {const r=document.querySelector('#roles').getBoundingClientRect();return {x:0,y:r.top+scrollY,width:innerWidth,height:r.height,scale:1}})()`,
      );
      const roleShot = await cdp.send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: true,
        clip: roleBounds,
      });
      await writeFile(
        path.join(output, "roles-desktop.png"),
        Buffer.from(roleShot.data, "base64"),
      );
      await accessibilityAudit("home-desktop");
    }
  }

  // Checks against an existing development server are strictly read-only:
  // never submit an enquiry to a server whose delivery settings we do not own.
  if (!rolesOnly) {
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
    });
    await cdp.evaluate(
      'window.scrollTo(0,0); document.querySelector(".menu-toggle").click()',
    );
    await waitFor(
      () =>
        cdp.evaluate(
          'document.querySelector(".menu-toggle").getAttribute("aria-expanded")==="true"',
        ),
      "mobile navigation opens",
    );
    assert.equal(
      await cdp.evaluate("document.body.style.overflow"),
      "hidden",
      "Menu locks background scroll",
    );
    assert.equal(
      await cdp.evaluate(
        'document.querySelector(".mobile-nav").matches(":modal")',
      ),
      true,
      "Native dialog makes the background inert",
    );
    await accessibilityAudit("home-mobile-menu");
    await cdp.send("Input.dispatchKeyEvent", {
      type: "keyDown",
      key: "Escape",
      code: "Escape",
      windowsVirtualKeyCode: 27,
    });
    await waitFor(
      () =>
        cdp.evaluate(
          'document.querySelector(".menu-toggle").getAttribute("aria-expanded")==="false"',
        ),
      "Escape closes menu",
    );
    assert.notEqual(
      await cdp.evaluate("document.body.style.overflow"),
      "hidden",
      "Menu restores scrolling",
    );
    assert.equal(
      await cdp.evaluate(
        'document.activeElement === document.querySelector(".menu-toggle")',
      ),
      true,
      "Escape restores focus to the menu trigger",
    );
    await cdp.evaluate('document.querySelector(".menu-toggle").click()');
    await waitFor(
      () => cdp.evaluate('document.querySelector(".mobile-nav").open'),
      "menu reopened",
    );
    await cdp.evaluate(
      `document.querySelector('.mobile-nav a[href="#roles"]').click()`,
    );
    await waitFor(
      () =>
        cdp.evaluate(
          '!document.querySelector(".mobile-nav").open && location.hash==="#roles"',
        ),
      "menu anchor navigation",
    );
    assert.equal(
      await cdp.evaluate("document.activeElement.id"),
      "roles-heading",
      "Section navigation moves focus to the destination",
    );
    passed("Mobile menu, Escape, scroll locking and section navigation");

    await cdp.evaluate(
      'document.querySelector("#roles details summary").click()',
    );
    assert.equal(
      await cdp.evaluate('document.querySelector("#roles details").open'),
      true,
      "Role guide expands",
    );
    await cdp.evaluate(
      'document.querySelector("#roles details summary").click()',
    );
    passed("Expandable role responsibilities");

    await cdp.evaluate('document.querySelector("form").requestSubmit()');
    await waitFor(
      () => cdp.evaluate('!!document.querySelector("#contact-name-error")'),
      "required form validation",
    );
    assert.equal(
      await cdp.evaluate(
        'document.querySelector("#contact-email").getAttribute("aria-invalid")',
      ),
      "true",
    );
    passed("Required form fields and accessible validation errors");
    assert.equal(
      await cdp.evaluate("document.activeElement.id"),
      "contact-error-summary",
      "Invalid submission focuses the error summary",
    );
    await accessibilityAudit("home-mobile-errors");
    // First attempt uses our owned unconfigured server. Subsequent successes
    // are browser-only mocks: no real emails, API keys or receivers are used.
    await cdp.evaluate(`window.__qaContactRequests=[];window.__qaOriginalFetch=window.fetch.bind(window);window.fetch=async(input,options)=>{
      if(input==='/api/contact' && options?.method==='POST') {
        window.__qaContactRequests.push({key:new Headers(options.headers).get('Idempotency-Key'),body:options.body});
        if(window.__qaContactRequests.length>1) return Response.json({code:'received',message:'Thank you. Your enquiry has been submitted.'});
      }
      return window.__qaOriginalFetch(input,options);
    }`);
    await fillEnquiry();
    await cdp.evaluate('document.querySelector("form").requestSubmit()');
    await waitFor(
      () =>
        cdp.evaluate(
          '!!document.querySelector("form [role=alert]") && document.querySelector("form [role=alert]").textContent.includes("has not been sent")',
        ),
      "truthful unsent fallback",
    );
    assert.match(
      await cdp.evaluate(
        'document.querySelector("form [role=alert]").textContent',
      ),
      /Copy enquiry.*Download enquiry/s,
    );
    passed(
      "Unconnected contact form shows unsent state and copy/download actions",
    );
    assert.equal(
      await cdp.evaluate('document.getElementById("contact-name").value'),
      "Website QA",
      "Failed submissions preserve entered details",
    );
    await waitFor(
      () =>
        cdp.evaluate(
          'document.querySelector("form").getAttribute("aria-busy")!=="true"',
        ),
      "First submission settled",
    );
    await cdp.evaluate('document.querySelector("form").requestSubmit()');
    await waitFor(
      () =>
        cdp.evaluate(
          'document.querySelector("form [role=status]")?.textContent.includes("submitted")',
        ),
      "Mock accepted email response",
    );
    const resetFields = await cdp.evaluate(
      `Object.fromEntries(['name','email','company','phone','role','message'].map(name=>[name,document.getElementById('contact-'+name).value]))`,
    );
    assert.deepEqual(
      resetFields,
      { name: "", email: "", company: "", phone: "", role: "", message: "" },
      "Successful submissions reset all visible fields",
    );
    const attempts = await cdp.evaluate("window.__qaContactRequests");
    assert.match(attempts[0].key, /^[0-9a-f-]{36}$/);
    assert.equal(
      attempts[0].key,
      attempts[1].key,
      "Unchanged retries reuse the submission key",
    );
    assert.equal(
      attempts[0].body,
      attempts[1].body,
      "Unchanged retries send an identical payload",
    );
    assert(
      !(await cdp.evaluate(
        'document.querySelector("form [role=status]").textContent.includes("Copy enquiry")',
      )),
      "Accepted submissions remove unsent actions",
    );
    passed("Accepted email response, reset behavior and duplicate-safe retry");
    await waitFor(
      () =>
        cdp.evaluate(
          'document.querySelector("form").getAttribute("aria-busy")!=="true"',
        ),
      "Successful submission settled",
    );
    await fillEnquiry();
    await cdp.evaluate('document.querySelector("form").requestSubmit()');
    await waitFor(
      () => cdp.evaluate("window.__qaContactRequests.length===3"),
      "New enquiry submission",
    );
    const newKey = await cdp.evaluate("window.__qaContactRequests[2].key");
    assert.notEqual(
      newKey,
      attempts[1].key,
      "A new enquiry gets a fresh key even with identical details",
    );
    await waitFor(
      () =>
        cdp.evaluate(
          'document.querySelector("form").getAttribute("aria-busy")!=="true"',
        ),
      "New submission settled",
    );
    await cdp.evaluate(
      "window.fetch=window.__qaOriginalFetch;delete window.__qaOriginalFetch;delete window.__qaContactRequests",
    );
    passed("A fresh enquiry receives a new submission key");

    for (const route of [
      "/contact",
      "/privacy",
      "/terms",
      "/robots.txt",
      "/sitemap.xml",
      "/favicon.svg",
    ]) {
      assert.equal((await fetch(`${base}${route}`)).status, 200, route);
    }
    assert.equal((await fetch(`${base}/does-not-exist`)).status, 404);
    passed("Contact, privacy, terms, robots, sitemap, favicon and 404 routes");
    for (const route of ["/", "/contact"]) {
      for (const width of route === "/contact"
        ? [320, 768, 1024, 1440]
        : [320, 1440]) {
        await cdp.send("Emulation.setDeviceMetricsOverride", {
          width,
          height: 1000,
          deviceScaleFactor: 1,
          mobile: width < 768,
        });
        await cdp.send("Page.navigate", { url: `${base}${route}` });
        await waitFor(
          () =>
            cdp.evaluate(
              `document.readyState === 'complete' && location.pathname === ${JSON.stringify(route)} && !!document.querySelector('h1')`,
            ),
          `${route} at ${width}px`,
        );
        await cdp.evaluate("document.fonts.ready.then(()=>true)");
        await delay(250);
        const normal = await cdp.evaluate(
          '({viewport:innerWidth, width:document.documentElement.scrollWidth, h1:document.querySelectorAll("h1").length})',
        );
        assert.equal(normal.h1, 1, "One page heading");
        assert(
          normal.width <= normal.viewport + 1,
          `${route} reflow at ${width}px`,
        );
        if (route === "/contact") {
          const contactLayout = await cdp.evaluate(`({
          sections: document.querySelectorAll('main > section').length,
          steps: document.querySelectorAll('#contact-process ol > li').length,
          questions: document.querySelectorAll('main details').length,
          missingAnchors: [...document.querySelectorAll('main a[href^="#"]')].map(a=>a.getAttribute('href')).filter(h=>h.length>1&&!document.getElementById(h.slice(1))),
          smallText: [...document.querySelectorAll('main p,main h3,main label,main button,main a,main li,main summary')].filter(el=>el.checkVisibility() && parseFloat(getComputedStyle(el).fontSize)<16).map(el=>({text:el.textContent.slice(0,60),size:getComputedStyle(el).fontSize})),
          brokenImages: [...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)
        })`);
          assert(
            contactLayout.sections >= 4,
            "Contact page has distinct enquiry, process, staffing and FAQ sections",
          );
          assert.equal(contactLayout.steps, 3, "Three clear next steps");
          assert.equal(contactLayout.questions, 5, "Five staffing FAQs");
          assert.deepEqual(
            contactLayout.missingAnchors,
            [],
            "Contact page actions have real targets",
          );
          assert.deepEqual(
            contactLayout.smallText,
            [],
            "Contact page text remains readable",
          );
          assert.deepEqual(
            contactLayout.brokenImages,
            [],
            "Contact photograph loads",
          );
          await accessibilityAudit(`contact-${width}`);
          if (width === 1440) {
            await screenshot("contact-desktop-top.png", false);
            await screenshot("contact-desktop.png");
            await cdp.evaluate(
              'document.querySelector("main details summary").click()',
            );
            assert.equal(
              await cdp.evaluate('document.querySelector("main details").open'),
              true,
              "Contact FAQ expands",
            );
            await cdp.evaluate(
              'document.querySelector("main details summary").click()',
            );
            await cdp.evaluate(
              'document.querySelector("form").requestSubmit()',
            );
            await waitFor(
              () =>
                cdp.evaluate(
                  'document.activeElement.id === "contact-error-summary"',
                ),
              "Contact page validation summary",
            );
            await accessibilityAudit("contact-desktop-errors");
            passed(
              "Contact page FAQs, form validation and error-summary focus",
            );
          }
          if (width === 320) await screenshot("contact-mobile.png");
        }
        await cdp.evaluate(`document.documentElement.style.fontSize='200%'`);
        await delay(150);
        const resized = await cdp.evaluate(
          '({viewport:innerWidth, width:document.documentElement.scrollWidth, overflowing:[...document.querySelectorAll("main *, header *")].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left< -1)}).slice(0,8).map(el=>({tag:el.tagName,cls:el.className,text:el.textContent.slice(0,60)}))})',
        );
        assert(
          resized.width <= resized.viewport + 1,
          `200% text resize ${route} ${width}px: ${JSON.stringify(resized)}`,
        );
        await cdp.evaluate(
          `document.documentElement.style.fontSize=''; const style=document.createElement('style');style.id='qa-spacing';style.textContent='body * {line-height:1.5 !important; letter-spacing:.12em !important;word-spacing:.16em !important} p {margin-bottom:2em !important}';document.head.append(style)`,
        );
        await delay(150);
        const spacing = await cdp.evaluate(
          "({viewport:innerWidth,width:document.documentElement.scrollWidth})",
        );
        assert(
          spacing.width <= spacing.viewport + 1,
          `Text spacing ${route} ${width}px`,
        );
        await cdp.evaluate(`document.getElementById('qa-spacing').remove()`);
        passed(
          `Reflow, 200% text resize and custom text spacing: ${route} ${width}px`,
        );
      }
    }
    await cdp.send("Page.navigate", { url: base });
    await waitFor(
      () =>
        cdp.evaluate(
          'document.readyState === "complete" && location.pathname === "/"',
        ),
      "homepage focus checks",
    );
    const focusAudit = await cdp.evaluate(`(() => {
    const failures=[];
    for (const el of document.querySelectorAll('main a[href], main button, main input:not([type=hidden]), main textarea, main select, main summary')) {
      if (!el.getClientRects().length) continue;
      const closedDetails=el.closest('details:not([open])');
      if(closedDetails && el!==closedDetails.querySelector('summary')) continue;
      el.focus();
      const r=el.getBoundingClientRect();
      const header=document.querySelector('header');
      const floor=getComputedStyle(header).position==='sticky'?header.getBoundingClientRect().bottom:0;
      if(r.bottom<=floor||r.top>=innerHeight) failures.push({tag:el.tagName,id:el.id,text:el.textContent.slice(0,60)});
    }
    return failures;
  })()`);
    assert.deepEqual(
      focusAudit,
      [],
      "Focused main controls remain visible below the sticky header",
    );
    passed("Focus visibility beneath the sticky header");
    const payload = {
      fullName: "Website QA",
      email: "qa@example.test",
      company: "QA Agency",
      role: "Executive Assistant",
      message: "Local verification only; delivery is disabled.",
      phone: "",
      website: "",
    };
    for (const test of [
      { name: "unconfigured", body: JSON.stringify(payload), status: 503 },
      {
        name: "invalid fields",
        body: JSON.stringify({ email: "bad" }),
        status: 400,
      },
      { name: "malformed JSON", body: "{", status: 400 },
      {
        name: "oversized body",
        body: JSON.stringify({ ...payload, message: "x".repeat(17000) }),
        status: 413,
      },
      {
        name: "cross-origin",
        body: JSON.stringify(payload),
        status: 403,
        origin: "https://example.test",
      },
    ]) {
      const response = await fetch(`${base}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(test.origin ? { Origin: test.origin } : {}),
        },
        body: test.body,
      });
      assert.equal(response.status, test.status, test.name);
    }
    passed(
      "Contact endpoint validation, size cap, origin check and no-backend response",
    );
  }
  assert.deepEqual(errors, [], "No uncaught browser errors");
  passed("No uncaught browser exceptions");
  console.log(
    JSON.stringify(
      {
        status: "passed",
        checks: results.length,
        screenshots: ["desktop-1440.png", "mobile-390.png"].map((filename) =>
          path
            .relative(root, path.join(output, filename))
            .replaceAll("\\", "/"),
        ),
      },
      null,
      2,
    ),
  );
} catch (error) {
  results.push({ name: "QA run", status: "failed", error: error.stack });
  if (cdp)
    results.push({
      name: "Failure diagnostics",
      details: await cdp
        .evaluate(
          `({ formErrors: [...document.querySelectorAll('form p[id$="-error"]')].map(p=>p.textContent), formStatus: document.querySelector('form [role=alert]')?.textContent, fieldLengths: Object.fromEntries([...new FormData(document.querySelector('form')).entries()].map(([key,value])=>[key,String(value).length])) })`,
        )
        .catch(() => null),
    });
  console.error(error);
  if (cdp) await screenshot("failure.png").catch(() => {});
  process.exitCode = 1;
} finally {
  await mkdir(output, { recursive: true });
  await writeFile(
    path.join(output, "report.json"),
    JSON.stringify(
      { checkedAt: new Date().toISOString(), results, browserErrors: errors },
      null,
      2,
    ),
  );
  if (cdp) {
    cdp.send("Browser.close").catch(() => {});
    await delay(150);
    cdp.socket.close();
  }
  browser?.kill();
  server?.kill();
}
