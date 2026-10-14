import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy policy — draft",
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="site-container legal-page">
      <p className="eyebrow">Real Estate Staff</p>
      <h1>Privacy policy</h1>
      <p className="draft-notice">
        <strong>Draft for client review.</strong> This page describes the
        current website implementation. The business must approve its privacy
        policy and contact details before launch.
      </p>
      <h2>Information you choose to share</h2>
      <p>
        The enquiry form asks for your name, email address, company or agency,
        the role you need, your message, and an optional phone number. Please
        avoid including confidential client records or sensitive personal
        information.
      </p>
      <h2>How enquiries are handled</h2>
      <p>
        When the enquiry service is connected, the website sends the details you
        provide to the business’s configured contact service to respond to your
        request. An enquiry is shown as sent only after that service accepts it.
      </p>
      <p>
        When Resend email delivery is configured, Resend processes the enquiry
        to send a notification to the business’s inbox. Your email address is
        included as the reply address so the team can respond directly. The
        website does not save enquiry details in browser storage or an
        application database.
      </p>
      <p>
        If the service is not connected or cannot accept an enquiry, the form
        tells you it has not been sent. You can choose to copy or download a
        local text version. Saving that copy does not contact Real Estate Staff.
      </p>
      <h2>Website and hosting information</h2>
      <p>
        The website uses its hosting provider to deliver pages and images.
        Hosting systems may process standard technical request information. The
        current site does not include advertising trackers, analytics services
        or nonessential cookies.
      </p>
      <h2>Questions and requests</h2>
      <p>
        The business’s privacy contact, retention periods, service providers and
        process for handling privacy requests must be confirmed before this
        draft is approved.
      </p>
      <p>
        <Link href="/#contact">Return to the enquiry form →</Link>
      </p>
    </main>
  );
}
