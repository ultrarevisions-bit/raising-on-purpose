import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Raising On Purpose for questions, collaboration, or topic requests.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6">
      <section aria-labelledby="contact-heading" className="py-12">
        <h1 id="contact-heading" className="font-heading text-3xl sm:text-4xl">
          Say hello
        </h1>
        <p className="mt-3 text-ink-light">
          Collaboration requests, topic ideas, or just want to say the toddler years are
          something else? Write to us. We reply to everything real.
        </p>

        <div className="mt-8">
          <ContactForm />
        </div>

        <p className="mt-8 text-sm text-ink-muted">
          Prefer email? Reach us directly at{" "}
          <a href={`mailto:${siteConfig.email}`} className="text-terracotta-600">
            {siteConfig.email}
          </a>
          .
        </p>
      </section>
    </div>
  );
}