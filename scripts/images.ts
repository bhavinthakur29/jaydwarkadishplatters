/**
 * Optimise raw photos for the website.
 *
 *   raw-images/<category>/*.jpg|png|webp|avif|tiff   (your Instagram downloads)
 *        ↓
 *   public/images/<category>/<seo-friendly-name>.webp  (max 1600px wide, ~82% quality)
 *
 * Usage:
 *   bun run images              all categories
 *   bun run images chhab        one category
 *   bun run images --force      re-process files even if the output is up to date
 *
 * Name your raw files descriptively (e.g. "engagement-ring-plate-una.jpg"):
 * the filename becomes part of the image URL, which helps Google Images.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const RAW = path.join(ROOT, "raw-images");
const OUT = path.join(ROOT, "public", "images");
const MAX_WIDTH = 1600;
const QUALITY = 82;
const EXT = /\.(jpe?g|png|webp|avif|tiff?)$/i;

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.find((a) => !a.startsWith("--"));

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  if (!fs.existsSync(RAW)) {
    console.error(`No raw-images/ folder. Create raw-images/<category>/ and drop photos in.`);
    process.exit(1);
  }

  const categories = fs
    .readdirSync(RAW, { withFileTypes: true })
    .filter((d) => d.isDirectory() && (!only || d.name === only))
    .map((d) => d.name);

  if (categories.length === 0) {
    console.error(only ? `No folder raw-images/${only}` : "raw-images/ has no category folders yet.");
    process.exit(1);
  }

  let done = 0;
  let skipped = 0;
  let savedBytes = 0;

  for (const category of categories) {
    const inDir = path.join(RAW, category);
    const outDir = path.join(OUT, category);
    fs.mkdirSync(outDir, { recursive: true });

    for (const file of fs.readdirSync(inDir)) {
      if (!EXT.test(file)) continue;
      const input = path.join(inDir, file);
      const name = slugify(path.parse(file).name) || "photo";
      const output = path.join(outDir, `${name}.webp`);

      if (!force && fs.existsSync(output) && fs.statSync(output).mtimeMs >= fs.statSync(input).mtimeMs) {
        skipped++;
        continue;
      }

      await sharp(input)
        .rotate() // respect the phone's orientation, then drop EXIF (location etc.)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(output);

      savedBytes += fs.statSync(input).size - fs.statSync(output).size;
      done++;
      console.log(`  ${category}/${file}  →  public/images/${category}/${name}.webp`);
    }
  }

  console.log(
    `\nProcessed ${done} image${done === 1 ? "" : "s"}, skipped ${skipped} up to date` +
      (done ? `, saved ${(savedBytes / 1024 / 1024).toFixed(1)} MB.` : "."),
  );
}

main();
