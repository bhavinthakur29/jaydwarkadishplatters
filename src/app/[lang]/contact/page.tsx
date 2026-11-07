import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  ClockIcon,
  InstagramIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";
import { getSite, localize } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { localBusinessJsonLd, pageMetadata } from "@/lib/seo";
import { telUrl, whatsappUrl } from "@/lib/whatsapp";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const m = await getMessages(lang);
  return pageMetadata({
    locale: lang,
    path: "/contact",
    title: m.meta.contactTitle,
    description: m.meta.contactDescription,
  });
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const messages = await getMessages(lang);
  const site = getSite();

  const address = [
    localize(site.address.street, lang),
    localize(site.address.locality, lang),
    localize(site.address.region, lang),
    site.address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  const card = "rounded-2xl border border-gold/40 bg-ivory p-6";
  const cardTitle = "flex items-center gap-3 font-display text-lg font-semibold text-navy";

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <JsonLd data={localBusinessJsonLd(lang, messages.meta.contactDescription)} />
      <SectionHeading as="h1" title={messages.contact.title} subtitle={messages.contact.intro} />

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        <div className={card}>
          <h2 className={cardTitle}>
            <WhatsAppIcon className="text-[#128c4a]" /> {messages.contact.whatsapp}
          </h2>
          <p className="mt-2 text-navy-deep/75">{site.phone.display}</p>
          <ButtonLink
            href={whatsappUrl(site.phone.whatsapp, messages.whatsapp.generic)}
            external
            variant="whatsapp"
            icon={<WhatsAppIcon />}
            className="mt-4"
          >
            {messages.hero.ctaPrimary}
          </ButtonLink>
        </div>

        <div className={card}>
          <h2 className={cardTitle}>
            <PhoneIcon className="text-gold-dark" /> {messages.contact.call}
          </h2>
          <p className="mt-2 text-navy-deep/75">{site.phone.display}</p>
          <ButtonLink href={telUrl(site.phone.e164)} variant="navy" icon={<PhoneIcon />} className="mt-4">
            {messages.contact.call}
          </ButtonLink>
        </div>

        <div className={card}>
          <h2 className={cardTitle}>
            <MapPinIcon className="text-gold-dark" /> {messages.contact.visit}
          </h2>
          <address className="mt-2 not-italic text-navy-deep/75">{address}</address>
          <ButtonLink href={site.map.url} external variant="outline" className="mt-4">
            {messages.contact.openMap}
          </ButtonLink>
        </div>

        <div className={card}>
          <h2 className={cardTitle}>
            <InstagramIcon className="text-gold-dark" /> {messages.contact.instagram}
          </h2>
          <p className="mt-2 break-all text-navy-deep/75">{site.social.instagramHandle}</p>
          <ButtonLink href={site.social.instagram} external variant="outline" className="mt-4">
            {messages.contact.instagram}
          </ButtonLink>
        </div>
      </div>

      {site.hours.length > 0 && (
        <div className={`${card} mt-5`}>
          <h2 className={cardTitle}>
            <ClockIcon className="text-gold-dark" /> {messages.contact.hours}
          </h2>
          <ul className="mt-3 space-y-1 text-navy-deep/80">
            {site.hours.map((h) => (
              <li key={h.days.join()}>
                {h.days.map((d) => messages.contact.days[d]).join(", ")}: {h.opens} – {h.closes}
              </li>
            ))}
          </ul>
        </div>
      )}

      {site.map.embedUrl && (
        <div className="mt-5 overflow-hidden rounded-2xl border border-gold/40">
          <iframe
            src={site.map.embedUrl}
            title={address}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-80 w-full border-0"
          />
        </div>
      )}

      <p className="mt-8 text-center text-sm text-navy-deep/70">{messages.contact.customOrdersNote}</p>
    </section>
  );
}
