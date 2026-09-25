import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Broken product URL (the-vault is a collection, not a system)
      { source: "/:locale(ar|en|fr|es)/systems/the-vault", destination: "/:locale/collections/the-vault", permanent: true },
      { source: "/systems/the-vault", destination: "/ar/collections/the-vault", permanent: true },
      { source: "/vault/:path*", destination: "/ar", permanent: true },
      { source: "/:locale(ar|en|fr|es)/sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/:locale(ar|en|fr|es)/robots.txt", destination: "/robots.txt", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [{ key: "Content-Type", value: "application/xml; charset=utf-8" }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
