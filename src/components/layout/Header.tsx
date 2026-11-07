import Link from "next/link";
import { getSite, localize } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import type { Messages } from "@/lib/messages";
import { telUrl, whatsappUrl } from "@/lib/whatsapp";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
import { PhoneIcon, WhatsAppIcon } from "../ui/icons";
import { MobileMenu } from "./MobileMenu";

export function Header({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const site = getSite();
  const name = localize(site.name, locale);

  const links = [
    { href: localePath(locale, "/"), label: messages.nav.home },
    { href: `${localePath(locale, "/")}#work`, label: messages.nav.work },
    { href: localePath(locale, "/about"), label: messages.nav.about },
    { href: localePath(locale, "/contact"), label: messages.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-gold/30 bg-navy-deep/95 text-cream backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href={localePath(locale, "/")}
          className="flex min-w-0 items-center gap-3"
          aria-label={name}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={site.logo}
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full"
          />
          <span className="truncate font-display text-base font-semibold leading-tight sm:text-lg">
            {localize(site.shortName, locale)}
          </span>
        </Link>

        <nav
          aria-label={messages.nav.mainNav}
          className="hidden items-center gap-7 text-sm md:flex"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-cream/85 transition-colors hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher locale={locale} label={messages.switcher.label} />
          </div>
          <a
            href={telUrl(site.phone.e164)}
            aria-label={`${messages.contact.call}: ${site.phone.display}`}
            className="hidden size-10 place-items-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold hover:text-navy-deep lg:grid"
          >
            <PhoneIcon />
          </a>
          <a
            href={whatsappUrl(site.phone.whatsapp, messages.whatsapp.generic)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-[#128c4a] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0f7a40] md:inline-flex"
          >
            <WhatsAppIcon />
            WhatsApp
          </a>

          {/* Mobile menu: a <details> element, so it works without any JavaScript. */}
          {/* Mobile menu: closes itself when a link is tapped (see MobileMenu). */}
          <MobileMenu label={messages.nav.menu}>
            <nav aria-label={messages.nav.mainNav} className="flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-3 py-2.5 text-cream/90 hover:bg-white/10 hover:text-gold"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 border-t border-gold/20 pt-3">
              <LanguageSwitcher
                locale={locale}
                label={messages.switcher.label}
              />
            </div>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
