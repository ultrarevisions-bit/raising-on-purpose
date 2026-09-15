import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  textClassName?: string;
}

/**
 * Minimal wordmark: "Raising On Purpose" with a small double-arch mark.
 * Renders as inline SVG so it scales cleanly at any size.
 */
export function Logo({ className, textClassName }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 32"
        className="h-8 w-12 text-terracotta-500"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      >
        <path d="M4 28 16 6l4.5 9.5L24 10l8 18" />
      </svg>
      <span
        className={cn(
          "font-heading text-[1.4rem] font-semibold leading-none tracking-tight text-ink",
          textClassName,
        )}
      >
        Raising
        <span className="block text-[0.85rem] font-medium uppercase tracking-[0.28em] text-terracotta-600">
          On Purpose
        </span>
      </span>
    </span>
  );
}