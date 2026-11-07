import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/content";
import { defaultLocale, locales } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo";

/** One entry per page per language, each listing all its language alternates (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.8 },
    ...getCategories().map((c) => ({ path: `/${c.slug}`, priority: 0.9 })),
  ];

  return pages.flatMap(({ path, priority }) => {
    const languages: Record<string, string> = Object.fromEntries(
      locales.map((l) => [l, absoluteUrl(l, path)]),
    );
    languages["x-default"] = absoluteUrl(defaultLocale, path);
    return locales.map((locale) => ({
      url: absoluteUrl(locale, path),
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages },
    }));
  });
}
