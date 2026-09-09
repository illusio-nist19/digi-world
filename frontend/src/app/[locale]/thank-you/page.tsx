import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { PixelBoot } from "@/components/pixels";
import { ThankYouClient } from "@/components/thank-you";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ThankYou({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PixelBoot forceInteractive />
      <Suspense>
        <ThankYouClient />
      </Suspense>
    </>
  );
}
