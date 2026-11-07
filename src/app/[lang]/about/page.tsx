import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getSite, localize } from "@/lib/content";
import { fill, isLocale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const m = await getMessages(lang);
  return pageMetadata({
    locale: lang,
    path: "/about",
    title: m.meta.aboutTitle,
    description: m.meta.aboutDescription,
  });
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const messages = await getMessages(lang);
  const site = getSite();

  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionHeading as="h1" title={messages.about.title} />
        <div className="mt-10 space-y-5 text-lg text-navy-deep/85">
          <p className="font-display text-2xl leading-snug text-navy">
            {fill(messages.about.lead, { owner: localize(site.owner, lang) })}
          </p>
          <p>{messages.about.body1}</p>
          <p>{messages.about.body2}</p>
        </div>

        <h2 className="mt-14 font-display text-2xl font-semibold text-navy">
          {messages.about.highlightsTitle}
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {messages.about.highlights.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-2xl border border-gold/40 bg-ivory p-4 text-navy-deep/85"
            >
              <span className="mt-2 size-2 shrink-0 rotate-45 bg-gold" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <CtaBand
        messages={messages}
        title={messages.home.customTitle}
        body={messages.home.customBody}
        whatsappMessage={messages.whatsapp.generic}
        whatsappLabel={messages.hero.ctaPrimary}
      />
    </>
  );
}
