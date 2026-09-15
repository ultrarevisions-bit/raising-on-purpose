import Link from "next/link";
import type { Metadata } from "next";
import { PostGrid } from "@/components/post-grid";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { categories } from "@/lib/categories";
import { getAllPostsMeta } from "@/lib/posts";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "All posts from Raising On Purpose: honest motherhood essays, intentional parenting, toddler guidance, family routines, and free printables.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllPostsMeta();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-10 sm:py-14" aria-labelledby="blog-heading">
        <div className="mx-auto max-w-2xl text-center">
          <h1 id="blog-heading" className="font-heading text-3xl sm:text-4xl">
            The blog
          </h1>
          <p className="mt-3 text-ink-light">
            Honest essays and practical help for the days that do not come with a manual.
          </p>
        </div>

        <nav aria-label="Filter posts by category" className="mt-8 flex flex-wrap justify-center gap-2">
          <Link
            href="/blog"
            className={cn(
              "rounded-full border border-cream-300 bg-white px-4 py-1.5 text-sm font-medium text-ink-light no-underline transition-colors hover:border-terracotta-300 hover:text-terracotta-600",
            )}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className={cn(
                "rounded-full border border-cream-300 bg-white px-4 py-1.5 text-sm font-medium text-ink-light no-underline transition-colors hover:border-terracotta-300 hover:text-terracotta-600",
              )}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="mt-10">
          <PostGrid posts={posts} priorityIndexes={[0, 1, 2]} />
        </div>
      </section>

      <section aria-labelledby="blog-newsletter" className="pb-10 pt-2">
        <NewsletterSignup className="mx-auto max-w-2xl" />
      </section>
    </div>
  );
}