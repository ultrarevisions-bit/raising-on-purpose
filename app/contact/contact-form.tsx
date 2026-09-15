"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site";
import { MailIcon } from "@/components/icons";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${name || "a reader"}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div
        className="rounded-xl bg-sage-light/20 p-6 text-sm text-sage-dark"
        role="status"
      >
        Your email app should have opened. If not, write to us directly at{" "}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. We read every
        message.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-ink">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="newsletter-input"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="newsletter-input"
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-ink">
          Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          required
          placeholder="Ask a question, request a topic, or just say hi."
          className="newsletter-input resize-y"
        />
      </div>
      <button type="submit" className="newsletter-btn sm:w-auto">
        <span className="inline-flex items-center gap-2">
          <MailIcon className="h-4 w-4" />
          Send message
        </span>
      </button>
      <p className="text-xs text-ink-muted">
        This opens your email app with the message pre-filled. Nothing is stored on this
        site.
      </p>
    </form>
  );
}