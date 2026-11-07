import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Hero } from "@/components/sections/Hero";
import { JsonLd } from "@/components/ui/JsonLd";
import { isLocale } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { localBusinessJsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const m = await getMessages(lang);
  return pageMetadata({
    locale: lang,
    path: "/",
    title: m.meta.homeTitle,
    description: m.meta.homeDescription,
  });
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const messages = await getMessages(lang);

  return (
    <>
      <JsonLd data={localBusinessJsonLd(lang, messages.meta.homeDescription)} />
      <Hero locale={lang} messages={messages} />
      <CategoryGrid locale={lang} messages={messages} />
      <FeaturedWork locale={lang} messages={messages} />
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
