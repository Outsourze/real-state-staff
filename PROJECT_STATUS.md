# Real Estate Staff — continuation notes

Last updated: **2026-10-15 (Asia/Manila)**.

## Latest client changes — public contact details

Paul supplied `hello@realestatestaff.nz` and phone/WhatsApp `+64 22 646 6569`
for display. These are implemented in `businessContact` in
`lib/contact-details.ts`, with reusable `ContactLinks` and a CSS Module.
The homepage contact section, dedicated contact introduction and footer show
clickable email, telephone and WhatsApp links. Destinations are
`mailto:hello@realestatestaff.nz`, `tel:+64226466569`, and
`https://wa.me/64226466569`. All visible labels/values are at least 16px,
targets at least 44px, email wraps on narrow layouts, and the WhatsApp link
has a new-tab notice and `noopener noreferrer`. No message is sent on page load.

The full Cloudflare build/TypeScript pass, and generated home/contact HTML
contains the exact approved email, phone and WhatsApp destinations. All 33
browser checks pass, including automated accessibility checks and reflow at
320–1920px and 200% text size. Desktop/mobile screenshots were reviewed with
no horizontal overflow. Email delivery credentials were blank in the owned
test server; no real messages were sent, and test processes have stopped.

The working tree was clean at the start of this contact update, so the earlier
hero/logo/price changes have been committed by the user. This contact update is
local on `develop`; no commit, push, deployment, real email, WhatsApp message,
account setting or credential change was performed.

Latest launch context from the conversation: Paul registered only
`realestatestaff.nz` through Rocketspark; `.co.nz` is postponed. Cloudflare
onboarding assigned `damiete.ns.cloudflare.com` and `samara.ns.cloudflare.com`.
The last shared dashboard showed Invalid nameservers; Paul must update them
at Rocketspark and wait for Active before attaching root/www Worker domains.
Google Workspace is being set up; preserve existing Google DNS records before
switching authoritative DNS. Resend sender verification still needs to be
confirmed for the custom domain. The user was instructed to set
`CONTACT_TO_EMAIL=hello@realestatestaff.nz` in Worker runtime settings; public
display code does not change those settings. No account state was inspected.

## Latest client changes — hero and logo

**Latest readability adjustment:** the owner clarified that the wording beside
the building icon looked small/soft and had too much space underneath. The
website logo now uses larger letter heights (23/18/12 units), stronger outlined
weights (600/500/500), darker secondary text `#476855`, and tighter gaps between
lines. Its viewBox is 353 × 80 and transparent export 3840 × 870. Header/footer
use this readable version. The prior reference-matched normal/light SVGs and
3840 × 892 PNG are preserved as `brand-logo-reference.svg`,
`brand-logo-light-reference.svg` and `brand-logo-reference-4k.png` in public.
Desktop logo width increased from 288px to 336px; header vertical padding is
10px. Menu collapse/dialog resize thresholds both use 1180/1181px so navigation
has enough room. Mobile logo remains flexible beside the menu button. Hero
copy/layout and existing user pricing edits were preserved.
Validation for this adjustment: Cloudflare build (including TypeScript) and
all 33 browser checks pass. Desktop/mobile header screenshots were reviewed;
the wording is visibly larger/darker, with no menu wrapping or horizontal
overflow. Email delivery was disabled in the owned test server. No commit,
push, deployment or account-setting change was performed.

**Closer logo reference refinement:** the later 517 × 133 client image was used
to refine the logo further. Columns are wider, main lettering and STAFF taller,
the divider darker and moved right, and the tagline lighter and relatively
narrower. The SVG's tightly cropped viewBox is now 353 × 82; outlined text uses
Manrope weights 550/400/400 fitted to the visible bounds of each line. Logo
colors are forest `#003D31` and sage `#7D9886`. Header/footer intrinsic dimensions,
symbol and favicon match. The transparent 4K export is now **3840 × 892**.
Only logo assets, image intrinsic dimensions and related documentation changed
in this follow-up; the approved hero copy and existing user pricing edits remain.
The refined assets decode correctly, including PNG transparency. The Cloudflare
build, TypeScript and all 33 browser checks pass with this refinement; the
desktop screenshot was visually reviewed. No commit, push or deployment was
performed. Existing continuation notes and asset documentation are updated.

