import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteDescription, siteTitle, siteUrl } from "@/lib/site-config";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: "%s | Real Estate Staff" },
  description: siteDescription,
  applicationName: "Real Estate Staff",
  openGraph: {
    type: "website",
    locale: "en_NZ",
    siteName: "Real Estate Staff",
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    images: [
      {
        url: "/images/hero-office.webp",
        alt: "A considered workspace with an ocean view",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/images/hero-office.webp"],
  },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-NZ" className={manrope.variable}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
