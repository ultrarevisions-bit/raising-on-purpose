interface TableOfContentsProps {
  content: string;
}

/**
 * Extracts H2 headings from a post's markdown source and renders a
 * sticky table of contents. Anchors come from rehype-slug at render time.
 */
export function TableOfContents({ content }: TableOfContentsProps) {
  const headings = content
    .split("\n")
    .map((line) => line.match(/^##\s+(.+)/)?.[1])
    .filter(Boolean) as string[];

  if (headings.length === 0) return null;

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  return (
    <nav aria-label="Table of contents" className="rounded-xl border border-cream-300 bg-cream-50 p-5">
      <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-ink">In this post</h2>
      <ol className="space-y-2">
        {headings.map((h) => (
          <li key={h}>
            <a href={`#${slugify(h)}`} className="text-sm text-ink-light no-underline hover:text-terracotta-600">
              {h}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}