The client supplied updated hero wording and a full logo reference. Implemented:

- Hero heading: **The people behind your real estate business.**
- Description: **Experienced real estate professionals, working as an extension
  of your team.** Three balanced desktop heading lines wrap naturally on phones.
- Recreated the full logo with three architectural columns, slim vertical
  divider, REAL ESTATE above STAFF, and the PEOPLE BEHIND PROPERTY tagline.
  The normal forest/sage and matching light SVGs use outlined lettering so
  their appearance does not depend on browser fonts. Header/footer now use
  these full logos through `BrandLogo`; the standalone symbol/favicon match.
- Saved `public/brand-logo.svg`, `public/brand-logo-light.svg`, and transparent
  `public/brand-logo-4k.png` (**3840 × 870** after readability adjustment).
  The 3840 × 892 reference reconstruction and earlier 4K symbol PNGs are preserved.
  See `docs/brand-assets.md` for construction details and the source limitation:
  this is a faithful vector reconstruction of the small screenshot, not the
  original artwork. Exact source typeface/colors were unavailable.
- Footer columns can shrink at 200% text size; the larger logo no longer
  causes horizontal overflow at tablet sizes. Mobile header keeps logo and
  menu button on one row, with the logo shrinking to fit.

The final Cloudflare build and TypeScript pass. All **33 browser checks pass**
after the footer and mobile-header adjustments, covering 320–1920px layouts,
automated WCAG A/AA checks, 200% text resizing, text spacing, navigation and the
shared enquiry form. Desktop and mobile hero screenshots were visually
reviewed; the logo/menu stay on one mobile header row. All test-server email
settings were blank, no real email was sent, and the owned browser/server were
stopped. Evidence is in ignored `output/qa/`; generated logo preview and the
one-off font-outline generator are in `output/qa/brand-reference/`.

Existing user edits to `$1,295/month` pricing in MarketingSections, terms, and
the website brief were preserved. No email configuration, Git commit/push,
DNS, hosting setting or deployment was changed during this hero/logo update.
The user reports the previous site is deployed and contact emails work;
that report was not independently verified against their inbox. Client custom
domains have not yet been supplied.

## Previous Cloudflare build diagnosis — resolved locally

The first `develop` screenshot failed because Cloudflare ran `pnpm run build`
while the project declares npm. After changing that, the Next.js build passed,
but `npx wrangler preview` failed because the required `previews` block was
missing. The branch also had no committed Wrangler/OpenNext setup.

Implemented the deployment setup locally:
- Pinned `@opennextjs/cloudflare` 1.20.11 and Wrangler 4.151.0 in the npm lockfile.
- Added `wrangler.jsonc` with Worker name `real-state-staff`, generated Worker
  entry/assets, Node compatibility, observability, `keep_vars`, and `previews: {}`.
- Added `open-next.config.ts` with default dummy cache providers: this site
  needs no R2, queue, database or self-reference binding for its current routes.
- Added `build:cloudflare`, local `preview`, `deploy` and `deploy:preview` scripts.
- Ignored generated OpenNext/Wrangler output in Git, ESLint and TypeScript;
  ignored `.dev.vars*` and added immutable static-asset caching headers.
- Saved pinned npm install-script approvals for esbuild, workerd and the
  existing unrs-resolver so CI does not need interactive approvals.
- Updated README deployment commands and contact preview-secret guidance.

**Cloudflare dashboard action still needed:** build command
`npm run build:cloudflare`; production deploy `npx wrangler deploy --keep-vars`;
non-production deploy `npx wrangler preview`; root `/`. Keep production `main`.
These changes were subsequently committed by the user and are present on
`develop`. No dashboard settings, Git commits, pushes or deployments were
performed by the assistant during that fix.

