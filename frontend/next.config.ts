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
      { source: "/vault/:path*", destination: "/en", permanent: false },
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
