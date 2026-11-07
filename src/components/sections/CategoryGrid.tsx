import Image from "next/image";
import Link from "next/link";
import { categoryImageUrl, getCategories, localize } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import type { Messages } from "@/lib/messages";
import { ArrowRightIcon } from "../ui/icons";
import { SectionHeading } from "../ui/SectionHeading";

export function CategoryGrid({ locale, messages }: { locale: Locale; messages: Messages }) {
  const categories = getCategories();
  return (
    <section id="work" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        title={messages.home.categoriesTitle}
        subtitle={messages.home.categoriesSubtitle}
      />
      <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link href={localePath(locale, `/${category.slug}`)} className="group block">
              <span className="relative block aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-2xl border-2 border-gold/60 bg-sand transition-shadow group-hover:shadow-xl">
                <Image
                  src={categoryImageUrl(category.cover)}
                  alt={localize(category.coverAlt, locale)}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </span>
              <span className="mt-4 flex items-start justify-between gap-3">
                <span>
                  <span className="block font-display text-lg font-semibold text-navy sm:text-xl">
                    {localize(category.name, locale)}
                  </span>
                  <span className="mt-1 block text-sm text-navy-deep/70">
                    {localize(category.tagline, locale)}
                  </span>
                </span>
                <ArrowRightIcon className="mt-1.5 shrink-0 text-gold-dark transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
