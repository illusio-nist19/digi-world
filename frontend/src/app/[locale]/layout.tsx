import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Instrument_Sans, Syne } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CommerceLayer } from "@/components/commerce";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PixelBoot } from "@/components/pixels";
import { getCatalog } from "@/lib/catalog";
import { routing, type Locale } from "@/i18n/routing";
import "../globals.css";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ["600", "700"] });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", weight: ["400", "500"] });
const plex = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], variable: "--font-arabic", weight: ["400", "500", "600", "700"] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://digi-world.online"),
  icons: { icon: "/favicon.svg" },
  openGraph: { images: ["/images/og-default.png"] },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const catalog = await getCatalog();
  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <html lang={locale} dir={dir} className={`${syne.variable} ${instrument.variable} ${plex.variable}`}>
      <head>
        <meta name="p:domain_verify" content="3358f811ab3c6b25ddaf6dd2d4511d5c" />
      </head>
      <body className="min-h-screen font-sans text-ivory antialiased">
        <NextIntlClientProvider messages={messages}>
          <PixelBoot />
          <Header locale={locale as Locale} />
          <main>{children}</main>
          <Footer locale={locale} catalog={catalog} />
          <CommerceLayer catalog={catalog} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
