/**
 * Normalizes uploaded blog images in one command.
 *
 * AI tools (ImageFX, Midjourney, Canva) often export JPEG files that get
 * renamed to ".png" when saved. Next.js usually tolerates this, but it is
 * not guaranteed across all setups. This script:
 *
 *   1. Scans public/images/ and app/ for every image.
 *   2. Detects the REAL format from the file bytes (not the extension).
 *   3. Converts everything to true PNG files in place.
 *   4. Optionally resizes each image to its expected dimensions.
 *
 * Run:  npm run assets:fix
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const TARGETS = [
  { glob: "public/images/posts", width: 1200, height: 1800 },
  { glob: "public/images/defaults", width: null, height: null }, // og-default is 1200x630; kept as-is below
  { glob: "app", width: null, height: null },
];

const OGDEFAULT_W = 1200;
const OGDEFAULT_H = 630;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(png|jpe?g|webp)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

async function main() {
  const files = [
    ...walk(path.join(root, "public", "images", "posts")),
    ...walk(path.join(root, "public", "images", "defaults")),
    ...walk(path.join(root, "app")) // app/icon.png
  ];

  if (files.length === 0) {
    console.log("No images found to normalize.");
    return;
  }

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const isJpegRenamedPng = ext === ".png" || ext === ".jpeg" || ext === ".jpg" || ext === ".webp";

    // Only touch images that were NOT produced by our generator (fsize reference is irrelevant;
    // we simply re-encode everything to a clean PNG so the extension always matches the content).
    let img = sharp(file);
    const meta = await img.metadata();
    const realFormat = meta.format; // real bytes, not extension

    // Size adjustments for specific slots
    const isOgDefault = file.endsWith("og-default.png") || file.endsWith("og-default.jpg");
    const isPostCover = file.includes(path.sep + "posts" + path.sep);

    if (isOgDefault) {
      img = img.resize(OGDEFAULT_W, OGDEFAULT_H, { fit: "cover" });
    } else if (isPostCover) {
      img = img.resize(1200, 1800, { fit: "cover", position: "attention" });
    }

    const output = file.replace(/\.(png|jpe?g|webp)$/i, ".png");
    const tmp = output + ".tmp-" + Date.now() + "-" + Math.random().toString(36).slice(2) + ".png";
    await img.toFormat("png").toFile(tmp);

    if (output !== file) {
      fs.unlinkSync(file); // remove the mislabeled original (jpg file named .png)
    }
    fs.renameSync(tmp, output);

    console.log(`Fixed: ${path.relative(root, file)} (was ${realFormat}) -> ${path.basename(output)}`);
  }

  console.log("All images normalized to PNG.");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});