import Link from "next/link";
import { getCategoryBySlug } from "@/lib/categories";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const meta = getCategoryBySlug(category);

  return (
    <Link
      href={`/${category}`}
      className={cn(
        "inline-flex items-center rounded-full bg-terracotta-100 px-2.5 py-0.5 text-xs font-semibold text-terracotta-700 no-underline transition-colors hover:bg-terracotta-200",
        className,
      )}
    >
      {meta?.name ?? category}
    </Link>
  );
}