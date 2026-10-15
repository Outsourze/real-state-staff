# Contact form integration

The homepage and dedicated `/contact` page share the same enquiry form. It validates enquiries with React Hook Form and the shared Zod schema in `lib/contact-schema.ts`. `POST /api/contact` now sends notifications through Resend's HTTPS API. No SDK, SMTP connection or database is needed. The existing generic webhook remains an optional alternative.

The implementation is ready, but **delivery stays disabled until real configuration is supplied**. No API key or recipient has been invented or embedded in the code, and no live test emails have been sent.

## Activate Resend on Cloudflare

1. Create a Resend account and add a sending domain you control. A dedicated
   sending subdomain is useful, for example `notifications.example.com`.
2. Add the exact sending DNS records shown by Resend, then wait until the domain
   is verified. Keep the client's Google Workspace incoming-mail MX records.
   This integration sends notifications; Google remains the mailbox provider.
3. Create a Resend API key with sending access for the verified domain.
4. In Cloudflare, open **Workers & Pages → your Worker → Settings → Variables
   and Secrets**. Add these **runtime** settings:

   | Name                 | Type           | Value                                        |
   | -------------------- | -------------- | -------------------------------------------- |
   | `RESEND_API_KEY`     | Secret         | Your actual Resend sending key               |
   | `CONTACT_FROM_EMAIL` | Text or Secret | A bare sender address on the verified domain |
   | `CONTACT_TO_EMAIL`   | Text or Secret | The client's actual receiving inbox          |

5. Deploy the updated application using the Workers/OpenNext commands in README.
   Build-only secrets are insufficient: the POST route reads them at runtime.
   Keep these values out of `NEXT_PUBLIC_...`, Git, browser code and chat.
6. Submit one genuine, clearly identified enquiry yourself and confirm receipt
   in the client's inbox. Test Reply as well. The integration cannot confirm
   mailbox delivery until that real check is performed.

