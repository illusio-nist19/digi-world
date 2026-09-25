import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

function requestHost(request: NextRequest): string {
  const raw =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";
  return raw.split(",")[0].trim().split(":")[0].toLowerCase();
}

function isLocalePrefixed(pathname: string): boolean {
  return /^\/(ar|en|fr|es)(\/|$)/.test(pathname);
}

export default function middleware(request: NextRequest) {
  const host = requestHost(request);

  // Force apex host — fixes www/non-www duplicates in Google
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.hostname = host.replace(/^www\./i, "");
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  const { pathname } = request.nextUrl;

  // One URL for home (rewrite caused "Duplicate without user-selected canonical")
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${routing.defaultLocale}`;
    return NextResponse.redirect(url, 301);
  }

  // Unprefixed marketing/content URLs → default locale (301, not 307)
  if (!isLocalePrefixed(pathname) && !pathname.startsWith("/_next") && !pathname.includes(".")) {
    const shouldPrefix =
      pathname.startsWith("/systems/") ||
      pathname.startsWith("/collections") ||
      pathname.startsWith("/legal/") ||
      pathname === "/digital-tracker" ||
      pathname === "/business-crm-tracker" ||
      pathname === "/about" ||
      pathname === "/contact" ||
      pathname === "/faq" ||
      pathname === "/thank-you";
    if (shouldPrefix) {
      const url = request.nextUrl.clone();
      url.pathname = `/${routing.defaultLocale}${pathname}`;
      return NextResponse.redirect(url, 301);
    }
  }

  return handleI18n(request);
}

export const config = {
  matcher: ["/", "/(ar|en|fr|es)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
