import { DownloadIcon } from "@/components/icons";

interface DownloadCardProps {
  title: string;
  href: string;
}

/**
 * Streaming-looking card used for free downloadable printables.
 */
export function DownloadCard({ title, href }: DownloadCardProps) {
  return (
    <aside className="my-8 overflow-hidden rounded-xl border border-cream-300 bg-terracotta-50">
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-terracotta-500 text-white">
            <DownloadIcon className="h-6 w-6" />
          </span>
          <div>
            <p className="font-heading text-lg font-semibold leading-snug text-ink">
              {title}
            </p>
            <p className="mt-1 text-sm text-ink-light">
              Free download, print and start today.
            </p>
          </div>
        </div>
        <a
          href={href}
          download
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-terracotta-600 px-6 py-3 font-semibold text-white no-underline transition-colors hover:bg-terracotta-700"
        >
          <DownloadIcon className="h-4 w-4" />
          Download PDF
        </a>
      </div>
    </aside>
  );
}