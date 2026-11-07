import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/ui/JsonLd";
import { ProductGallery } from "@/components/ui/ProductGallery";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  categoryImageUrl,
  getCategories,
  getCategory,
  getProducts,
  localize,
} from "@/lib/content";
import { toGalleryItems } from "@/lib/gallery";
import { fill, isLocale, localePath } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string; category: string }> };

// Runs once per language (the parent layout supplies `lang`).
export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category: slug } = await params;
  const category = getCategory(slug);
  if (!isLocale(lang) || !category) return {};
  return pageMetadata({
    locale: lang,
    path: `/${slug}`,
    title: localize(category.seoTitle, lang),
    description: localize(category.seoDescription, lang),
    image: categoryImageUrl(category.cover),
  });
}

export default async function CategoryPage({ params }: Props) {
  const { lang, category: slug } = await params;
  const category = getCategory(slug);
  if (!isLocale(lang) || !category) notFound();

  const messages = await getMessages(lang);
  const name = localize(category.name, lang);
  const items = toGalleryItems(
    getProducts(slug).map((product) => ({ category, product })),
    lang,
    messages,
  );
  const others = getCategories().filter((c) => c.slug !== slug);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: messages.category.home, path: "/" },
            { name, path: `/${slug}` },
          ],
          lang,
        )}
      />

      <section className="pattern-navy text-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-cream/70">
            <Link href={localePath(lang, "/")} className="hover:text-gold">
              {messages.category.home}
            </Link>
            <span className="mx-2 text-gold" aria-hidden>
              /
            </span>
            <span aria-current="page">{name}</span>
          </nav>
          <SectionHeading as="h1" light align="left" title={name} subtitle={localize(category.intro, lang)} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {items.length > 0 ? (
          <ProductGallery items={items} labels={messages.gallery} priorityCount={4} />
        ) : (
          <p className="mx-auto max-w-lg text-center text-navy-deep/75">{messages.gallery.empty}</p>
        )}
      </section>

      <CtaBand
        messages={messages}
        title={messages.category.ctaTitle}
        body={messages.category.ctaBody}
        whatsappMessage={fill(messages.whatsapp.category, { name })}
        whatsappLabel={fill(messages.category.ctaButton, { name })}
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-navy">{messages.category.otherTitle}</h2>
        <ul className="mt-5 flex flex-wrap gap-3">
          {others.map((c) => (
            <li key={c.slug}>
              <Link
                href={localePath(lang, `/${c.slug}`)}
                className="inline-block rounded-full border border-navy/25 px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:border-navy hover:bg-navy hover:text-cream"
              >
                {localize(c.name, lang)}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
