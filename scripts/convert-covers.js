const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = './manual-covers'; // drop your JPEGs here
const outputDir = 'public/images/posts';

fs.readdirSync(inputDir)
  .filter((f) => f.endsWith('.jpeg') || f.endsWith('.jpg'))
  .forEach(async (f) => {
    const slug = f
      .replace(/\.(jpeg|jpg)$/i, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 80);
    const out = path.join(outputDir, `${slug}.webp`);
    try {
      const info = await sharp(path.join(inputDir, f))
        .resize(1024, 1536, { fit: 'cover' })
        .webp({ quality: 82 })
        .toFile(out);
      console.log(`✓ ${f} -> ${slug}.webp (${info.width}x${info.height})`);
    } catch (e) {
      console.error(`✗ ${f}: ${e.message}`);
    }
  });