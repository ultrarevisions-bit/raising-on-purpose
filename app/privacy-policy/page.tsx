import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Raising On Purpose collects, uses, and protects your information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <section aria-labelledby="privacy-heading" className="py-12">
        <h1 id="privacy-heading" className="font-heading text-3xl sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-ink-muted">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="prose mt-8">
          <p>
            Raising On Purpose takes your privacy seriously. This policy explains what
            information we collect, why we collect it, and how you can control it. It is
            written in plain language on purpose.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Information you give us.</strong> When you sign up for the newsletter
              or contact us, we receive the details you provide, such as your name and email
              address.
            </li>
            <li>
              <strong>Analytics data.</strong> We use privacy-respecting analytics to
              understand which posts are useful. This includes anonymized data such as pages
              viewed, device type, and approximate location. It does not include your name or
              email.
            </li>
            <li>
              <strong>Advertising and affiliate data.</strong> If we display ads or use
              affiliate links, providers may collect limited data to serve relevant
              advertising. See the Cookie Policy for details.
            </li>
          </ul>

          <h2>How we use your information</h2>
          <ul>
            <li>To send the newsletter you subscribed to.</li>
            <li>To reply to your messages.</li>
            <li>To improve the site and understand what readers find helpful.</li>
            <li>To maintain security and prevent abuse.</li>
          </ul>

          <h2>Email and mailing list</h2>
          <p>
            We use a reputable email service provider (such as MailerLite) to manage the
            newsletter. Your email address is used only to send updates you requested. Every
            email includes an unsubscribe link. We never sell your email address.
          </p>

          <h2>Cookies</h2>
          <p>
            We use a small number of cookies to make the site work and to understand traffic.
            Third parties such as analytics and advertising providers may set their own
            cookies. You can control this in your browser settings or through the choices
            described in our <a href="/cookie-policy">Cookie Policy</a>.
          </p>

          <h2>Third-party services</h2>
          <p>
            The site may link to third-party services, including social media platforms,
            affiliate merchants, and content delivery networks. Their privacy practices are
            governed by their own policies.
          </p>

          <h2>Your rights</h2>
          <p>
            Depending on where you live, you may have the right to access, correct, or delete
            your personal data, and to object to certain processing. To exercise any of these
            rights, contact us at{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. We respond within
            a reasonable timeframe.
          </p>

          <h2>Children&apos;s privacy</h2>
          <p>
            This site is intended for adults. We do not knowingly collect personal
            information from children under 13. If you believe a child has provided us
            information, please contact us so we can delete it.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy as the site grows. The date at the top reflects the
            latest revision. Significant changes will be noted on this page.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy? Email{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </div>
      </section>
    </div>
  );
}