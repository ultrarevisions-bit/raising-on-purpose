import type { PostMeta } from "@/lib/types";
import { PostCard } from "@/components/post-card";

interface PostGridProps {
  posts: PostMeta[];
  priorityIndexes?: number[];
  className?: string;
}

export function PostGrid({ posts, priorityIndexes = [], className }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <p className="py-12 text-center text-ink-muted">
        No posts here yet. Check back soon.
      </p>
    );
  }

  return (
    <section
      className={className}
      aria-label="Post grid"
    >
      <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4">
        {posts.map((post, i) => (
          <PostCard key={post.slug} post={post} priority={priorityIndexes.includes(i)} />
        ))}
      </div>
    </section>
  );
}