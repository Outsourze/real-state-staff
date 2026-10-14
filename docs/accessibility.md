# Accessibility review

Reviewed locally on 14 October 2026 against applicable WCAG 2.2 A/AA criteria.
This records the scope and evidence; it is not a conformance certification.

## Changes

- Content uses a 1200px maximum with responsive gutters. Body copy and actions
  are at least 16px, with larger introductory text and clear heading hierarchy.
  These font sizes are a usability choice; WCAG does not prescribe a minimum.
- Text colors, placeholders and control borders have stronger contrast.
- Focus uses a dark outline and white outer separation. Sticky-header offsets
  follow the actual header height, and short viewports use a nonsticky header.
- Mobile navigation uses a native modal dialog. The background is inert,
  Escape and Close return focus to the trigger, and section navigation focuses
  its destination heading.
- Invalid form submission focuses an error summary. Its links focus the named
  fields. Inputs have associated labels, errors and help text. Delivery states
  accurately distinguish receipt from an unsent enquiry.
- Social icons have accessible names. Unconfigured profiles are noninteractive
  placeholders. The site includes a skip link and respects reduced motion.

## Verification

Run `npm run build` followed by `npm run test:browser`. The script uses installed
Chrome/Edge, owns and stops its local server, and disables external enquiry
delivery. Results and screenshots are in ignored `output/qa/`.

- 33 browser checks passed with no uncaught browser exceptions.
- Viewports: 320, 375, 390, 768, 1024, 1280, 1440 and 1920px.
- Homepage/contact: no horizontal scrolling at 320px, 200% text resizing at
  320/1440px (contact also at 768/1024px), and text-spacing overrides of line height 1.5, paragraph spacing
  2em, letter spacing .12em and word spacing .16em.
- Card geometry and actual computed font sizes are checked, so stale generated
  CSS cannot silently pass the layout check.
- `npm run test:roles:dev` additionally verifies the running development
  preview without submitting forms. This caught a UTF-8 BOM that broke the
  first role-grid selector in development while production optimization hid it.
  Ten development checks pass across eight widths after removing that BOM.
- Menu Escape/focus/scroll behavior, section navigation, form validation,
  error-summary focus, disclosures, endpoint errors and route availability.
- Browser-only email-response mocks verify accessible success status, preserved
  details after failure, full reset after acceptance and retry/fresh-request keys.
  Real Resend/email delivery is disabled in the owned browser-test server.
- axe-core 4.14, tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`:
  zero violations for homepage desktop, open mobile menu, mobile validation
  errors and contact page at 320/768/1024/1440px, including its desktop
  validation-error state. Contact checks include section structure, readable
  text, anchor targets, loaded imagery, FAQs and focused error summaries.
- Programmatic focus traversal checks visible main controls below the sticky
  header. Hidden controls in closed disclosures are excluded.

Automated contrast checks cannot resolve every layered image. The incomplete
items were assessed using foreground/background composition and WCAG relative
luminance. Worst-case white imagery gives these lower bounds:

| Element                                              | Contrast |
| ---------------------------------------------------- | -------- |
| Timeline numbers, white on forest                    | 11.95:1  |
| Workspace caption over its almost opaque ivory panel | 9.52:1   |
| Scenic CTA heading over its forest overlay           | 8.75:1   |
| Scenic CTA body at 90% white opacity                 | 7.47:1   |
| Input placeholder on white                           | 5.76:1   |
| Input boundary on white                              | 3.78:1   |

Further testing with screen readers, other browser engines, real assistive
technology users and the deployed Cloudflare runtime remains outside this
local review. Legal drafts, sample testimonials and delivery configuration
also still need client approval/configuration before launch.

## References

- [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [Text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [Non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [Resize text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html)
- [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [Text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)
- [Focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html)
- [Minimum target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [Tailwind's Next.js integration](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
