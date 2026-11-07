import { z } from "zod";

/**
 * A translatable string. English is required (it is the fallback);
 * hi and gu are optional while you are still translating.
 * strictObject => a typo such as "ge" instead of "gu" fails validation.
 */
export const LocalizedText = z.strictObject({
  en: z.string().min(1),
  hi: z.string().optional(),
  gu: z.string().optional(),
});
export type LocalizedText = z.infer<typeof LocalizedText>;

const Weekday = z.enum([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

export const SiteSchema = z.strictObject({
  name: LocalizedText,
  shortName: LocalizedText,
  tagline: LocalizedText,
  owner: LocalizedText,
  /** Public URL, no trailing slash. Overridden by NEXT_PUBLIC_SITE_URL if set. */
  url: z.url(),
  logo: z.string().startsWith("/"),
  ogImage: z.string().startsWith("/"),
  phone: z.strictObject({
    /** Shown on the page. */
    display: z.string(),
    /** For tel: links and structured data. */
    e164: z.string().regex(/^\+\d{8,15}$/),
    /** For wa.me links: digits only, with country code. */
    whatsapp: z.string().regex(/^\d{8,15}$/),
  }),
  address: z.strictObject({
    street: LocalizedText,
    locality: LocalizedText,
    region: LocalizedText,
    postalCode: z.string().optional(),
    country: z.string().length(2),
  }),
  /** Leave empty until her hours are confirmed; nothing is shown or published for an empty list. */
  hours: z
    .array(
      z.strictObject({
        days: z.array(Weekday).min(1),
        opens: z.string().regex(/^\d{2}:\d{2}$/),
        closes: z.string().regex(/^\d{2}:\d{2}$/),
      }),
    )
    .default([]),
  areaServed: z.array(z.string()).default([]),
  social: z.strictObject({
    instagram: z.url(),
    instagramHandle: z.string(),
  }),
  map: z.strictObject({
    /** Short Google Maps link, opened in a new tab. */
    url: z.url(),
    /** Optional: "Embed a map" URL from Google Maps; shown as an iframe on /contact. */
    embedUrl: z.url().optional(),
  }),
});
export type Site = z.infer<typeof SiteSchema>;

const Slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "use lowercase-letters-and-dashes");

export const CategorySchema = z.strictObject({
  slug: Slug,
  order: z.number().int(),
  /** Path inside public/images/, e.g. "chhab/engagement-chhab.webp". */
  cover: z.string(),
  coverAlt: LocalizedText,
  name: LocalizedText,
  /** One line, shown on category cards. */
  tagline: LocalizedText,
  /** Short paragraph shown at the top of the category page (good for SEO). */
  intro: LocalizedText,
  seoTitle: LocalizedText,
  seoDescription: LocalizedText,
});
export type Category = z.infer<typeof CategorySchema>;
export const CategoriesFileSchema = z.array(CategorySchema).min(1);

export const ProductSchema = z.strictObject({
  slug: Slug,
  name: LocalizedText,
  description: LocalizedText.optional(),
  /** Image files inside public/images/<category>/. First image is the cover. */
  images: z
    .array(
      z.strictObject({
        src: z.string(),
        alt: LocalizedText,
      }),
    )
    .min(1),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  /** Set to false to hide a product without deleting it. */
  published: z.boolean().default(true),
});
export type Product = z.infer<typeof ProductSchema>;
export const ProductsFileSchema = z.array(ProductSchema);
