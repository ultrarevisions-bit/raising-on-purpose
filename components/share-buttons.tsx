"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site";
import { CheckIcon, CopyIcon, PinterestIcon } from "@/components/icons";

interface ShareButtonsProps {
  title: string;
  slug: string;
  category: string;
  featuredImage: string;
}

export function ShareButtons({ title, slug, category, featuredImage }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = `${siteConfig.url}/${category}/${slug}`;
  const media = `${siteConfig.url}${featuredImage}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
          url,
        )}&media=${encodeURIComponent(media)}&description=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-terracotta-600 px-4 py-2 text-sm font-semibold text-white no-underline transition-colors hover:bg-terracotta-700"
      >
        <PinterestIcon className="h-4 w-4" />
        Pin it
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-2 rounded-full border border-cream-400 bg-white px-4 py-2 text-sm font-semibold text-ink no-underline transition-colors hover:bg-cream-100"
      >
        {copied ? <CheckIcon className="h-4 w-4 text-sage" /> : <CopyIcon className="h-4 w-4" />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}