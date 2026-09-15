import { cn } from "@/lib/utils";

interface AffiliateDisclosureProps {
  className?: string;
}

/**
 * Small disclosure note rendered where affiliate links may appear.
 */
export function AffiliateDisclosure({ className }: AffiliateDisclosureProps) {
  return (
    <p
      className={cn(
        "rounded-lg bg-cream-200/70 px-4 py-3 text-xs italic leading-relaxed text-ink-muted",
        className,
      )}
    >
      <strong className="not-italic">Disclosure:</strong> Some links in this post are
      affiliate links. If you buy through them, we may earn a small commission at no cost to
      you. We only share what we would actually use ourselves. See the{" "}
      <a href="/disclosure">full disclosure</a>.
    </p>
  );
}