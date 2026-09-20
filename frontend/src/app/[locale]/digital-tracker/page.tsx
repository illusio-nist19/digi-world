import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Container } from "@/components/ui";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://digi-world.online";
  const path = `/${locale}/digital-tracker`;
  return {
    title: "Digital Tracker for Small Business | Offline Client CRM | Digi World",
    description:
      "Digital tracker for freelancers and studios: clients, invoices, budget, tasks, calendar, and private files. One HTML file. Works offline. Instant download.",
    alternates: {
      canonical: `${base}${path}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${base}/${l}/digital-tracker`])),
    },
    openGraph: {
      title: "Digital Tracker for Small Business | Digi World",
      description: "Offline digital tracker — clients, money, tasks, and reminders in one desk. No subscription.",
      url: `${base}${path}`,
      images: ["/images/products/client-tracker/01.png"],
    },
  };
}

export default async function DigitalTrackerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://digi-world.online";
  const productUrl = `${base}/${locale}/systems/client-tracker`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Digi World Professional Tracker",
    alternateName: ["Digital Tracker", "Digi World Client Tracker"],
    applicationCategory: "BusinessApplication",
    operatingSystem: "Windows, macOS, Linux, iOS, Android",
    offers: {
      "@type": "Offer",
      price: "39.00",
      priceCurrency: "USD",
      url: productUrl,
      availability: "https://schema.org/InStock",
    },
    description:
      "Digital tracker for small business: clients, invoices, budget, tasks, calendar, and files. Offline HTML desk. No Google account.",
    url: `${base}/${locale}/digital-tracker`,
    brand: { "@type": "Brand", name: "Digi World" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="py-16 md:py-24">
        <Container className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Digi World</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl">
            Digital tracker for small business
          </h1>
          <p className="mt-6 text-lg text-ivory/80">
            A digital tracker is how you see the whole desk at once: who you work for, who still owes you, what is due
            today, and what you spent this month. Digi World Professional Tracker is that desk — one file, your computer,
            no monthly CRM.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/systems/client-tracker"
              className="inline-flex h-12 items-center rounded-full bg-gold px-6 font-medium text-ink"
            >
              Open the product
            </Link>
            <a
              href="https://digi-world.online/en/systems/client-tracker"
              className="inline-flex h-12 items-center rounded-full border border-ivory/20 px-6"
            >
              Instant download · $39
            </a>
          </div>
        </Container>

        <Container className="mt-16 grid gap-6 md:grid-cols-2">
          {[
            ["Clients", "Every company, status, and next action in one record — not buried in DMs."],
            ["Invoices", "Paid, unpaid, partial, overdue. See who still owes you."],
            ["Budget", "Drop Excel, PDF, or CSV. Income, expenses, saving, leftover."],
            ["Calendar & tasks", "The day that matters shows in Today. Follow-ups do not disappear."],
            ["Private files", "Contracts and IDs stay on this computer. Nothing uploaded to us."],
            ["Offline", "Double-click the HTML. Works without a Google account or a subscription."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-line p-6">
              <h2 className="font-display text-2xl text-gold">{title}</h2>
              <p className="mt-2 text-ivory/70">{body}</p>
            </div>
          ))}
        </Container>

        <Container className="mt-16 max-w-3xl">
          <h2 className="font-display text-4xl">Who this digital tracker is for</h2>
          <p className="mt-4 text-ivory/70">
            Freelancers, photographers, consultants, and one-person studios who invoice, follow up, and refuse another
            cloud login. It is not tax software, not a lawyer-drafted contract, and not a team CRM in the cloud.
          </p>
          <h2 className="mt-12 font-display text-4xl">Why Google should send you here</h2>
          <p className="mt-4 text-ivory/70">
            Most “digital tracker” results are fitness bands or GPS. This page is the business kind: a client and money
            tracker you own. Search{" "}
            <strong className="text-ivory">digital tracker for small business</strong>,{" "}
            <strong className="text-ivory">business CRM tracker</strong>,{" "}
            <strong className="text-ivory">offline client tracker</strong>, or{" "}
            <strong className="text-ivory">HTML CRM no subscription</strong> — those phrases match what we sell.{" "}
            <Link href="/business-crm-tracker" className="text-gold underline-offset-4 hover:underline">
              Business CRM tracker
            </Link>{" "}
            is the dedicated page for that search.
          </p>
          <Link
            href="/systems/client-tracker"
            className="mt-10 inline-flex h-12 items-center rounded-full bg-gold px-6 font-medium text-ink"
          >
            See Digi World Client Tracker
          </Link>
        </Container>
      </article>
    </>
  );
}
