"use client";

import Image from "next/image";
import { useState } from "react";

export type DemoShot = {
  src: string;
  hoverSrc?: string;
  caption: string;
  label: string;
};

export function ProductGallery({ shots, alt }: { shots: DemoShot[]; alt: string }) {
  const [active, setActive] = useState(0);
  const hero = shots[active] || shots[0];
  if (!hero) return null;

  return (
    <div className="grid gap-3">
      <DemoFrame shot={hero} alt={alt} priority large />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
        {shots.map((shot, i) => (
          <button
            key={shot.src + i}
            type="button"
            onClick={() => setActive(i)}
            className={`group relative aspect-[4/3] overflow-hidden rounded-xl border text-left transition ${
              i === active ? "border-gold ring-1 ring-gold/50" : "border-ivory/15 hover:border-ivory/40"
            }`}
            aria-label={shot.label}
          >
            <Image src={shot.src} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="15vw" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-2 pb-1.5 pt-6 text-[10px] font-medium text-ivory">
              {shot.label}
            </span>
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-ivory/55">Hover a shot — watch the desk move.</p>
    </div>
  );
}

function DemoFrame({
  shot,
  alt,
  priority,
  large,
}: {
  shot: DemoShot;
  alt: string;
  priority?: boolean;
  large?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-ivory/10 bg-ink-2 ${
        large ? "aspect-[4/5] sm:aspect-[5/4]" : "aspect-square"
      }`}
    >
      <Image
        src={shot.src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover object-top transition duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-0"
        sizes="(min-width: 768px) 50vw, 100vw"
      />
      {shot.hoverSrc ? (
        <Image
          src={shot.hoverSrc}
          alt=""
          fill
          className="object-cover object-top opacity-0 transition duration-700 ease-out group-hover:scale-[1.06] group-hover:opacity-100"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      ) : null}

      {/* fake cursor + typing pulse — sells “someone is using it” */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
        <div className="dw-demo-cursor absolute left-[18%] top-[42%] h-5 w-5 rounded-full border-2 border-white bg-gold/80 shadow-[0_0_0_6px_rgba(212,175,55,.25)]" />
        <div className="absolute bottom-[18%] left-[12%] right-[12%] overflow-hidden rounded-xl border border-white/20 bg-black/55 px-3 py-2 backdrop-blur-md">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gold">{shot.label}</p>
          <p className="mt-0.5 text-sm text-ivory">
            {shot.caption}
            <span className="dw-demo-caret ms-0.5 inline-block h-3.5 w-0.5 translate-y-0.5 bg-gold align-middle" />
          </p>
        </div>
        <div className="dw-demo-scan absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-gold/10 to-transparent" />
      </div>
    </div>
  );
}

export const CLIENT_TRACKER_SHOTS: DemoShot[] = [
  {
    src: "/images/products/client-tracker/01.png",
    hoverSrc: "/images/products/client-tracker/01-live.png",
    label: "Budget desk",
    caption: "Enter a line — income, expenses, and leftover move live.",
  },
  {
    src: "/images/products/client-tracker/02.png",
    hoverSrc: "/images/products/client-tracker/02-live.png",
    label: "Client Overview",
    caption: "Pick a client — then log the call on the same desk.",
  },
  {
    src: "/images/products/client-tracker/03.png",
    hoverSrc: "/images/products/client-tracker/03-live.png",
    label: "Invoices",
    caption: "Add an invoice — status cards and charts wake up.",
  },
  {
    src: "/images/products/client-tracker/04.png",
    hoverSrc: "/images/products/client-tracker/04-live.png",
    label: "The Vault",
    caption: "Drop a file — open, edit, or delete it on this device.",
  },
  {
    src: "/images/products/client-tracker/05.png",
    hoverSrc: "/images/products/client-tracker/05-live.png",
    label: "Task Tracker",
    caption: "Add a task — this week’s list fills in.",
  },
  {
    src: "/images/products/client-tracker/06.png",
    hoverSrc: "/images/products/client-tracker/06-live.png",
    label: "Smart Calendar",
    caption: "Switch the month — events and follow-ups land on the grid.",
  },
];
