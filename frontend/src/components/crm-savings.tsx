import Image from "next/image";
import { Link } from "@/i18n/navigation";

type Competitor = { name: string; price: string; plan: string; save: string };

export function CrmSavingsSection({
  title,
  highlightName,
  highlightPrice,
  highlightNote,
  savingsLabel,
  cta,
  competitors,
  imageSrc,
}: {
  title: string;
  highlightName: string;
  highlightPrice: string;
  highlightNote: string;
  savingsLabel: string;
  cta: string;
  competitors: Competitor[];
  imageSrc: string;
}) {
  return (
    <section className="overflow-hidden">
      <div className="bg-[#1a4f9c] px-5 py-12 text-center md:py-16">
        <h2 className="mx-auto max-w-3xl font-display text-3xl font-semibold text-white md:text-5xl">{title}</h2>
      </div>
      <div className="relative bg-[#eef4fb] px-5 pb-16 pt-10 text-ink md:px-8">
        <div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="relative z-10 -mt-16 overflow-hidden rounded-2xl border border-black/5 bg-gradient-to-b from-[#f7efe4] to-[#efe2d0] shadow-[0_24px_60px_rgba(20,40,80,.18)]">
            <div className="p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1a4f9c]">{highlightName}</p>
              <p className="mt-4 font-display text-6xl font-bold tracking-tight text-ink md:text-7xl">{highlightPrice}</p>
              <p className="mt-3 max-w-[22ch] text-sm leading-relaxed text-ink/70">{highlightNote}</p>
              <Link
                href="/systems/client-tracker"
                className="mt-8 inline-flex h-12 items-center rounded-full bg-[#1a4f9c] px-6 font-medium text-white"
              >
                {cta}
              </Link>
            </div>
            <div className="relative aspect-[16/10] w-full">
              <Image src={imageSrc} alt="" fill className="object-cover object-center" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_18px_50px_rgba(20,40,80,.12)]">
            <div className="grid grid-cols-3 divide-x divide-black/5 border-b border-black/5">
              {competitors.map((c) => (
                <div key={c.name} className="px-3 py-5 text-center md:px-4 md:py-6">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink/45">{c.name}</p>
                  <p className="mt-2 font-display text-2xl font-bold text-ink md:text-4xl">{c.price}</p>
                  <p className="mt-1 text-[11px] leading-snug text-ink/55 md:text-xs">{c.plan}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#0f2540] px-4 py-5 md:px-6 md:py-6">
              <span className="inline-flex rounded-full bg-[#f5e6a8] px-3 py-1 text-[11px] font-semibold text-ink">
                {savingsLabel}
              </span>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                {competitors.map((c) => (
                  <div key={c.name + c.save}>
                    <p className="font-display text-3xl font-bold text-white md:text-5xl">{c.save}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
