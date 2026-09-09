export function BrandCircle({ size = 36 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-gold font-display font-bold leading-none text-ink"
      style={{ width: size, height: size, fontSize: size * 0.32 }}
      aria-hidden
    >
      DW
    </span>
  );
}

export function Logo({ locale }: { locale: string }) {
  return (
    <span className="flex shrink-0 items-center gap-3">
      <BrandCircle />
      <span className="font-wordmark text-xl font-bold tracking-tight text-ivory">Digi World</span>
      <span className="sr-only">{locale}</span>
    </span>
  );
}