Validation: the full Cloudflare build passes on pinned Next.js 16.3.8; Wrangler
deploy dry-run passes (about 1.35 MiB gzip); lint, typecheck and all 38 isolated
contact tests pass. The generated Worker was served locally with blank example
email settings: home, contact, robots, sitemap and hero image returned 200;
Next static assets returned 200 with immutable caching; invalid contact input
returned 400. No email was sent. The owned local Worker server was stopped.
Hosted Preview creation still requires a Cloudflare build after pushing.

Preview runtime settings/secrets do not inherit production values. Configure
email settings for the Preview Base or individual Preview separately if needed.
The local working tree was clean before that diagnosis; older notes saying all
website work is uncommitted are historical. The current local work is the
hero/logo update and the user's existing pricing edits.

## Email sending — implemented, awaiting configuration

The user authorized building contact email delivery using the recommended
Resend service. `/api/contact` now sends branded HTML and plain-text
notifications through Resend's HTTPS API. Visitor email is Reply-To; the sender
and single business recipient come only from server configuration. HTML input
is escaped, success requires a valid provider receipt, and failures preserve
entered details and the copy/download fallback.

The form keeps a UUID request key for unchanged retries within 24 hours and
clears it after success; deterministic Resend payloads make retry protection
work. Successful submissions now reset the role dropdown as well as text fields.
The optional old webhook remains supported only when all Resend settings are
blank. Partial Resend setup fails closed; provider failures never fall through
to another delivery service.

**Activation still needed:** verify the sender domain in Resend, then set
`RESEND_API_KEY` (Secret), `CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL` as
Cloudflare Worker **runtime** settings. Sender/recipient are bare addresses.
Values are intentionally blank in `.env.example`. Do not ask for the API key in
chat or commit it. Step-by-step instructions: `docs/contact-integration.md`.
No account settings, DNS, hosting or deployments were changed; no real emails
were sent. A genuine inbox/Reply-To check remains necessary after configuration.

The client plans `.nz` as the main domain, `.co.nz` redirecting to it, and Google
Workspace for business email. Keep Google's incoming-mail MX records while
configuring Resend's sending DNS. The client currently wants a temporary holding
page and will provide content. No holding-page conversion or domain redirect
has been implemented; the complete website remains available as the draft.

## Latest revision — completed

The owner requested a new hero, larger text throughout, compact colored cards,
a WCAG 2.2 review, a consistent 1140–1280px layout, and a dedicated contact
page with social icons. They explicitly authorized improving the design freely
instead of following the original reference. This revision is implemented and
verified locally. The content maximum is 1200px, excluding responsive gutters.

- Rebuilt the hero with a two-column composition, larger headline, 18–19px
  introduction, clear actions, framed coastal-office photograph and forest
  caption panel. On mobile, actions become full-width rows.
- Improved the included-services strip beneath the hero: four compact ivory
  blocks with distinct recruitment, training, payroll and support icons, 18px
  titles and 16px descriptions. Replaced the detached vertical dividers with
  complete bordered blocks. Four columns on desktop, two on tablet, stacked
  on phones; the desktop grid also adapts when text is enlarged.
- Replaced the oversized pale role cards with compact forest, sage and warm
  neutral tiles. Two columns on desktop and tablet, one on small phones;
  each includes an icon, role number, readable title/description and action.
- Body copy, navigation, labels, buttons, captions and marketing disclosures
  are at least 16px. Main body is 17px; card titles are 20px. Only the logo
  lockup uses smaller lettering. WCAG does not specify a minimum font size.
- Redesigned `/contact` as a complete page: a split opening with large headline,
  licensed workspace image and white enquiry form; three steps after an enquiry;
  three colored staffing categories; five FAQ disclosures; a forest social panel.
  The form is immediately visible on desktop; tablet/mobile have a direct
  enquiry jump link. It keeps the 1200px content maximum and readable typography.
  Includes page metadata, header/footer navigation and sitemap entry.
- LinkedIn, Instagram and Facebook icons are visible in the contact section
  and footer. No URLs exist yet; they are labeled noninteractive coming-soon
  placeholders. Add real HTTPS URLs in `lib/contact-details.ts` later.
