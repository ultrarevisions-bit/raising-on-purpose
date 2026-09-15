import type { Category } from "./types";

export const categories: Category[] = [
  {
    slug: "intentional-parenting",
    name: "Intentional Parenting & Discipline",
    description:
      "Connection-based discipline, values-driven routines, and purposeful parenting strategies that actually hold up in real life.",
    color: "terracotta",
    icon: "heart",
  },
  {
    slug: "real-talk",
    name: "Real Talk / Unfiltered Motherhood",
    description:
      "Honest essays on mom guilt, the mental load, marriage after kids, and the days that do not go as planned.",
    color: "sage",
    icon: "chat",
  },
  {
    slug: "toddler",
    name: "Toddler & Early Childhood",
    description:
      "Age-and-stage guidance on tantrums, sleep, feeding, and development, written without judgment.",
    color: "cream",
    icon: "star",
  },
  {
    slug: "family-routines",
    name: "Family Routines & Rhythms",
    description:
      "Morning and evening routines, chore systems, and screen time boundaries that actually hold up.",
    color: "terracotta",
    icon: "clock",
  },
  {
    slug: "printables",
    name: "Printables & Family Tools",
    description:
      "Chore charts, routine cards, feelings charts, and family values worksheets. Free downloadable resources.",
    color: "sage",
    icon: "download",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategorySlugs(): string[] {
  return categories.map((c) => c.slug);
}