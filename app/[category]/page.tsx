import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PostGrid } from "@/components/post-grid";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { categories, getCategoryBySlug } from "@/lib/categories";
import { getPostsByCategory } from "@/lib/posts";

interface PageProps {
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const meta = getCategoryBySlug(category);
  if (!meta) return {};

  return {
    title: `${meta.name} | Blog`,
    description: meta.description,
    alternates: { canonical: `/${category}` },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const meta = getCategoryBySlug(category);
  if (!meta) notFound();

  const posts = getPostsByCategory(category);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section aria-labelledby="category-heading" className="py-10 sm:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h1 id="category-heading" className="font-heading text-3xl sm:text-4xl">
            {meta.name}
          </h1>
          <p className="mt-3 text-ink-light">{meta.description}</p>
        </div>

        <div className="mt-12">
          <PostGrid posts={posts} />
        </div>

        <nav aria-label="All categories" className="mt-14 flex flex-wrap justify-center gap-2">
          <Link
            href="/blog"
            className="rounded-full border border-cream-300 bg-white px-4 py-1.5 text-sm font-medium text-ink-light no-underline transition-colors hover:border-terracotta-300 hover:text-terracotta-600"
          >
            View all posts
          </Link>
          {categories
            .filter((c) => c.slug !== category)
            .map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="rounded-full border border-cream-300 bg-white px-4 py-1.5 text-sm font-medium text-ink-light no-underline transition-colors hover:border-terracotta-300 hover:text-terracotta-600"
              >
                {c.name}
              </Link>
            ))}
        </nav>
      </section>

      <section aria-labelledby="category-newsletter" className="pb-10 pt-2">
        <NewsletterSignup className="mx-auto max-w-2xl" />
      </section>
    </div>
  );
}