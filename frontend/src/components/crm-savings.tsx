import Image from "next/image";
import { Link } from "@/i18n/navigation";

type BenefitCard = { eyebrow: string; title: string; body: string };

export function CrmSavingsSection({
  title,
  highlightName,
  highlightPrice,
  highlightNote,
  savingsLabel,
  monthlySave,
  cta,
  cards,
  imageSrc,
  photoBadgeTop,
  photoBadgeMid,
  photoBadgeBottom,
}: {
  title: string;
  highlightName: string;
  highlightPrice: string;
  highlightNote: string;
  savingsLabel: string;
  monthlySave: string;
  cta: string;
  cards: BenefitCard[];
  imageSrc: string;
  photoBadgeTop: string;
  photoBadgeMid: string;
  photoBadgeBottom: string;
}) {
  return (
    <section className="overflow-hidden">
      <div className="bg-gradient-to-br from-[#3d322a] via-[#53463c] to-[#c96b52] px-5 py-12 text-center md:py-16">
        <h2 className="mx-auto max-w-3xl font-display text-3xl font-semibold text-[#fff8f1] md:text-5xl">
          {title}
        </h2>
      </div>

      <div className="relative bg-[#f6ebe0] px-5 pb-16 pt-10 text-[#3d322a] md:px-8">
        <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="group relative z-10 -mt-16 overflow-hidden rounded-2xl border border-[#e4d0bc] bg-gradient-to-b from-[#fff8f1] to-[#f7efe6] shadow-[0_24px_60px_rgba(61,50,42,.14)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(201,107,82,.22)]">
            <div className="p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c96b52]">
                {highlightName}
              </p>
              <p className="mt-4 font-display text-5xl font-bold tracking-tight text-[#3d322a] md:text-6xl">
                {highlightPrice}
              </p>
              <p className="mt-3 max-w-[28ch] text-sm leading-relaxed text-[#7a6b5c]">
                {highlightNote}
              </p>
              <Link
                href="/systems/client-tracker"
                className="mt-8 inline-flex h-12 items-center rounded-full bg-[#c96b52] px-6 font-medium text-[#fff8f1] transition hover:bg-[#d9924a] hover:shadow-[0_10px_28px_rgba(201,107,82,.35)]"
              >
                {cta}
              </Link>
            </div>
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src={imageSrc}
                alt=""
                fill
                className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div className="pointer-events-none absolute inset-y-[18%] right-[4%] flex w-[28%] min-w-[7.5rem] max-w-[11rem] items-center justify-center sm:right-[5%]">
                <div className="w-full rounded-md border-2 border-[#c96b52] bg-[#fff8f1]/96 px-2 py-3 text-center shadow-[0_10px_28px_rgba(61,50,42,.25)] backdrop-blur-[2px] sm:px-3 sm:py-4">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#c96b52] sm:text-[9px]">
                    {photoBadgeTop}
                  </p>
                  <p className="mt-1 font-display text-[clamp(0.85rem,2.6vw,1.35rem)] font-bold leading-tight text-[#3d322a]">
                    {photoBadgeMid}
                  </p>
                  <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#c96b52] sm:text-[9px]">
                    {photoBadgeBottom}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-[#e4d0bc] bg-[#3d322a] px-5 py-6 shadow-[0_18px_50px_rgba(61,50,42,.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_56px_rgba(61,50,42,.2)] md:px-6">
              <span className="inline-flex rounded-full bg-[#e4efe8] px-3 py-1 text-[11px] font-semibold text-[#3d322a]">
                {savingsLabel}
              </span>
              <p className="mt-4 font-display text-5xl font-bold text-[#fff8f1] md:text-6xl">{monthlySave}</p>
              <p className="mt-2 text-sm text-[#efe4d6]">{cards[1]?.title}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {cards.map((card) => (
                <article
                  key={card.eyebrow}
                  className="group/card rounded-2xl border border-[#e4d0bc] bg-[#fff8f1] p-5 shadow-[0_12px_36px_rgba(61,50,42,.08)] transition duration-300 hover:-translate-y-1.5 hover:border-[#c96b52]/55 hover:bg-white hover:shadow-[0_20px_48px_rgba(201,107,82,.18)]"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c96b52] transition group-hover/card:text-[#d9924a]">
                    {card.eyebrow}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold text-[#3d322a] md:text-2xl">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#7a6b5c]">{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
