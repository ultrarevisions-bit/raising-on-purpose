/**
 * Simple class name joiner (no clsx dependency needed).
 */
export function cn(...inputs: (string | number | boolean | null | undefined)[]): string {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Format a date string to a readable format.
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a date for schema.org (ISO 8601).
 */
export function formatDateISO(dateStr: string): string {
  return new Date(dateStr).toISOString();
}

/**
 * Truncate text to a given length.
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "...";
}

/**
 * Estimate reading time in minutes from markdown text.
 */
export function estimateReadTime(text: string): number {
  const words = text.replace(/[#>*_`\[\]()!-]/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/**
 * Build a Pinterest pin URL.
 */
export function buildPinterestUrl(
  postUrl: string,
  imageUrl: string,
  description: string,
): string {
  const params = new URLSearchParams({
    url: postUrl,
    media: imageUrl,
    description,
  });
  return `https://pinterest.com/pin/create/button/?${params.toString()}`;
}