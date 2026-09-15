/**
 * Normalizes uploaded blog images in one command.
 *
 * AI tools (ImageFX, Midjourney, Canva) export photographic images as JPEG.
 * When saved, browsers may append ".jpeg" after a chosen ".png" name,
 * producing files like "my-post.png.jpeg". This script:
 *
 *   1. Finds every image under public/images/ and app/.
 *   2. Strips ALL trailing image extensions so "my-post.png.jpeg" becomes
 *      "my-post" (canonical name).
 *   3. Converts posts/defaults to optimized WebP at the expected dimensions.
 *   4. Re-encodes app/icon.png as a proper resized PNG (Next.js file convention
 *      requires .png/.ico/.svg/.jpg for the icon file, not .webp).
 *
 * After running, update the ".png" -> ".webp" references listed in the
 * README "AI images" section (frontmatter featuredImage, app/layout.tsx,
 * and scripts/generate-search-index.mjs).
 *
 * Run:  npm run assets:fix
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const POST_W = 1200;
const POST_H = 1800;
const OGDEFAULT_W = 1200;
const OGDEFAULT_H = 630;
const FEATURED_W = 1200;
const FEATURED_H = 1800;
const ICON_SIZE = 256;

const IMAGE_EXT = /\.(?:png|jpe?g|webp)$/i;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (IMAGE_EXT.test(entry.name)) out.push(full);
  }
  return out;
}

/** Strip every trailing image extension: "a.png.jpeg" -> "a", "a.webp" -> "a". */
function canonicalBase(file) {
  let base = file;
  while (IMAGE_EXT.test(base)) {
    base = base.replace(IMAGE_EXT, "");
  }
  return base;
}

function plan(file) {
  const rel = path.relative(root, file);
  const base = canonicalBase(file);
  const isIcon = rel.startsWith("app" + path.sep);
  const isOgDefault = path.basename(base) === "og-default";
  const isFeatured = path.basename(base) === "featured";
  const isPost = rel.startsWith("public" + path.sep + "images" + path.sep + "posts");

  let outPath, width, height;
  if (isIcon) {
    outPath = path.join(path.dirname(base), "icon.png");
    width = ICON_SIZE;
    height = ICON_SIZE;
  } else {
    outPath = base + ".webp";
    if (isOgDefault) {
      width = OGDEFAULT_W;
      height = OGDEFAULT_H;
    } else if (isFeatured || isPost) {
      width = POST_W;
      height = POST_H;
    }
  }

  return { outPath, width, height, isIcon };
}

async function main() {
  const files = [
    ...walk(path.join(root, "public", "images", "posts")),
    ...walk(path.join(root, "public", "images", "defaults")),
    ...walk(path.join(root, "app")),
  ];

  if (files.length === 0) {
    console.log("No images found to normalize.");
    return;
  }

  const touched = new Set();

  for (const file of files) {
    const { outPath, width, height, isIcon } = plan(file);
    if (touched.has(outPath)) continue;
    touched.add(outPath);

    let img = sharp(file);
    const meta = await img.metadata();

    if (width && height) {
      img = img.resize(width, height, { fit: "cover", position: "attention" });
    }

    if (isIcon) {
      img = img.toFormat("png", { compressionLevel: 9 });
    } else {
      img = img.toFormat("webp", { quality: 82 });
    }

    const tmp = path.join(root, "scripts", ".tmp-" + path.basename(outPath) + "-" + Math.random().toString(36).slice(2));
    await img.toFile(tmp);

    if (outPath !== file) {
      fs.unlinkSync(file);
    }
    fs.renameSync(tmp, outPath);

    const size = (fs.statSync(outPath).size / 1024).toFixed(0);
    console.log(`Fixed: ${path.relative(root, file)} (${meta.format}, ${meta.width}x${meta.height}) -> ${outPath} (${size} KB)`);
  }

  console.log("\nDone. Remember to update .png -> .webp references in content/, app/layout.tsx and scripts/generate-search-index.mjs.");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});