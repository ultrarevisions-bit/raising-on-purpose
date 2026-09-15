/**
 * Generates /public/search-index.json from the MDX posts in /content/posts.
 * Runs automatically before every build (see package.json "prebuild").
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content", "posts");
const outDir = path.join(process.cwd(), "public");
const outFile = path.join(outDir, "search-index.json");

if (!fs.existsSync(postsDir)) {
  console.warn("No content/posts directory found. Skipping search index.");
  process.exit(0);
}

const files = fs
  .readdirSync(postsDir)
  .filter((f) => f.endsWith(".mdx"));

const items = files
  .map((filename) => {
    const raw = fs.readFileSync(path.join(postsDir, filename), "utf8");
    const { data } = matter(raw);
    const slug = filename.replace(/\.mdx$/, "");
    return {
      title: data.title || slug,
      slug,
      category: data.category || "real-talk",
      excerpt: data.excerpt || data.description || "",
      date: data.date || "",
      featuredImage: data.featuredImage || "/images/defaults/featured.png",
    };
  })
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(items, null, 2));
console.log(`Search index written: ${items.length} posts -> ${outFile}`);