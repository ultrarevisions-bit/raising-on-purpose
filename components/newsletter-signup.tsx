"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { CheckIcon, MailIcon } from "@/components/icons";

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  context?: "home" | "sidebar" | "post";
  className?: string;
}

const DEFAULT_TITLE = "Get the printable, plus one grounded email each week";
const DEFAULT_DESCRIPTION =
  "The weekly note is short, honest, and skippable. No junk, no guilt trips, unsubscribe anytime.";

/**
 * Newsletter opt-in form.
 *
 * Ready to wire into MailerLite: set `MAILERLITE_FORM_ACTION` in `.env.local`
 * to your MailerLite embedded form action URL (the `action` of the snippet).
 * Until then it validates locally and shows a friendly success state.
 */
export function NewsletterSignup({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  context = "home",
  className,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );

  const isWired = siteConfig.mailerLiteFormAction !== "#";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;

    setStatus("submitting");
    const form = event.currentTarget;

    if (!isWired) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setStatus("success");
      return;
    }

    try {
      const formData = new FormData(form);
      await fetch(siteConfig.mailerLiteFormAction, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-cream-300 bg-cream-50 p-6 sm:p-8",
        className,
      )}
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta-100 text-terracotta-600">
          <MailIcon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-heading text-xl font-semibold leading-snug">{title}</h3>
          <p className="mt-1 text-sm text-ink-light">{description}</p>
        </div>
      </div>

      {status === "success" ? (
        <div
          className="flex items-start gap-2 rounded-lg bg-sage-light/20 p-4 text-sm text-sage-dark"
          role="status"
        >
          <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <p>You are in. Check your inbox for a welcome note. Talk soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            aria-label="Email address"
            className="newsletter-input"
          />
          <input type="hidden" name="form-submit" value="yes" />
          <input type="hidden" name="submit" aria-hidden="true" />
          <button type="submit" disabled={status === "submitting"} className="newsletter-btn disabled:opacity-60">
            {status === "submitting" ? "Signing you up..." : "Sign me up"}
          </button>
          {status === "error" && (
            <p className="text-sm text-terracotta-700" role="alert">
              Something went wrong. Try again, or email us directly.
            </p>
          )}
          <p className="text-[11px] leading-relaxed text-ink-muted">
            We respect your inbox. No spam, ever.
          </p>
        </form>
      )}
    </div>
  );
}