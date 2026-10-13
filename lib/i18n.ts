export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: unknown): value is Locale {
  return locales.includes(value as Locale);
}

export async function getMessages(locale: Locale) {
  return (await import(`../messages/${locale}.json`)).default;
}

/** Cookie that remembers the language the visitor chose. */
export const LOCALE_COOKIE = "padel-locale";
/** Request header the proxy sets with the locale of the URL being served. */
export const LOCALE_HEADER = "x-padel-locale";

/** Splits "/es/blog/x" into its locale and the unprefixed path ("/blog/x"). */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (pathname === `/${locale}`) return { locale, path: "/" };
    if (pathname.startsWith(`/${locale}/`)) {
      return { locale, path: pathname.slice(locale.length + 1) };
    }
  }
  return { locale: defaultLocale, path: pathname };
}

/** URL of an unprefixed path in a locale: ("es", "/blog") -> "/es/blog". */
export function localizePath(locale: Locale, path: string): string {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
