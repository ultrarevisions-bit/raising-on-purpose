import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclosure",
  description:
    "Raising On Purpose disclosure: affiliate links, sponsored content, and how we make money, explained clearly.",
  alternates: { canonical: "/disclosure" },
};

export default function DisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <section aria-labelledby="disclosure-heading" className="py-12">
        <h1 id="disclosure-heading" className="font-heading text-3xl sm:text-4xl">
          Disclosure
        </h1>
        <p className="mt-2 text-sm text-ink-muted">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="prose mt-8">
          <p>
            We believe in honest content and honest money. This page exists so there is never
            any doubt about how this site makes money and how we handle products.
          </p>

          <h2>Affiliate links</h2>
          <p>
            Some posts may contain affiliate links. If you click an affiliate link and buy
            something, we may earn a small commission, at no extra cost to you. We only
            recommend what we would actually use ourselves or genuinely recommend to a
            friend. Affiliate relationships never change our opinions.
          </p>

          <h2>Sponsored content</h2>
          <p>
            If we ever publish sponsored content, it will be clearly labeled as such at the
            top of the post. We will only partner with brands that fit the site and that we
            believe in.
          </p>

          <h2>Free printables</h2>
          <p>
            Downloads on this site are free for personal and family use. Please do not
            resell, republish, or redistribute the files without permission.
          </p>

          <h2>FTC compliance</h2>
          <p>
            In accordance with FTC guidelines, any material connection we have to a brand we
            mention will be disclosed, either on this page or within the post itself.
          </p>

          <h2>Advertising</h2>
          <p>
            This site may display advertisements, including from networks like Mediavine,
            AdThrive, or Google AdSense. Ads are selected by the network, not by us
            directly.
          </p>

          <h2>Questions</h2>
          <p>
            Questions about this disclosure? Email{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </div>
      </section>
    </div>
  );
}