import Link from "next/link";
import Image from "next/image";
import type { PostMeta } from "@/lib/types";
import { ArrowRightIcon } from "@/components/icons";
import { formatDate } from "@/lib/utils";
import { CategoryBadge } from "@/components/category-badge";

interface FeaturedPostProps {
  post: PostMeta;
}

/**
 * Large full-bleed hero card used on the homepage.
 */
export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-terracotta-800 text-cream-100">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="relative aspect-[4/3] min-h-[280px] lg:aspect-auto">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col justify-center gap-4 p-8 sm:p-12">
          <CategoryBadge category={post.category} className="bg-terracotta-600 text-white self-start" />
          <h2 className="font-heading !text-2xl font-semibold leading-tight sm:!text-4xl">
            <Link
              href={`/${post.category}/${post.slug}`}
              className="text-cream-100 no-underline transition-colors hover:text-terracotta-100"
            >
              {post.title}
            </Link>
          </h2>
          <p className="leading-relaxed text-cream-200/90 lg:line-clamp-3">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-cream-200/80">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.stage && <span className="capitalize">Ages: {post.stage}</span>}
          </div>
          <div>
            <Link
              href={`/${post.category}/${post.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-cream-100 px-6 py-3 font-semibold text-terracotta-800 no-underline transition-colors hover:bg-white"
            >
              Read the post
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}