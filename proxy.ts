import { NextResponse, type NextRequest } from "next/server";
import {
  LOCALE_COOKIE,
  LOCALE_HEADER,
  defaultLocale,
  isLocale,
  localizePath,
  splitLocale,
  type Locale,
} from "@/lib/i18n";

/**
 * The URL decides the language: English lives at the root, Spanish under /es.
 * /es/... is rewritten to the same route with the locale in a request header,
 * so pages are written once and search engines get one URL per language.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const { locale: urlLocale, path } = splitLocale(pathname);

  if (urlLocale !== defaultLocale) {
    return withLocale(request, urlLocale, path);
  }

  // No prefix. Send people who prefer another language to their version.
  // Crawlers carry neither the cookie nor Accept-Language, so they stay here.
  const preferred = getPreferredLocale(request);
  if (preferred !== defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = localizePath(preferred, pathname);
    url.search = search;
    return NextResponse.redirect(url);
  }

  return withLocale(request, defaultLocale, pathname);
}

function withLocale(request: NextRequest, locale: Locale, path: string) {
  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, locale);

  const url = request.nextUrl.clone();
  url.pathname = path;
  return NextResponse.rewrite(url, { request: { headers } });
}

function getPreferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) return cookie;

  const first = request.headers.get("accept-language")?.split(",")[0]?.trim().slice(0, 2);
  return isLocale(first) ? first : defaultLocale;
}

export const config = {
  // Pages only: no API, Next internals, admin, metadata routes or files
  matcher: [
    "/((?!api|_next|admin|opengraph-image|sitemap.xml|robots.txt|manifest.webmanifest|.*\\.[a-z0-9]+$).*)",
  ],
};
