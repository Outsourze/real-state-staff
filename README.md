# Real Estate Staff

A responsive real estate staffing landing page built with Next.js App Router,
TypeScript, Tailwind CSS, Manrope, Lucide, Motion, React Hook Form and Zod.

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The project now uses npm and `package-lock.json`.

## Verify

```sh
npm run typecheck
npm run lint
npm run build
npm run test:contact
npm run test:browser
```

To check role cards in an already-running local development server:

```sh
npm run test:roles:dev
```

This read-only check defaults to `http://localhost:3000`, accepts a loopback
`QA_BASE_URL` override, and never submits forms or stops the existing server.
It writes evidence to `output/qa/roles-development/`.
Save CSS as UTF-8 without a BOM: a BOM in a CSS module can stop its first
selector from matching in the development bundle even when production passes.

The browser check requires a production build and an installed Chrome or Edge.
It uses the installed browser directly, without downloading another browser.
Set `BROWSER_PATH` if the executable is not in a standard location. The check
owns its local server, explicitly disables enquiry delivery, and tests eight
viewport widths from 320 to 1920px. It also checks role-card geometry, readable
font sizes, native modal navigation, error-summary focus, 200% text resizing,
custom text spacing, and automated WCAG 2.2 A/AA rules through axe-core.
Screenshots and detailed reports are saved in the ignored `output/qa/` directory.

## Website content

- A two-column hero, readable 16–19px content, and a 1200px content maximum.
- Compact colored role cards with an expandable responsibilities guide.
- Native modal mobile navigation with Escape, focus management and scroll locking.
- A dedicated `/contact` page with a split enquiry opening, workspace photography,
  three-step process, staffing categories, five FAQs and social icon placeholders.
- Local optimized WebP photography and a lightweight SVG brand mark.
- Privacy and terms draft routes, metadata, Open Graph, sitemap and robots.
- Clearly disclosed sample testimonials. No invented social account links.

The owner subsequently requested a new hero, larger text and colored cards,
and authorized improving the design freely. The original content and palette
remain in `docs/website-brief.md`; current decisions are in `PROJECT_STATUS.md`.

Social URLs can be added in `lib/contact-details.ts`. Until configured, icons
are labeled coming-soon placeholders rather than links to invented profiles.

## Enquiry delivery

Copy `.env.example` to `.env.local` for local configuration. Set the public
canonical URL through `NEXT_PUBLIC_SITE_URL`.

Email sending is implemented through Resend. Configure these **runtime**
settings in Cloudflare Workers (or ignored `.env.local` for local development):

```dotenv
RESEND_API_KEY=
CONTACT_FROM_EMAIL=
CONTACT_TO_EMAIL=
```

The key must be a server-only secret. The sender must be a bare address on a
Resend-verified domain; the recipient is the client's actual inbox, including
Google Workspace. Visitor emails become Reply-To. Messages include escaped
HTML and plain text, with duplicate protection for unchanged retries.

The form resets only after a valid receipt. Until configured, it remains
truthfully unsent. Full activation steps are in
[docs/contact-integration.md](docs/contact-integration.md).

The optional legacy `CONTACT_WEBHOOK_URL`/`CONTACT_WEBHOOK_TOKEN` integration
is used only if all Resend settings are blank. Never point it at Resend's API.

Without a receiver, the form truthfully says the enquiry has **not been sent**
and offers a local copy/download. It does not simulate email delivery.

## Deployment compatibility

The repository includes a pinned OpenNext adapter and Wrangler, plus
`open-next.config.ts` and `wrangler.jsonc`. Set these in Cloudflare under
**Workers & Pages → real-state-staff → Settings → Builds**:

| Setting | Command |
| --- | --- |
| Build command | `npm run build:cloudflare` |
| Production deploy command | `npx wrangler deploy --keep-vars` |
| Non-production deploy command | `npx wrangler preview` |
| Root directory | `/` |

Keep `main` as the production branch and enable `develop` for previews.
`npm run build` builds Next.js alone; `npm run build:cloudflare` also converts
that output into `.open-next/worker.js` and `.open-next/assets` for Workers.
Commit and push the configuration and lockfile before retrying the build.

The required `previews` block is included in `wrangler.jsonc`. Preview secrets
do **not** inherit production values. Configure email settings in the Preview
Base configuration or the individual Preview if you want to test delivery
there; otherwise the contact form truthfully reports that it is not connected.
Keep API keys out of Wrangler configuration and Git. See
[Cloudflare preview configuration](https://developers.cloudflare.com/workers/previews/configuration/).

For a local Worker preview, run `npm run preview`. To deploy manually, use
`npm run deploy` (production) or `npm run deploy:preview` (current Git branch).
The hosted `wrangler preview` command creates a branch deployment; OpenNext's
`preview` command starts a local Worker server. These are different commands.
The site currently needs no R2, queue or database resources. Only the static
assets binding is configured. Generated Worker output and local secrets are
ignored; approved native dependency install scripts are pinned in package.json.

Keep **Next.js and eslint-config-next pinned to 16.3.8**. Next.js 16.4 currently
hits [OpenNext issue #1355](https://github.com/opennextjs/opennextjs-cloudflare/issues/1355)
when loading `preview-props.json`. Cache Components and partial prefetching
remain disabled because they previously hung requests in the Worker runtime.

Photographs are optimized locally as WebP. Next Image provides stable sizing,
hero preloading and lazy loading, with runtime optimization disabled to keep
the site independent of a Cloudflare Images binding. See
[OpenNext's image requirements](https://opennext.js.org/cloudflare/howtos/image)
before enabling runtime image transforms.

No Git push, production deployment, domain change or hosting-account change is
performed by this website implementation.

## Client launch items

Configure Resend and confirm a genuine enquiry reaches the client, confirm the public domain and starting price,
approve the founder biographies, replace the illustrative workspace photograph
with an approved founder portrait if desired, replace the sample testimonials,
and approve the draft legal content. Photography sources and licences are in
`docs/asset-sources.md`.

## Continue in a later chat

Read **`PROJECT_STATUS.md` first**. The full brief is saved in
`docs/website-brief.md`, and `AGENTS.md` points future sessions to the status
file. A useful continuation message is:

> Read PROJECT_STATUS.md and continue the Real Estate Staff website from the saved state.

Preserve completed work and update the status file after changes.
