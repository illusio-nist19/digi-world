from __future__ import annotations

T = dict[str, str]


def t(en: str, ar: str, fr: str, es: str) -> T:
    return {"en": en, "ar": ar, "fr": fr, "es": es}


COLLECTIONS = [
    {
        "slug": "creator-lab",
        "sort": 1,
        "image": "/images/collections/creator-lab.png",
        "name": t("Creator Lab", "مختبر الصانع", "Creator Lab", "Creator Lab"),
        "sub": t(
            "Systems for people who publish.",
            "أنظمة للي ينشرون.",
            "Des systèmes pour ceux qui publient.",
            "Sistemas para quienes publican.",
        ),
    },
    {
        "slug": "ai-command",
        "sort": 2,
        "image": "/images/collections/ai-command.png",
        "name": t("AI Command", "قيادة الذكاء", "AI Command", "AI Command"),
        "sub": t(
            "Operate AI like staff.",
            "شغّل الذكاء كموظف.",
            "Faites travailler l’IA comme une équipe.",
            "Opera la IA como si fuera tu equipo.",
        ),
    },
    {
        "slug": "wealth-os",
        "sort": 3,
        "image": "/images/collections/wealth.png",
        "name": t("Wealth", "الثروة", "Riqueza", "Riqueza"),
        "sub": t(
            "Money and time as an operator.",
            "الفلوس والوقت بصيغة مشغّل.",
            "L’argent et le temps, en opérateur.",
            "Dinero y tiempo, como un operador.",
        ),
    },
    {
        "slug": "glow-ritual",
        "sort": 4,
        "image": "/images/collections/glow.png",
        "name": t("Glow Ritual", "طقوس التوهج", "Rituel Glow", "Ritual Glow"),
        "sub": t(
            "Private luxury rituals.",
            "طقوس خاصة، شكلها غالي.",
            "Des rituels privés, luxe calme.",
            "Rituales privados, lujo silencioso.",
        ),
    },
    {
        "slug": "the-vault",
        "sort": 5,
        "image": "/images/collections/vault.png",
        "name": t("The Vault", "الخزنة", "La Chambre forte", "La Bóveda"),
        "sub": t(
            "The whole house. One key.",
            "الدار كاملة. مفتاح واحد.",
            "Toute la maison. Une clé.",
            "Toda la casa. Una llave.",
        ),
    },
]

PRODUCTS: list[dict] = []
REVIEWS: list[dict] = []
