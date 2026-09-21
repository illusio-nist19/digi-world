"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Scene = { id: string; src: string };

export function ScrollBackdrop({ scenes }: { scenes: Scene[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const nodes = scenes
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length) return;

    const ratios = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }
        let bestId = scenes[0]?.id;
        let best = -1;
        for (const s of scenes) {
          const r = ratios.get(s.id) ?? 0;
          if (r > best) {
            best = r;
            bestId = s.id;
          }
        }
        const idx = scenes.findIndex((s) => s.id === bestId);
        if (idx >= 0) setActive(idx);
      },
      { threshold: [0, 0.15, 0.35, 0.55, 0.75] },
    );

    for (const n of nodes) io.observe(n);
    return () => io.disconnect();
  }, [scenes]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {scenes.map((scene, i) => (
        <div
          key={scene.src}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={scene.src}
            alt=""
            fill
            priority={i === 0}
            className="object-cover object-center scale-105"
            sizes="100vw"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/70 to-ink/90" />
    </div>
  );
}