Cloudflare branch Previews have separate settings. Production values do not
carry over to `develop` when using `wrangler preview`. Set the three email
settings in the Preview Base configuration or the individual Preview to test
delivery there. Shared Base secrets apply to newly created Previews; existing
Previews need their own update. Without these settings, the preview form
truthfully reports that delivery is not connected. See
[Cloudflare Preview configuration](https://developers.cloudflare.com/workers/previews/configuration/).

For local `npm run dev`, copy `.env.example` to ignored `.env.local`, fill in the
same three values and restart the server. A shape-only example follows; replace
all values with your own:

```dotenv
RESEND_API_KEY=your-real-resend-key
CONTACT_FROM_EMAIL=website@notifications.example.com
CONTACT_TO_EMAIL=client@example.com
```

`CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL` each accept **one bare email
address**, not a comma-separated list or display name. The application adds
the sender name `Real Estate Staff`. The visitor's validated email becomes
`Reply-To`, so clicking Reply addresses the visitor. The visitor cannot choose
the delivery recipient or override the sender.

Use Cloudflare Workers/OpenNext for the current project: a static Pages upload
alone cannot execute `/api/contact`.

## Notification and receipt behavior

- Both HTML and plain text include name, visitor email, agency, optional phone,
  role and message. User input is escaped before being included in HTML.
- The API key remains in the server's outbound Authorization header. Resend's
  fixed HTTPS endpoint receives the payload; redirects are not followed.
- A successful Resend response must contain a nonempty email ID. The UI then
  confirms submission and clears **all** fields, including the role dropdown.
  API acceptance is not a guarantee of inbox delivery or protection from bounces.
- API rejections never show success. Quota/rate-limit responses return `429`;
  network timeouts, server errors and incomplete receipts report unconfirmed
  delivery. Entered details and copy/download actions remain available.
- A request key is kept in memory for unchanged retries. Resend's idempotency
  window is 24 hours. Email content is deterministic across retries; a new
  enquiry after success receives a fresh key. Reloading the page loses the
  in-memory key. No enquiry details are written to browser storage.
- Only one notification is sent to the configured business inbox. No automatic
  visitor acknowledgement is sent. Existing validation, origin checks,
  honeypot, 16KiB limit and timeouts remain in place.

Partial Resend configuration returns `503` without sending. If any Resend
setting is present, Resend takes precedence over the legacy webhook. Failures
never fall through to a second provider, avoiding unexpected duplicate delivery.

## Contact page and social profiles

The dedicated `/contact` page includes a split enquiry opening, workspace
photography, the enquiry process, staffing categories, five FAQ disclosures and
social placeholders. Required-field validation focuses a summary above the
fields; each error links to its field. Content and controls use at least 16px
text, and actions/social icon areas have at least 44px touch targets.

Add the client's approved LinkedIn, Instagram and Facebook profile URLs to `socialProfileUrls` in `lib/contact-details.ts`. All three default to an empty string because the client has not supplied profile URLs. Until configured, icons are labeled, noninteractive images accompanied by “Social profiles coming soon.” No empty or `#` links are created.

Only valid HTTPS URLs without embedded credentials become links. Configured profiles open in a new tab with `noopener noreferrer` and a meaningful accessible label. The same `SocialLinks` component supports dark text on light backgrounds or `tone="light"` for the footer. No street address has been supplied.

The client approved the following public contact details on 15 October 2026:

- Email: `hello@realestatestaff.nz` (`mailto:hello@realestatestaff.nz`).
- Phone/WhatsApp: `+64 22 646 6569` (`tel:+64226466569` and
  `https://wa.me/64226466569`).

`businessContact` in `lib/contact-details.ts` is the single source of public
contact values. `ContactLinks` displays email, phone and WhatsApp actions in
the homepage contact section, the contact page introduction and the footer.
Text is at least 16px, targets at least 44px, and long email addresses wrap
when space is limited. WhatsApp opens in a new tab with an accessible notice
and `noopener noreferrer`; no message is sent automatically. Its international
digits-only URL follows the [official WhatsApp click-to-chat format](https://faq.whatsapp.com/5913398998672934).

Visible contact details do not configure server delivery. The Worker still
needs its runtime Resend settings, including the confirmed recipient
`CONTACT_TO_EMAIL=hello@realestatestaff.nz`. Google Workspace inbox activation
and Resend sender-domain verification must be completed for the custom domain.

## Optional legacy webhook

Leave **all three** Resend settings blank to use the previous webhook receiver.
Do not set `CONTACT_WEBHOOK_URL` to the Resend endpoint: the webhook payload
differs from Resend's email API payload.

Set these **server-only** environment variables in your hosting platform, then restart or redeploy:

```dotenv
CONTACT_WEBHOOK_URL=https://your-approved-receiver.example/enquiries
# Optional. Sent as Authorization: Bearer <token>.
CONTACT_WEBHOOK_TOKEN=your-secret-token
```

For local Next.js development, put values in an ignored `.env.local` file. Never prefix these variables with `NEXT_PUBLIC_`, and never commit credentials. Configure the variables for the deployed Worker runtime when deploying with Cloudflare/OpenNext; setting them only for a build will not necessarily make them available to requests. With Vercel, configure them under project environment variables.

The URL must be HTTPS, must not embed credentials, and must be a service the client approves to receive personal information. Redirects are rejected so the bearer token cannot be forwarded to another origin. Your receiver must store or process the enquiry before returning `2xx`; the website cannot verify email delivery beyond the receiver accepting the request.

Payload:

```json
{
  "source": "real-estate-staff-website",
  "submittedAt": "ISO-8601 UTC timestamp",
  "fullName": "Example Customer",
  "email": "customer@example.com",
  "company": "Example Agency",
  "phone": "",
  "role": "Executive Assistant",
  "message": "We are looking for support for our sales team."
}
```

`phone` is optional and may be omitted or empty. All other visible fields are required. Only the eight roles in the brief are accepted. The internal `website` honeypot is not sent upstream.

## Honest fallback and failure behavior

- Without a configured delivery service, the API returns `503` with code `not_connected`. The form explicitly states that the enquiry **has not been sent**.
- The user can copy or download a plain text local copy. These actions do not send the enquiry; the interface and downloaded file say so. Details are not placed in browser storage.
- Legacy webhook non-`2xx` responses return `502` and do not show success. Network failures and the ten-second upstream timeout say delivery **could not be confirmed**. A timeout may occur after a service accepted a message, so users should check before retrying; unchanged Resend retries also reuse the request key.
- Client-side requests time out after fifteen seconds. Form values remain available after an error.
- The API rejects cross-origin requests when an `Origin` header is present, non-JSON content types, malformed JSON, invalid fields, filled honeypots, and request bodies larger than 16 KiB (including streamed bodies).
- No request bodies, tokens, or personal information are logged by the application. Ensure the receiver and hosting logs follow the client's data handling policy.

Before a public launch, connect an approved receiver, replace the draft privacy policy, and configure hosting-level rate limiting or appropriate abuse protection for the endpoint. Origin and honeypot checks alone do not prevent scripted submissions.

## Role links

A client role card may preselect the form's role using:

```ts
window.dispatchEvent(
  new CustomEvent("select-role", { detail: "Executive Assistant" }),
);
```

Then navigate to `#contact`. Unrecognised role values are ignored.

## Verification

`npm run test:contact` runs the real route, schema and email template with an
isolated environment and mocked fetch: **38 checks**, zero external requests.
It covers Resend configuration, recipient/sender restrictions, receipt checks,
Reply-To, escaped HTML, all fields, duplicate keys, quota failures, timeouts,
and compatibility with the optional webhook. An illustrative email preview is
written to ignored `output/qa/contact-email-preview.html`.

`npm run test:browser` starts an owned local server with all delivery settings
explicitly blank. It checks the truthful unsent response, then uses browser-only
mocks for successful submissions and verifies reset/retry behavior. It never
submits to a real receiver. The development-only layout check remains read-only.

## Official setup references

- [Resend email API](https://resend.com/docs/api-reference/emails/send-email)
- [Resend authentication and required headers](https://resend.com/docs/api-reference/introduction)
- [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys)
- [Resend on Cloudflare Workers](https://resend.com/docs/send-with-cloudflare-workers)
- [Cloudflare runtime secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [OpenNext runtime variables](https://opennext.js.org/cloudflare/howtos/env-vars)
