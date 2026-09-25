import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Container } from "@/components/ui";
import { pageAlternates, absoluteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const path = "/business-crm-tracker";
  return {
    title: "Business CRM Tracker for Small Business | Offline Client Desk | Digi World",
    description:
      "Business CRM tracker that runs offline: clients, invoices, tasks, budget, calendar, and private files in one HTML desk. No monthly subscription. Instant download from Digi World.",
    keywords: [
      "business CRM tracker",
      "CRM tracker",
      "small business CRM",
      "offline CRM",
      "client tracker",
      "freelancer CRM",
      "invoice tracker",
    ],
    alternates: pageAlternates(locale, path),
    openGraph: {
      title: "Business CRM Tracker | Digi World",
      description: "Offline business CRM tracker — clients, money, tasks, and reminders. One file. No subscription.",
      url: absoluteUrl(locale, path),
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Digi World Professional CRM",
        alternateName: ["Professional CRM", "Business CRM Tracker", "Customer Relationship Management", "Digi World Client Tracker"],
        applicationCategory: "BusinessApplication",
        operatingSystem: "Windows, macOS, Linux, iOS, Android",
        description:
          "Business CRM tracker for small studios: clients, invoices, budget, tasks, calendar, and files. Offline HTML desk. No Google account.",
        url: pageUrl,
        offers: {
          "@type": "Offer",
          price: "39.00",
          priceCurrency: "USD",
          url: productUrl,
          availability: "https://schema.org/InStock",
        },
        brand: { "@type": "Brand", name: "Digi World" },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is a business CRM tracker?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A business CRM tracker is one desk for clients, follow-ups, invoices, tasks, and dates — so you are not hunting DMs, folders, and sticky notes. Digi World Professional CRM is that Customer Relationship Management desk as a single HTML file you own.",
            },
          },
          {
            "@type": "Question",
            name: "Is this a monthly CRM like HoneyBook?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. It is a one-time download. It opens in your browser, works offline, and keeps client data on your computer. It is not a cloud team CRM and not tax software.",
            },
          },
          {
            "@type": "Question",
            name: "Who is this business CRM tracker for?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Freelancers, photographers, consultants, and one-person studios who invoice, follow up, and want a clear overview without another login.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="py-16 md:py-24">
        <Container className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">Digi World · Business CRM tracker</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-6xl">Business CRM tracker</h1>
          <p className="mt-6 text-lg text-ivory/80">
            A business CRM tracker is the desk that ends the anarchy: every client, every unpaid invoice, every task, and
            the date you cannot miss — in one place. Digi World Professional CRM is that Customer Relationship Management desk. One HTML file. Your
            computer. No monthly CRM.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/systems/client-tracker"
              className="inline-flex h-12 items-center rounded-full bg-gold px-6 font-medium text-ink"
            >
              Open the business CRM tracker
            </Link>
            <Link
              href="/digital-tracker"
              className="inline-flex h-12 items-center rounded-full border border-ivory/20 px-6"
            >
              Digital tracker overview
            </Link>
          </div>
        </Container>

        <Container className="mt-16 grid gap-6 md:grid-cols-2">
          {[
            ["Clients", "Every company, status, source, and next action in one record — not buried in DMs."],
            ["Invoices", "Paid, unpaid, partial, overdue. See who still owes you before you chase."],
            ["Tasks", "Due dates tied to the client. The next right thing, not a graveyard of to-dos."],
            ["Calendar", "Events, invoices, and tasks on the day they land — including Today."],
            ["Budget", "Drop Excel, PDF, or CSV. Income, expenses, saving, leftover calculate themselves."],
            ["Private files", "Contracts and IDs stay on this computer. Digi World never sees them."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-line p-6">
              <h2 className="font-display text-2xl text-gold">{title}</h2>
              <p className="mt-2 text-ivory/70">{body}</p>
            </div>
          ))}
        </Container>

        <Container className="mt-16 max-w-3xl space-y-6 text-ivory/70">
          <h2 className="font-display text-4xl text-ivory">Why not a spreadsheet CRM?</h2>
          <p>
            Spreadsheet CRMs break when you add invoices, files, and a calendar. Cloud CRMs charge every month and upload
            your book. This business CRM tracker is a working desk: drag and drop files, refresh the budget, and the
            dashboard shows leftover, open invoices, and what is due today.
          </p>
          <h2 className="font-display text-4xl text-ivory">Who it is for</h2>
          <p>
            Freelancers, photographers, consultants, coaches, and one-person shops who sell a service and follow up.
            It is not a lawyer-drafted contract, not tax filing software, and not a multi-seat cloud CRM for a large team.
          </p>
          <h2 className="font-display text-4xl text-ivory">How to start</h2>
          <p>
            Download from the product page, keep the folder together, double-click the HTML. Setup takes about ten
            minutes: business name, currency, first client. Then the dashboard is the situation.
          </p>
          <p className="text-sm text-stone">
            Also called a{" "}
            <Link href="/digital-tracker" className="text-gold underline-offset-4 hover:underline">
              digital tracker
            </Link>{" "}
            or offline client tracker. The product lives at{" "}
            <Link href="/systems/client-tracker" className="text-gold underline-offset-4 hover:underline">
              Digi World Professional CRM
            </Link>
            .
          </p>
          <Link
            href="/systems/client-tracker"
            className="inline-flex h-12 items-center rounded-full bg-gold px-6 font-medium text-ink"
          >
            Buy the tracker · $39
          </Link>
        </Container>
      </article>
    </>
  );
}
