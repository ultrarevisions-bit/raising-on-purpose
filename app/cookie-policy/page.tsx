import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How Raising On Purpose uses cookies and how you can control them.",
  alternates: { canonical: "/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <section aria-labelledby="cookie-heading" className="py-12">
        <h1 id="cookie-heading" className="font-heading text-3xl sm:text-4xl">
          Cookie Policy
        </h1>
        <p className="mt-2 text-sm text-ink-muted">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="prose mt-8">
          <p>
            Cookies are small text files stored on your device by your browser. They help
            sites remember information about your visit. This page explains the cookies we
            use and the choices you have.
          </p>

          <h2>Essential cookies</h2>
          <p>
            A few cookies are required for the site to function, such as remembering your
            preferences while browsing. These cannot be turned off.
          </p>

          <h2>Analytics cookies</h2>
          <p>
            We use analytics tools (including Vercel Analytics and, if enabled, Google
            Analytics) to count visitors and see which pages are popular. These cookies help
            us understand traffic in aggregate, without identifying individuals.
          </p>

          <h2>Advertising and Pinterest</h2>
          <p>
            We may participate in advertising networks and use affiliate links. These
            networks may set cookies to measure performance and to show relevant ads on other
            sites. Pinterest, if we add the Pinterest tag, may set cookies to help measure
            how content is shared and saved. You can adjust your ad preferences on Pinterest
            and other platforms directly.
          </p>

          <h2>How to control cookies</h2>
          <p>
            Most browsers let you view, block, or delete cookies through their settings. You
            can find instructions for your specific browser in its help section. Blocking
            some cookies may affect how the site works for you.
          </p>

          <h2>Contact</h2>
          <p>
            For any cookie or privacy questions, email{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </div>
      </section>
    </div>
  );
}