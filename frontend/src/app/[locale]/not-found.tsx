import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BrandCircle } from "@/components/Brand";

export default async function NotFound() {
  const t = await getTranslations("misc");
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-5 text-center">
      <BrandCircle size={56} />
      <p className="font-display text-3xl">{t("notFound")}</p>
      <Link href="/" className="rounded-full bg-gold px-6 py-3 text-ink">
        {t("home")}
      </Link>
    </div>
  );
}
