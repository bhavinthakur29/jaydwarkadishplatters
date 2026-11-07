import Image from "next/image";
import type { CSSProperties } from "react";
import { categoryImageUrl, getCategories, getSite, localize } from "@/lib/content";
import { localePath, type Locale } from "@/lib/i18n";
import type { Messages } from "@/lib/messages";
import { whatsappUrl } from "@/lib/whatsapp";
import { ButtonLink } from "../ui/Button";
import { WhatsAppIcon } from "../ui/icons";

/** Stagger delay for the CSS entrance animation (.rise in globals.css). */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero({ locale, messages }: { locale: Locale; messages: Messages }) {
  const site = getSite();
  // Three category covers in arch frames, echoing the arches of a wedding mandap.
  const arches = getCategories().slice(0, 3);

  return (
    <section className="pattern-navy relative overflow-hidden text-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 md:grid-cols-[1.1fr_1fr] md:py-20 lg:py-24">
        <div>
          <p
            className="rise text-xs font-semibold uppercase tracking-[0.25em] text-gold"
            style={delay(0)}
          >
            {messages.hero.eyebrow}
          </p>
          <h1
            className="rise mt-4 font-display text-4xl font-semibold leading-[1.15] sm:text-5xl lg:text-6xl"
            style={delay(100)}
          >
            {messages.hero.title}
          </h1>
          <p className="rise mt-5 max-w-xl text-base text-cream/80 sm:text-lg" style={delay(200)}>
            {messages.hero.subtitle}
          </p>
          <div className="rise mt-8 flex flex-wrap gap-3" style={delay(300)}>
            <ButtonLink
              href={whatsappUrl(site.phone.whatsapp, messages.whatsapp.generic)}
              external
              variant="gold"
              icon={<WhatsAppIcon />}
            >
              {messages.hero.ctaPrimary}
            </ButtonLink>
            <ButtonLink href={`${localePath(locale, "/")}#work`} variant="outlineLight">
              {messages.hero.ctaSecondary}
            </ButtonLink>
          </div>
        </div>

        <div className="grid grid-cols-3 items-end gap-3 sm:gap-4">
          {arches.map((category, i) => (
            // Outer wrapper rises in once; inner arch then floats gently, each at its own pace.
            <div key={category.slug} className="rise" style={delay(250 + i * 140)}>
              <div
                className={`float relative aspect-[3/5] overflow-hidden rounded-t-[999px] rounded-b-2xl border-2 border-gold/70 bg-navy-soft ${
                  i === 1 ? "-translate-y-6" : i === 2 ? "translate-y-3" : ""
                }`}
                style={delay(1200 + i * 700)}
              >
                <Image
                  src={categoryImageUrl(category.cover)}
                  alt={localize(category.coverAlt, locale)}
                  fill
                  sizes="(min-width: 768px) 15vw, 30vw"
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
