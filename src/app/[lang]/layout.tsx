import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Header } from "@/components/layout/Header";
import { getSite, localize } from "@/lib/content";
import { isLocale, locales } from "@/lib/i18n";
import { getMessages } from "@/lib/messages";
import { siteUrl } from "@/lib/seo";
import "../globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

// Pre-build /, /hi and /gu versions of every page; anything else is a 404.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}
export const dynamicParams = false;

export const viewport: Viewport = {
  themeColor: "#0d1646",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const site = getSite();
  return {
    metadataBase: new URL(siteUrl()),
    applicationName: localize(site.name, lang),
    formatDetection: { telephone: false },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const messages = await getMessages(lang);

  return (
    <html lang={lang}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-navy-deep"
        >
          {messages.nav.skip}
        </a>
        <Header locale={lang} messages={messages} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={lang} messages={messages} />
        <FloatingWhatsApp messages={messages} />
      </body>
    </html>
  );
}