- Native modal mobile navigation makes the background inert, handles Escape
  and restores focus. Anchor selections focus the destination heading.
- Improved input/placeholder contrast, visible focus rings and an error
  summary that receives focus and links to invalid fields.
- Fixed stale generated global CSS by replacing the custom Tailwind
  Turbopack loader with the documented `@tailwindcss/postcss` integration.
  Use `postcss.config.mjs`; do not restore the old custom loader.
- Fixed the role grid in the actual development server: the marketing CSS
  module began with a UTF-8 BOM. Turbopack placed it after its generated comment,
  so the first selector (`rolesGrid`) failed to match. Production optimization
  masked the problem. Removed the BOM, added UTF-8 editor configuration and
  verified `localhost:3000` in Chrome. Keep CSS sources UTF-8 without a BOM.

## Current state

The landing page is implemented and ready for local/client review. Do not
restart or replace the completed website when continuing. The website work
has been committed by the user on `develop`; the hero/logo update remains local.
No commit, push or deployment was performed by the assistant.

The complete original brief is saved in `docs/website-brief.md`. The design
screenshot mentioned in that brief was not provided, so the website follows
the written composition, palette and content, with the supplied logo as the
brand reference.

## Implemented

- Manrope typography, forest green/ivory design tokens, lightweight SVG brand
  mark and favicon. Original 4K logo assets are preserved.
- Sticky header, active section navigation, accessible mobile menu with Escape,
  focus management and scroll locking, and a skip link.
- Two-column office hero; colored eight-role grid and expandable responsibilities;
  forest benefits/photo section; five-step timeline; diagonal property/pricing
  banner; four advantages; about/directors; three sample testimonials; scenic
  final CTA; enquiry section; footer.
- Five locally optimized licensed WebP photographs. Sources and licences are in
  `docs/asset-sources.md`. `founders.webp` is an empty workspace, not a portrait
  of the directors; alt text does not misidentify substitute people.
- React Hook Form + Zod client validation and shared server validation in
  `POST /api/contact`. Loading, receipt, error and unavailable states, plus
  copy/download of unsent enquiries. Resend delivery with Reply-To, HTML/plain
  text, fixed recipient and request keys; optional legacy HTTPS webhook.
- Contact page, privacy and terms draft routes, useful 404 page, metadata/Open Graph/Twitter,
  `robots.txt` and `sitemap.xml`.
- npm migration with `package-lock.json`. Old pnpm lock/workspace files were
  removed to avoid conflicting package-manager detection.

## Verification

- `npm run test:roles:dev`: **10 checks passed** against the existing development
  server at `http://localhost:3000`. Eight viewport widths; two 590px cards with
  a 20px gap at 1440px, two columns at 768–1920px, one on small phones, and
  zero automated WCAG A/AA violations. This mode is read-only and never submits
  forms or stops the existing server. Override the URL with `QA_BASE_URL` for
  another loopback port. Screenshots/reports: `output/qa/roles-development/`.
- `npm run build`: passes, including prerendering and TypeScript.
- `npm run lint`: passes.
- `npm run typecheck`: passes.
- `npm run test:browser`: **33 checks passed**. Tested 320, 375, 390, 768,
  1024, 1280, 1440 and 1920px; no horizontal overflow, missing anchors,
  broken photographs or uncaught browser exceptions. Asserts 1200px maximum
  content width, at least 16px content/actions, and two compact cards per row
  at widths of 600px and above.
  Tested menu/Escape/inert background/focus restoration, section-heading focus,
  disclosures, error-summary focus, truthful unsent response and rejection cases.
  Browser-only mocked success checks verify all fields reset, unchanged retries
  reuse a key and identical fresh enquiries after success get a new key. All
  Resend and webhook settings are blank in the browser check's owned server.
