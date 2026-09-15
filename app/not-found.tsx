import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="mt-4 font-heading text-3xl sm:text-4xl">Page not found</h1>
      <p className="mt-3 text-ink-light">
        Looks like this one did not make it through the toddler phase. But other posts
        did. Head back and try again.
      </p>
      <Link
        href="/blog"
        className="mt-8 inline-block rounded-lg bg-terracotta-500 px-6 py-3 font-semibold text-white no-underline transition-colors hover:bg-terracotta-600"
      >
        Browse the blog
      </Link>
    </div>
  );
}