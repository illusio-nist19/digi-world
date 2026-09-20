import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Apex `/` is a 307 to `/ar`. Pinterest's crawler often stops at the
  // redirect and never sees <head>. Serve the default locale as 200 instead.
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${routing.defaultLocale}`;
    return NextResponse.rewrite(url);
  }
  return handleI18n(request);
}

export const config = {
  matcher: ["/", "/(ar|en|fr|es)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
