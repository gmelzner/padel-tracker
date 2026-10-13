import type { Metadata } from "next";
import { type Locale, defaultLocale, locales, localizePath } from "@/lib/i18n";

export const SITE_URL = "https://www.padeltracker.pro";

/** Absolute URL of an unprefixed path in a locale. */
export function absoluteUrl(locale: Locale, path: string): string {
  const localized = localizePath(locale, path);
  return localized === "/" ? SITE_URL : `${SITE_URL}${localized}`;
}

/**
 * Canonical plus hreflang for a page that exists at the same path in every
 * locale. Pages whose path differs per language (blog posts) build their own.
 */
export function localizedAlternates(
  locale: Locale,
  path: string
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: absoluteUrl(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, absoluteUrl(l, path)])),
      "x-default": absoluteUrl(defaultLocale, path),
    },
  };
}

export function openGraphLocale(locale: Locale): string {
  return locale === "es" ? "es_AR" : "en_US";
}
