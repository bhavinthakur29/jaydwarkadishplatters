import Link from "next/link";
import { getCategories, getSite, localize } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import type { Messages } from "@/lib/messages";
import { telUrl, whatsappUrl } from "@/lib/whatsapp";
import { InstagramIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "../ui/icons";

export function Footer({ locale, messages }: { locale: Locale; messages: Messages }) {
  const site = getSite();
  const categories = getCategories();
  const address = [
    localize(site.address.street, locale),
    localize(site.address.locality, locale),
    localize(site.address.region, locale),
    site.address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <footer className="pattern-navy text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={site.logo} alt="" width={64} height={64} className="size-16 rounded-full" />
          <p className="mt-4 font-display text-xl font-semibold">{localize(site.name, locale)}</p>
          <p className="mt-2 max-w-xs text-sm text-cream/75">{localize(site.tagline, locale)}</p>
          <p className="mt-4 text-sm text-gold-soft">{messages.footer.customOrders}</p>
        </div>

        <nav aria-label={messages.footer.categories}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            {messages.footer.categories}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={localePath(locale, `/${c.slug}`)}
                  className="text-cream/85 transition-colors hover:text-gold"
                >
                  {localize(c.name, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            {messages.footer.contact}
          </p>
          <ul className="mt-4 space-y-3 text-sm text-cream/85">
            <li className="flex items-start gap-3">
              <MapPinIcon className="mt-0.5 shrink-0 text-gold" />
              <a href={site.map.url} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                {address}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <PhoneIcon className="shrink-0 text-gold" />
              <a href={telUrl(site.phone.e164)} className="hover:text-gold">
                {site.phone.display}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <WhatsAppIcon className="shrink-0 text-gold" />
              <a
                href={whatsappUrl(site.phone.whatsapp, messages.whatsapp.generic)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold"
              >
                WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-3">
              <InstagramIcon className="shrink-0 text-gold" />
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold"
              >
                {site.social.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold/20">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-cream/60 sm:px-6">
          © {new Date().getFullYear()} {localize(site.name, locale)}. {messages.footer.rights}
        </p>
      </div>
    </footer>
  );
}
