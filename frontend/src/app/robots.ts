import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://digi-world.online";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/ops/", "/en/ops/", "/ar/ops/", "/fr/ops/", "/es/ops/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
