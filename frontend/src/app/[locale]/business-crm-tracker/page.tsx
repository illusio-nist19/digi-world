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
  const path = `/${locale}/business-crm-tracker`;
  const title = "Business CRM Tracker | Offline Client, Invoice & Task Desk | Digi World";
  const description =
    "Business CRM tracker for small studios: clients, invoices, budget, tasks, and calendar in one HTML file. Works offline. No subscription. Instant download from Digi World.";
  return {
    title,
    description,
    keywords: [
      "business CRM tracker",
      "CRM tracker",
      "small business CRM",
      "offline CRM",
      "client tracker",
      "invoice tracker for business",
      "freelancer CRM no subscription",
    ],
    alternates: {
      canonical: `${base}${path}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${base}/${l}/business-crm-tracker`])),
    },
    openGraph: {
      title: "Business CRM Tracker | Digi World",
      description,
      url: `${base}${path}`,
      images: ["/images/products/client-tracker/01.png"],
    },
  };
}

export default async function BusinessCrmTrackerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://digi-world.online";
  const productUrl = `${base}/${locale}/systems/client-tracker`;
  const pageUrl = `${base}/${locale}/business-crm-tracker`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Digi World Professional Tracker",
      alternateName: ["Business CRM Tracker", "Digi World Client Tracker"],
      applicationCategory: "BusinessApplication",
      operatingSystem: "Windows, macOS, Linux, iOS, Android",
      description:
        "Business CRM tracker: clients, invoices, budget, tasks, calendar, and private files. Offline HTML desk. No monthly subscription.",
      url: pageUrl,
      brand: { "@type": "Brand", name: "Digi World" },
      offers: {
        "@type": "Offer",
        price: "39.00",
        priceCurrency: "USD",
        url: productUrl,
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is a business CRM tracker?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A business CRM tracker is one place to keep clients, follow-ups, invoices, tasks, and dates so you can see the situation of the studio at a glance. Digi World Professional Tracker is that desk as a single HTML file you own.",
          },
        },
        {
          "@type": "Question",
          name: "How is this business CRM tracker different from HubSpot or Zoho?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Those are cloud subscriptions. This tracker opens on your computer, works offline, stores data on this device, and is a one-time download. It is built for a one-person studio, not a sales team of fifty.",
          },
        },
        {
          "@type": "Question",
          name: "Does the business CRM tracker work without internet?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Double-click the HTML file. Everyday tracking is offline. Drag-and-drop Excel or PDF extract on the Budget tab needs an internet connection once for the reader libraries.",
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Digi World", item: `${base}/${locale}` },
        { "@type": "ListItem", position: 2, name: "Business CRM tracker", item: pageUrl },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="py-16 md:py-24">
        <Container className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Business CRM tracker</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl">
            Business CRM tracker — one desk, not another monthly login
          </h1>
          <p className="mt-6 text-lg text-ivory/80">
            A business CRM tracker is how a small studio stops the anarchy: clients in DMs, invoices in a folder, tasks
            on paper. Digi World Professional Tracker gathers the files you already have, shows a clear overview, and
            reminds you of the dates that matter.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/systems/client-tracker"
              className="inline-flex h-12 items-center rounded-full bg-gold px-6 font-medium text-ink"
            >
              Open the business CRM tracker
            </Link>
            <Link href="/systems/client-tracker" className="inline-flex h-12 items-center rounded-full border border-ivory/20 px-6">
              Instant download · $39
            </Link>
          </div>
        </Container>

        <Container className="mt-16 grid gap-6 md:grid-cols-2">
          {[
            ["Clients", "Every company, status, and next action in one record."],
            ["Invoices", "Paid, unpaid, partial, overdue — who still owes you."],
            ["Budget", "Drop Excel, PDF, or CSV. Income, expenses, saving, leftover."],
            ["Tasks & calendar", "The next right thing, on the day it is due — including Today."],
            ["Private files", "Contracts stay on this computer. Digi World never sees them."],
            ["Offline CRM", "No Google account. No HubSpot bill. One HTML file you own."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-line p-6">
              <h2 className="font-display text-2xl text-gold">{title}</h2>
              <p className="mt-2 text-ivory/70">{body}</p>
            </div>
          ))}
        </Container>

        <Container className="mt-16 max-w-3xl">
          <h2 className="font-display text-4xl">Business CRM tracker vs a cloud CRM</h2>
          <p className="mt-4 text-ivory/70">
            Search “business CRM tracker” and Google will show HubSpot, Zoho, and Pipedrive. Those tools are built for
            teams who rent software every month. This page is for the other search: a tracker you buy once, open
            offline, and keep next to your real invoices and contracts.
          </p>
          <ul className="mt-6 space-y-3 text-ivory/80">
            <li>
              <strong className="text-ivory">Cloud CRM:</strong> login, subscription, your clients live on their server.
            </li>
            <li>
              <strong className="text-ivory">This business CRM tracker:</strong> double-click, $39 once, data stays on
              this device.
            </li>
          </ul>

          <h2 className="mt-12 font-display text-4xl">Who it is for</h2>
          <p className="mt-4 text-ivory/70">
            Freelancers, photographers, consultants, and one-person shops who invoice, follow up, and do not want a
            second job called “CRM admin.” It is not Salesforce, not tax software, and not a lawyer-drafted contract.
          </p>

          <h2 className="mt-12 font-display text-4xl">FAQ</h2>
          <dl className="mt-6 space-y-6">
            <div>
              <dt className="font-display text-xl">What is a business CRM tracker?</dt>
              <dd className="mt-2 text-ivory/70">
                One place for clients, money, tasks, and dates — so you can see the situation of the business at a
                glance instead of hunting across apps.
              </dd>
            </div>
            <div>
              <dt className="font-display text-xl">Will this rank me on Google?</dt>
              <dd className="mt-2 text-ivory/70">
                This page is built so Google can understand the product. Rankings still need Search Console, links from
                Pinterest and your shop, and time. Nobody can honestly promise a top-5 slot against HubSpot.
              </dd>
            </div>
          </dl>

          <Link
            href="/systems/client-tracker"
            className="mt-10 inline-flex h-12 items-center rounded-full bg-gold px-6 font-medium text-ink"
          >
            Get the tracker
          </Link>
        </Container>
      </article>
    </>
  );
}
