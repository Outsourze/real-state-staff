import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-main">
          <div>
            <BrandLogo light />
            <p className="footer-note">
              The right people.
              <br />
              The freedom to grow.
            </p>
          </div>
          <nav aria-label="Footer navigation" className="footer-nav">
            <Link href="/#home">Home</Link>
            <Link href="/#roles">Our roles</Link>
            <Link href="/#how-it-works">How it works</Link>
            <Link href="/#pricing">Pricing</Link>
            <Link href="/#about">About</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <div className="footer-connect">
            <Link href="/contact" className="footer-contact">
              Let’s talk <ArrowUpRight size={24} aria-hidden="true" />
            </Link>
            <SocialLinks tone="light" />
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Real Estate Staff. All rights reserved.</p>
          <div>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Terms &amp; conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
