# Real Estate Staff — continuation notes

Last updated: **2026-10-14 (Asia/Manila)**.

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
restart or replace the completed website when continuing. All source changes
remain in the working tree on `develop`; no commit, push or deployment has been performed.

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
   npm (`npm ci`, `npm run build`). No account changes were made.

## How to continue

Read `AGENTS.md`, this file and `docs/website-brief.md`; then inspect
`git status --short`. Preserve all tracked and untracked source/user assets.
Use `npm ci` if dependencies are missing and `npm run dev` for local preview.
Implement requested refinements, run the relevant checks, and update this
status file before stopping. The existing browser QA uses installed Chrome or
Edge directly and disables outbound enquiry delivery in its owned local server.

Suggested next-chat message:

> Read PROJECT_STATUS.md and continue the Real Estate Staff website from the saved state.
