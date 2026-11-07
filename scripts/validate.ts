/**
 * Check all content without building the site.  Run:  bun run validate
 *
 * Catches: invalid JSON, wrong/missing fields, unknown language keys,
 * missing image files, duplicate slugs, product files with no matching category.
 * Also lists translations that are still missing (as warnings, not errors).
 */
import { getCategories, getProducts, getSite } from "../src/lib/content";
import { ContentError } from "../src/lib/content";
import type { LocalizedText } from "../src/lib/schema";

try {
  const site = getSite();
  const categories = getCategories();
  const missing: string[] = [];

  const check = (where: string, text: LocalizedText | undefined) => {
    if (!text) return;
    for (const l of ["hi", "gu"] as const) if (!text[l]) missing.push(`${where} [${l}]`);
  };

  check("site.name", site.name);
  check("site.tagline", site.tagline);
  for (const c of categories) {
    check(`category ${c.slug}.name`, c.name);
    check(`category ${c.slug}.intro`, c.intro);
    check(`category ${c.slug}.seoTitle`, c.seoTitle);
    check(`category ${c.slug}.seoDescription`, c.seoDescription);
    for (const p of getProducts(c.slug)) {
      check(`${c.slug}/${p.slug}.name`, p.name);
      check(`${c.slug}/${p.slug}.description`, p.description);
      p.images.forEach((img, i) => check(`${c.slug}/${p.slug}.images[${i}].alt`, img.alt));
    }
  }

  const productCount = categories.reduce((n, c) => n + getProducts(c.slug).length, 0);
  console.log(`✓ Content is valid: ${categories.length} categories, ${productCount} published products.`);

  if (site.hours.length === 0) console.log("• site.json: no opening hours set (nothing will be shown).");
  if (missing.length) {
    console.log(`\n⚠ ${missing.length} missing translation(s) (English will be shown instead):`);
    for (const m of missing.slice(0, 40)) console.log(`  - ${m}`);
    if (missing.length > 40) console.log(`  ... and ${missing.length - 40} more`);
  }
} catch (e) {
  if (e instanceof ContentError) {
    console.error(e.message);
    process.exit(1);
  }
  throw e;
}
