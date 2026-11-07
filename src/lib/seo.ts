import type { Metadata } from "next";
import { getSite, localize } from "./content";
import { defaultLocale, localePath, locales, ogLocales, type Locale } from "./i18n";

/** Canonical origin. Set NEXT_PUBLIC_SITE_URL in the host's env vars to override content/site.json. */
export function siteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  return (fromEnv || getSite().url).replace(/\/$/, "");
}

export function absoluteUrl(locale: Locale, path: string = "/"): string {
  return `${siteUrl()}${localePath(locale, path)}`;
}

/** Canonical + hreflang alternates for a locale-less path. */
export function alternatesFor(locale: Locale, path: string = "/") {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = localePath(l, path);
  languages["x-default"] = localePath(defaultLocale, path);
  return { canonical: localePath(locale, path), languages };
}

type PageMetaInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  /** Path inside the site, e.g. "/images/chhab/x.webp". Defaults to the brand OG image. */
  image?: string;
};

/** Everything a page needs for search + link previews (WhatsApp, Facebook, X). */
export function pageMetadata({ locale, path, title, description, image }: PageMetaInput): Metadata {
  const site = getSite();
  const ogImage = image ?? site.ogImage;
  return {
    title,
    description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      type: "website",
      siteName: localize(site.name, locale),
      title,
      description,
      url: localePath(locale, path),
      locale: ogLocales[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
      images: [{ url: ogImage, alt: localize(site.name, locale) }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/* ----------------------------- structured data ----------------------------- */

export function localBusinessJsonLd(locale: Locale, description: string) {
  const site = getSite();
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${base}/#business`,
    name: localize(site.name, locale),
    description,
    url: absoluteUrl(locale, "/"),
    image: `${base}${site.ogImage}`,
    logo: `${base}${site.logo}`,
    telephone: site.phone.e164,
    founder: { "@type": "Person", name: localize(site.owner, locale) },
    address: {
      "@type": "PostalAddress",
      streetAddress: localize(site.address.street, locale),
      addressLocality: localize(site.address.locality, locale),
      addressRegion: localize(site.address.region, locale),
      ...(site.address.postalCode ? { postalCode: site.address.postalCode } : {}),
      addressCountry: site.address.country,
    },
    ...(site.areaServed.length
      ? { areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })) }
      : {}),
    ...(site.hours.length
      ? {
          openingHoursSpecification: site.hours.map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.days,
            opens: h.opens,
            closes: h.closes,
          })),
        }
      : {}),
    hasMap: site.map.url,
    sameAs: [site.social.instagram],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path),
    })),
  };
}
