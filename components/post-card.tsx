import Image from "next/image";
import Link from "next/link";
import { getCategoryBySlug } from "@/lib/categories";
import { siteConfig } from "@/lib/site";
import { cn, formatDate } from "@/lib/utils";
import type { PostMeta } from "@/lib/types";
import { CategoryBadge } from "@/components/category-badge";
import { PinterestIcon } from "@/components/icons";

interface PostCardProps {
  post: PostMeta;
  priority?: boolean;
  className?: string;
}

const STAGE_LABELS: Record<string, string> = {
  toddler: "Toddler",
  preschool: "Preschool",
  elementary: "Elementary",
};

export function PostCard({ post, priority = false, className }: PostCardProps) {
  const category = getCategoryBySlug(post.category);
  const postUrl = `${siteConfig.url}/${post.category}/${post.slug}`;
  const pinUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
    postUrl,
  )}&media=${encodeURIComponent(siteConfig.url + post.featuredImage)}&description=${encodeURIComponent(
    post.title,
  )}`;

  return (
    <article className={cn("group", className)}>
      <Link
        href={`/${post.category}/${post.slug}`}
        className="pin-card block aspect-[2/3]"
        aria-label={post.title}
      >
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 300px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03] rounded-xl"
          priority={priority}
        />
        <span className="pin-overlay">
          <span className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-terracotta-700 shadow-md">
            <PinterestIcon className="h-4 w-4 text-terracotta-600" />
            Save it
          </span>
        </span>
      </Link>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-center gap-2 text-xs">
          <CategoryBadge category={post.category} />
          {post.stage && (
            <span className="rounded-full bg-cream-200 px-2.5 py-0.5 font-medium text-ink-muted">
              {STAGE_LABELS[post.stage] ?? post.stage}
            </span>
          )}
        </div>
        <h3 className="font-heading text-lg font-semibold leading-snug text-ink">
          <Link
            href={`/${post.category}/${post.slug}`}
            className="text-ink no-underline transition-colors hover:text-terracotta-600"
          >
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-ink-light">{post.excerpt}</p>
        <time dateTime={post.date} className="block text-xs text-ink-muted">
          {formatDate(post.date)}
        </time>
      </div>
    </article>
  );
}