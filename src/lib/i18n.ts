/**
 * Pure locale helpers, safe to import from client components.
 * (UI message loading lives in ./messages.ts, which is server-only.)
 */
export const locales = ["en", "hi", "gu"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  gu: "ગુજરાતી",
};

/** Open Graph locale codes. */
export const ogLocales: Record<Locale, string> = {
  en: "en_IN",
  hi: "hi_IN",
  gu: "gu_IN",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * English lives at the root (no prefix); Hindi and Gujarati are /hi and /gu.
 * `path` is the locale-less path, e.g. "/", "/about", "/chhab".
 */
export function localePath(locale: Locale, path: string = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Remove a leading /en, /hi or /gu from a pathname. */
export function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/(en|hi|gu)(\/.*)?$/);
  if (!match) return pathname || "/";
  return match[2] || "/";
}

/** Replace {placeholders} in a message. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  );
}
