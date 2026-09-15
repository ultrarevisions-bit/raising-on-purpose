import type { MDXComponents } from "mdx/types";
import { DownloadCard } from "@/components/download-card";

interface DownloadCtaProps {
  title: string;
  href: string;
}

export function DownloadCta({ title, href }: DownloadCtaProps) {
  return <DownloadCard title={title} href={href} />;
}

interface CalloutProps {
  children: React.ReactNode;
}

export function Callout({ children }: CalloutProps) {
  return (
    <aside className="my-8 rounded-xl border-l-4 border-terracotta-400 bg-cream-50 p-5 text-ink-light">
      {children}
    </aside>
  );
}

/**
 * Components made available inside MDX posts.
 */
export const mdxComponents: MDXComponents = {
  DownloadCta,
  Callout,
  a: (props) => <a {...props} className="text-terracotta-600 underline underline-offset-2 decoration-terracotta-200 hover:text-terracotta-700 hover:decoration-terracotta-500 transition-colors" />,
  img: (props) => <img {...props} className="rounded-xl my-8" loading="lazy" />,
};