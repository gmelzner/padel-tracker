import { headers } from "next/headers";
import { type Locale, LOCALE_HEADER, defaultLocale, isLocale } from "@/lib/i18n";

/** Locale of the URL being rendered, as resolved by the proxy. */
export async function getServerLocale(): Promise<Locale> {
  const value = (await headers()).get(LOCALE_HEADER);
  return isLocale(value) ? value : defaultLocale;
}
