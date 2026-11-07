import { getFeaturedProducts } from "@/lib/content";
import { toGalleryItems } from "@/lib/gallery";
import type { Locale } from "@/lib/i18n";
import type { Messages } from "@/lib/messages";
import { ProductGallery } from "../ui/ProductGallery";
import { SectionHeading } from "../ui/SectionHeading";

export function FeaturedWork({ locale, messages }: { locale: Locale; messages: Messages }) {
  const featured = getFeaturedProducts(8);
  if (featured.length === 0) return null;

  return (
    <section className="bg-ivory py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          title={messages.home.featuredTitle}
          subtitle={messages.home.featuredSubtitle}
        />
        <div className="mt-12">
          <ProductGallery
            items={toGalleryItems(featured, locale, messages, { showCategory: true })}
            labels={messages.gallery}
          />
        </div>
      </div>
    </section>
  );
}
