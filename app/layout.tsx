import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { siteConfig } from "@/lib/site";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SearchDialog } from "@/components/search-dialog";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Raising On Purpose | Honest Motherhood & Intentional Parenting",
    template: "%s | Raising On Purpose",
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: "Raising On Purpose",
    title: "Raising On Purpose",
    description: siteConfig.description,
    images: [
      {
        url: "/images/defaults/og-default.webp",
        width: 1200,
        height: 630,
        alt: "Raising On Purpose",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raising On Purpose",
    description: siteConfig.description,
    images: ["/images/defaults/og-default.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorantGaramond.variable} ${dmSans.variable}`}>
      <head>
        <meta name="theme-color" content="#C96F4A" />
      </head>
      <body className="flex min-h-screen flex-col">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <SearchDialog />
        {process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS === "true" && <Analytics />}
      </body>
    </html>
  );
}