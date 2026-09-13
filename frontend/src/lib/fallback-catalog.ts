import type { Catalog } from "./types";

const L = (en: string, ar: string, fr: string, es: string) => ({ en, ar, fr, es });

export const FALLBACK_CATALOG: Catalog = {
  drop: "Drop 01 — 2026",
  currency: "USD",
  licenses_issued: 0,
  collections: [
    { slug: "creator-lab", sort: 1, image: "/images/collections/creator-lab.png", name: L("Creator Lab", "مختبر الصانع", "Creator Lab", "Creator Lab"), sub: L("Systems for people who publish.", "أنظمة للي ينشرون.", "Des systèmes pour ceux qui publient.", "Sistemas para quienes publican.") },
    { slug: "ai-command", sort: 2, image: "/images/collections/ai-command.png", name: L("AI Command", "قيادة الذكاء", "AI Command", "AI Command"), sub: L("Operate AI like staff.", "شغّل الذكاء كموظف.", "Faites travailler l’IA comme une équipe.", "Opera la IA como si fuera tu equipo.") },
    { slug: "wealth-os", sort: 3, image: "/images/collections/wealth.png", name: L("Wealth", "الثروة", "Riqueza", "Riqueza"), sub: L("Money and time as an operator.", "الفلوس والوقت بصيغة مشغّل.", "L’argent et le temps, en opérateur.", "Dinero y tiempo, como un operador.") },
    { slug: "glow-ritual", sort: 4, image: "/images/collections/glow.png", name: L("Glow Ritual", "طقوس التوهج", "Rituel Glow", "Ritual Glow"), sub: L("Private luxury rituals.", "طقوس خاصة، شكلها غالي.", "Des rituels privés, luxe calme.", "Rituales privados, lujo silencioso.") },
    { slug: "the-vault", sort: 5, image: "/images/collections/vault.png", name: L("The Vault", "الخزنة", "La Chambre forte", "La Bóveda"), sub: L("The whole house. One key.", "الدار كاملة. مفتاح واحد.", "Toute la maison. Une clé.", "Toda la casa. Una llave.") },
  ],
  reviews: [],
  products: [],
};
