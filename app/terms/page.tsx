import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & conditions — draft",
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <main id="main-content" className="site-container legal-page">
      <p className="eyebrow">Real Estate Staff</p>
      <h1>Terms & conditions</h1>
      <p className="draft-notice">
        <strong>Draft for client review.</strong> This is a website content
        draft, not an approved staffing agreement. The business must supply its
        final terms before launch.
      </p>
      <h2>About this website</h2>
      <p>
        This website introduces Real Estate Staff and the types of support
        available to real estate businesses. Submit an enquiry to discuss the
        scope, availability and requirements of your team.
      </p>
      <h2>Pricing and services</h2>
      <p>
        The advertised starting price of NZ$995 per month is provided in the
        client’s website brief. The applicable currency, taxes, working hours,
        role scope, minimum term and service inclusions must be confirmed in a
        personalised quote and written agreement.
      </p>
      <h2>Enquiries</h2>
      <p>
        Completing an enquiry form does not create a staffing agreement or
        reserve a candidate. The form displays a delivery confirmation only when
        the configured enquiry service accepts your submission.
      </p>
      <h2>Content awaiting approval</h2>
      <p>
        Sample testimonials are identified on the homepage. Founder biographies,
        pricing, service descriptions and legal policies require the business’s
        approval. Photographic substitutions are illustrative and are not
        portraits of the named directors.
      </p>
      <h2>Business details and final terms</h2>
      <p>
        The contracting entity, contact information, service terms, cancellation
        arrangements, dispute process and applicable jurisdiction must be added
        to the approved documents.
      </p>
      <p>
        <Link href="/#contact">Discuss your requirements →</Link>
      </p>
    </main>
  );
}
