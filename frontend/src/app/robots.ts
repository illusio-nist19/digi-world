import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/ops/",
          "/en/ops/",
          "/ar/ops/",
          "/fr/ops/",
          "/es/ops/",
          "/vault/",
          "/en/vault/",
          "/ar/vault/",
          "/fr/vault/",
          "/es/vault/",
          "/thank-you",
          "/en/thank-you",
          "/ar/thank-you",
          "/fr/thank-you",
          "/es/thank-you",
        ],
      },
    ],
    host: base,
    sitemap: `${base}/sitemap.xml`,
  };
}
