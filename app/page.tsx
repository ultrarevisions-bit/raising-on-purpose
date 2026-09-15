import Link from "next/link";
import { FeaturedPost } from "@/components/featured-post";
import { PostGrid } from "@/components/post-grid";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { ArrowRightIcon } from "@/components/icons";
import { categories } from "@/lib/categories";
import { getAllPostsMeta, getFeaturedPost } from "@/lib/posts";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const featured = getFeaturedPost();
  const allPosts = getAllPostsMeta();
  const latest = allPosts.filter((p) => p.slug !== featured?.slug).slice(0, 8);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Hero */}
      {featured && (
        <section className="py-8 sm:py-12" aria-labelledby="featured-heading">
          <h1 id="featured-heading" className="mb-2 text-center font-heading text-3xl text-ink sm:text-4xl">
            Honest motherhood, on purpose
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-center text-ink-light">
            No highlight reel. Real essays and practical, values-driven parenting help that
            actually works on your messiest days.
          </p>
          <FeaturedPost post={featured} />
        </section>
      )}

      {/* Latest posts */}
      <section aria-labelledby="latest-heading" className="py-10">
        <div className="mb-8 flex items-center justify-between">
          <h2 id="latest-heading" className="font-heading text-2xl sm:text-3xl">
            Latest from the blog
          </h2>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta-600 no-underline hover:text-terracotta-700"
          >
            View all
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <PostGrid posts={latest} priorityIndexes={[0, 1, 2, 3]} />
      </section>

      {/* Categories */}
      <CategoriesStrip />

      {/* Newsletter */}
      <section aria-labelledby="newsletter-heading" className="py-10">
        <NewsletterSignup
          title="Want the good stuff (and the free printables)?"
          description="Join the list for weekly honest parenting emails plus free printables. No spam, unsubscribe anytime."
          className="mx-auto max-w-2xl"
        />
      </section>
    </div>
  );
}

function CategoriesStrip() {
  return (
    <section aria-labelledby="categories-heading" className="py-10">
      <h2 id="categories-heading" className="mb-6 font-heading text-2xl sm:text-3xl">
        Browse by topic
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/${c.slug}`}
            className={cn(
              "group rounded-xl border border-cream-300 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md no-underline",
            )}
          >
            <h3 className="mb-1 font-heading text-lg font-semibold text-ink group-hover:text-terracotta-600">
              {c.name}
            </h3>
            <p className="line-clamp-2 text-sm text-ink-light">{c.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}