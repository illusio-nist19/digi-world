import Image from "next/image";
import { Link } from "@/i18n/navigation";

type BenefitCard = { eyebrow: string; title: string; body: string };

const CARD_TONES = [
  {
    shell: "bg-[#fff1e8] border-[#f0c4a8] hover:border-[#e8a87a] hover:shadow-[0_20px_48px_rgba(232,168,122,.28)]",
    eyebrow: "text-[#c96b52]",
    title: "text-[#5c3a2e]",
    body: "text-[#8a6554]",
  },
  {
    shell: "bg-[#e8f6ef] border-[#b8dfcb] hover:border-[#7cbc9a] hover:shadow-[0_20px_48px_rgba(92,143,114,.28)]",
    eyebrow: "text-[#3f7a5c]",
    title: "text-[#2f4f3d]",
    body: "text-[#5a7a68]",
  },
  {
    shell: "bg-[#fff6dd] border-[#efd89a] hover:border-[#e0c05a] hover:shadow-[0_20px_48px_rgba(217,146,74,.28)]",
    eyebrow: "text-[#b07a28]",
    title: "text-[#5c4520]",
    body: "text-[#8a7040]",
  },
] as const;

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
  discountImageSrc,
  priceTagImageSrc,
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
  discountImageSrc: string;
  priceTagImageSrc: string;
}) {
  return (
    <section className="overflow-hidden">
      <div className="bg-gradient-to-br from-[#5c3a2e] via-[#c96b52] to-[#d9924a] px-5 py-12 text-center md:py-16">
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
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="group/tag relative overflow-hidden rounded-2xl border border-[#efd89a] bg-[#fff6dd] shadow-[0_14px_40px_rgba(217,146,74,.18)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_52px_rgba(217,146,74,.28)]">
                <div className="relative aspect-square w-full">
                  <Image
                    src={discountImageSrc}
                    alt={savingsLabel}
                    fill
                    className="object-cover transition duration-500 group-hover/tag:scale-[1.04]"
                    sizes="(min-width: 1024px) 22vw, 45vw"
                  />
                </div>
                <div className="border-t border-[#efd89a]/80 px-4 py-3 text-center">
                  <p className="font-display text-3xl font-bold text-[#b07a28]">{monthlySave}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a7040]">
                    {savingsLabel}
                  </p>
                </div>
              </div>

              <div className="group/tag relative overflow-hidden rounded-2xl border border-[#f0c4a8] bg-[#fff1e8] shadow-[0_14px_40px_rgba(201,107,82,.16)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_52px_rgba(201,107,82,.26)]">
                <div className="relative aspect-square w-full">
                  <Image
                    src={priceTagImageSrc}
                    alt={highlightPrice}
                    fill
                    className="object-cover transition duration-500 group-hover/tag:scale-[1.04]"
                    sizes="(min-width: 1024px) 22vw, 45vw"
                  />
                </div>
                <div className="border-t border-[#f0c4a8]/80 px-4 py-3 text-center">
                  <p className="font-display text-2xl font-bold text-[#c96b52] md:text-3xl">{highlightPrice}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#8a6554]">
                    {cards[0]?.title}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {cards.map((card, i) => {
                const tone = CARD_TONES[i % CARD_TONES.length];
                return (
                  <article
                    key={card.eyebrow}
                    className={`group/card rounded-2xl border p-5 shadow-[0_12px_36px_rgba(61,50,42,.08)] transition duration-300 hover:-translate-y-1.5 ${tone.shell}`}
                  >
                    <p className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${tone.eyebrow}`}>
                      {card.eyebrow}
                    </p>
                    <h3 className={`mt-3 font-display text-xl font-semibold md:text-2xl ${tone.title}`}>
                      {card.title}
                    </h3>
                    <p className={`mt-2 text-sm leading-relaxed ${tone.body}`}>{card.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
