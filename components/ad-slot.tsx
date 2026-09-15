import { cn } from "@/lib/utils";

interface AdSlotProps {
  slot?: string;
  className?: string;
  label?: string;
}

/**
 * Placeholder ad slot. Ready to be replaced with a Mediavine / AdThrive / AdSense
 * embed when the site qualifies for ad networks.
 */
export function AdSlot({ className, label = "Advertisement" }: AdSlotProps) {
  return (
    <aside
      aria-label={label}
      className={cn(
        "flex min-h-[120px] w-full items-center justify-center rounded-lg border border-dashed border-cream-300 bg-white/60 text-xs uppercase tracking-widest text-ink-muted",
        className,
      )}
    >
      {label}
    </aside>
  );
}