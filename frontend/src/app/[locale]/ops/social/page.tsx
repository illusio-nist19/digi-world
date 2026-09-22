import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { OpsSocial } from "@/components/ops-social";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Social desk",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpsSocialPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <section className="mx-auto max-w-[840px] px-5 py-20">
      <h1 className="font-display text-5xl">Social desk</h1>
      <p className="mt-4 text-ivory/80">
        Digi World store operators connect TikTok with Login Kit, then publish a live product with the Content Posting
        API (<code className="text-ivory">video.publish</code>). This page is not in the sitemap.
      </p>
      <div className="mt-10">
        <OpsSocial />
      </div>
    </section>
  );
}
