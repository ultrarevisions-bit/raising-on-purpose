import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getAllPostsMeta } from "@/lib/posts";
import { categories } from "@/lib/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPostsMeta();
  const staticPages = ["", "/blog", "/about", "/contact", "/privacy-policy", "/cookie-policy", "/disclosure"];

  const staticUrls = staticPages.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const categoryUrls = categories.map((c) => ({
    url: `${siteConfig.url}/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const postUrls = posts.map((p) => ({
    url: `${siteConfig.url}/${p.category}/${p.slug}`,
    lastModified: p.updated ? new Date(p.updated) : new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticUrls, ...categoryUrls, ...postUrls];
}