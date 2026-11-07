import type { GalleryItem } from "@/components/ui/ProductGallery";
import { getSite, localize, productImageUrl } from "./content";
import { fill, type Locale } from "./i18n";
import type { Messages } from "./messages";
import type { Category, Product } from "./schema";
import { whatsappUrl } from "./whatsapp";

/**
 * Turns content products into what the (client-side) gallery needs: localised text,
 * image URLs and a ready-made WhatsApp enquiry link per product.
 */
export function toGalleryItems(
  entries: { category: Category; product: Product }[],
  locale: Locale,
  messages: Messages,
  options: { showCategory?: boolean } = {},
): GalleryItem[] {
  const site = getSite();
  return entries.map(({ category, product }) => {
    const categoryName = localize(category.name, locale);
    const name = localize(product.name, locale);
    const cover = product.images[0];
    return {
      id: `${category.slug}/${product.slug}`,
      name,
      description: product.description ? localize(product.description, locale) : undefined,
      category: options.showCategory ? categoryName : undefined,
      src: productImageUrl(category.slug, cover.src),
      alt: localize(cover.alt, locale),
      enquireUrl: whatsappUrl(
        site.phone.whatsapp,
        fill(messages.whatsapp.product, { name, category: categoryName }),
      ),
    };
  });
}
