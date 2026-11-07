"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeNames, localePath, locales, stripLocale, type Locale } from "@/lib/i18n";

/**
 * Links to the same page in each language. Plain links (not a dropdown or a
 * redirect) so search engines and screen readers see every language version.
 */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const path = stripLocale(pathname);

  return (
    <nav aria-label={label} className="flex items-center gap-1 rounded-full border border-gold/40 p-0.5">
      {locales.map((l) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={localePath(l, path)}
            lang={l}
            hrefLang={l}
            aria-current={active ? "true" : undefined}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              active
                ? "bg-gold text-navy-deep"
                : "text-cream/85 hover:bg-white/10 hover:text-cream"
            }`}
          >
            {localeNames[l]}
          </Link>
        );
      })}
    </nav>
  );
}
