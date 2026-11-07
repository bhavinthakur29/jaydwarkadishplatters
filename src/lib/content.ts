/**
 * The ONLY place that reads content/*.json.
 *
 * Components call getSite(), getCategories(), getProducts() ... and never touch
 * the JSON files. To move to a CMS or database later, rewrite this file only.
 */
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { Locale } from "./i18n";
import {
  CategoriesFileSchema,
  ProductsFileSchema,
  SiteSchema,
  type Category,
  type LocalizedText,
  type Product,
  type Site,
} from "./schema";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const IMAGES_DIR = path.join(ROOT, "public", "images");

export class ContentError extends Error {
  constructor(problems: string[]) {
    super(
      `\n\nContent problems found:\n${problems.map((p) => `  - ${p}`).join("\n")}\n`,
    );
    this.name = "ContentError";
  }
}

function readJson(relativePath: string): unknown {
  const file = path.join(CONTENT_DIR, relativePath);
  let raw: string;
  try {
    raw = fs.readFileSync(file, "utf8");
  } catch {
    throw new ContentError([`content/${relativePath} is missing`]);
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new ContentError([`content/${relativePath} is not valid JSON: ${(e as Error).message}`]);
  }
}

function parse<T extends z.ZodType>(schema: T, data: unknown, label: string): z.infer<T> {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  throw new ContentError(
    result.error.issues.map((i) => `${label}${i.path.length ? " → " + i.path.join(".") : ""}: ${i.message}`),
  );
}

type Catalog = {
  site: Site;
  categories: Category[];
  products: Record<string, Product[]>;
};

function load(): Catalog {
  const site = parse(SiteSchema, readJson("site.json"), "content/site.json");
  const categories = parse(CategoriesFileSchema, readJson("categories.json"), "content/categories.json")
    .slice()
    .sort((a, b) => a.order - b.order);

  const problems: string[] = [];
  const seenCategories = new Set<string>();
  const products: Record<string, Product[]> = {};

  const imageExists = (relative: string) => fs.existsSync(path.join(IMAGES_DIR, relative));

  for (const category of categories) {
    if (seenCategories.has(category.slug)) problems.push(`categories.json: duplicate slug "${category.slug}"`);
    seenCategories.add(category.slug);

    if (!imageExists(category.cover)) {
      problems.push(`categories.json → ${category.slug}.cover: image "public/images/${category.cover}" not found`);
    }

    const file = `products/${category.slug}.json`;
    const exists = fs.existsSync(path.join(CONTENT_DIR, file));
    const list = exists
      ? parse(ProductsFileSchema, readJson(file), `content/${file}`)
      : [];

    const seenProducts = new Set<string>();
    for (const product of list) {
      if (seenProducts.has(product.slug)) problems.push(`${file}: duplicate product slug "${product.slug}"`);
      seenProducts.add(product.slug);
      for (const image of product.images) {
        if (!imageExists(`${category.slug}/${image.src}`)) {
          problems.push(`${file} → ${product.slug}: image "public/images/${category.slug}/${image.src}" not found`);
        }
      }
    }
    products[category.slug] = list;
  }

  // A products file with no matching category would be silently ignored, so flag it.
  const productsDir = path.join(CONTENT_DIR, "products");
  if (fs.existsSync(productsDir)) {
    for (const file of fs.readdirSync(productsDir)) {
      if (!file.endsWith(".json")) continue;
      const slug = file.replace(/\.json$/, "");
      if (!seenCategories.has(slug)) {
        problems.push(`content/products/${file}: no category "${slug}" in categories.json`);
      }
    }
  }

  if (problems.length) throw new ContentError(problems);
  return { site, categories, products };
}

let cached: Catalog | undefined;
function catalog(): Catalog {
  // In dev, re-read on every call so JSON edits show up on refresh.
  if (process.env.NODE_ENV !== "production") return load();
  return (cached ??= load());
}

/* ------------------------------ public API ------------------------------ */

export function getSite(): Site {
  return catalog().site;
}

export function getCategories(): Category[] {
  return catalog().categories;
}

export function getCategory(slug: string): Category | undefined {
  return catalog().categories.find((c) => c.slug === slug);
}

/** Published products of a category, in file order. */
export function getProducts(categorySlug: string): Product[] {
  return (catalog().products[categorySlug] ?? []).filter((p) => p.published);
}

export type FeaturedItem = { category: Category; product: Product };

export function getFeaturedProducts(limit = 8): FeaturedItem[] {
  const out: FeaturedItem[] = [];
  for (const category of catalog().categories) {
    for (const product of getProducts(category.slug)) {
      if (product.featured) out.push({ category, product });
    }
  }
  return out.slice(0, limit);
}

/** Pick the right language, falling back to English if a translation is missing. */
export function localize(text: LocalizedText, locale: Locale): string {
  return text[locale] || text.en;
}

export function categoryImageUrl(cover: string): string {
  return `/images/${cover}`;
}

export function productImageUrl(categorySlug: string, src: string): string {
  return `/images/${categorySlug}/${src}`;
}