- axe-core 4.14: **zero automated WCAG A/AA violations** across the desktop
  homepage, mobile menu, mobile form-error state and contact page at
  320/768/1024/1440px, including its desktop form-error state.
  Image-overlay contrast checks marked incomplete were assessed separately:
  CTA heading ≥8.75:1, body ≥7.47:1, caption ≥9.52:1 under worst-case white
  backgrounds. Timeline number contrast is 11.95:1. See `docs/accessibility.md`.
- Home/contact pass 200% text resizing and WCAG text-spacing overrides at
  320/1440px; contact also passes at 768/1024px. Visible main controls remain
  unobscured below the sticky header. Contact section structure, 16px minimum
  content, real anchor targets, photograph, FAQ and validation focus are checked.
  This is a scoped review, not a claim of complete WCAG certification.
- `npm run test:contact`: **38 isolated checks passed**, including Resend
  configuration, fixed recipient/sender, Reply-To, escaped HTML, complete plain
  text, deterministic retry payloads, missing receipts, limits, errors, timeout,
  no provider fallback, legacy webhook compatibility, public proxy origins,
  invalid input, honeypot and size limits. **Zero external requests.**
  Illustrative notification: `output/qa/contact-email-preview.html`.
- Screenshots and detailed reports are in ignored `output/qa/`:
  `desktop-1440.png`, `desktop-1440-top.png`, `mobile-390.png`,
  `mobile-390-top.png`, `roles-desktop.png`, `contact-desktop-top.png`,
  `contact-desktop.png`, `contact-mobile.png`, `report.json`, `contact-report.json`
  and accessibility reports. Hero-strip closeups are `services-desktop.png`
  and `services-mobile.png`; development captures also live under
  `output/qa/roles-development/`.
- Lighthouse scores and a new live Cloudflare deployment have not been
  measured/verified for this website.

## Important compatibility decisions

- Keep **Next.js 16.3.8** and matching `eslint-config-next` pinned. Next.js 16.4
  currently crashes with OpenNext's `preview-props.json` manifest handling.
- Keep Cache Components and partial prefetching disabled; they previously hung
  Worker requests.
- Tailwind uses `@tailwindcss/postcss` with `postcss.config.mjs`, as documented
  by the pinned Next.js package. The former custom Turbopack loader served stale
  global CSS and has been removed. CSS Modules remain supported.
- Images are pre-optimized WebP; Next Image runtime transforms are disabled to
  keep Cloudflare working without an Images binding. Stable sizing, hero
  preloading and lazy loading remain in place.
- The contact endpoint compares Origin with incoming Host and forwarded
  protocol, because Next may expose an internal localhost URL behind a proxy.

## Client/launch configuration still needed

1. Verify a Resend sending domain and set `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`
   and `CONTACT_TO_EMAIL` as **runtime** settings. See
   `docs/contact-integration.md`. Until configured, enquiries are explicitly
   unsent and can be copied/downloaded locally. Confirm a real enquiry reaches
   the client's inbox after activation. The optional webhook remains available.
2. Confirm `NEXT_PUBLIC_SITE_URL` for the real domain. The default is the
   existing `real-state-staff.rovicdelrosario02.workers.dev` address.
3. Approve pricing and founder copy, supply actual founder portraits if desired,
   replace the clearly disclosed sample testimonials, and approve legal drafts.
4. Add real social URLs in `lib/contact-details.ts`; coming-soon icons are shown
   until configured. No invented social links are displayed.
5. Cloudflare's production branch is `main`. After review, commit/push and merge
   changes there. Any manually configured install/build commands should now use
   npm (`npm ci`, `npm run build:cloudflare`). See README for the full
   production/preview commands. No account changes were made.

## How to continue

Read `AGENTS.md`, this file and `docs/website-brief.md`; then inspect
`git status --short`. Preserve all tracked and untracked source/user assets.
Use `npm ci` if dependencies are missing and `npm run dev` for local preview.
Implement requested refinements, run the relevant checks, and update this
status file before stopping. The existing browser QA uses installed Chrome or
Edge directly and disables outbound enquiry delivery in its owned local server.

Suggested next-chat message:

> Read PROJECT_STATUS.md and continue the Real Estate Staff website from the saved state.
