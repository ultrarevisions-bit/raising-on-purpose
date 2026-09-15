import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Post, PostMeta } from "./types";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export function getAllPostsMeta(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    return {
      title: (data.title as string) || slug,
      slug,
      description: (data.description as string) || "",
      featuredImage: (data.featuredImage as string) || "/images/defaults/featured.webp",
      category: (data.category as string) || "real-talk",
      stage: data.stage as string | undefined,
      date: (data.date as string) || new Date().toISOString().split("T")[0],
      updated: data.updated as string | undefined,
      download: data.download as string | undefined,
      downloadTitle: data.downloadTitle as string | undefined,
      excerpt: (data.excerpt as string) || (data.description as string) || "",
      keywords: data.keywords as string[] | undefined,
      featured: (data.featured as boolean) || false,
      author: (data.author as string) || "Raising On Purpose",
    } satisfies PostMeta;
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    title: (data.title as string) || slug,
    slug,
    description: (data.description as string) || "",
    featuredImage: (data.featuredImage as string) || "/images/defaults/featured.webp",
    category: (data.category as string) || "real-talk",
    stage: data.stage as string | undefined,
    date: (data.date as string) || new Date().toISOString().split("T")[0],
    updated: data.updated as string | undefined,
    download: data.download as string | undefined,
    downloadTitle: data.downloadTitle as string | undefined,
    excerpt: (data.excerpt as string) || "",
    keywords: data.keywords as string[] | undefined,
    featured: (data.featured as boolean) || false,
    author: (data.author as string) || "Raising On Purpose",
    content,
  };
}

export function getPostsByCategory(categorySlug: string): PostMeta[] {
  return getAllPostsMeta().filter((p) => p.category === categorySlug);
}

export function getFeaturedPost(): PostMeta | null {
  const all = getAllPostsMeta();
  return all.find((p) => p.featured) || all[0] || null;
}

export function getRelatedPosts(currentSlug: string, limit = 3): PostMeta[] {
  const current = getPostBySlug(currentSlug);
  if (!current) return [];

  return getAllPostsMeta()
    .filter((p) => p.slug !== currentSlug && p.category === current.category)
    .slice(0, limit);
}

export function getAllPostSlugs(): { category: string; slug: string }[] {
  return getAllPostsMeta().map((p) => ({ category: p.category, slug: p.slug }));
}

export function getAllCategorySlugs(): string[] {
  const posts = getAllPostsMeta();
  return [...new Set(posts.map((p) => p.category))];
}