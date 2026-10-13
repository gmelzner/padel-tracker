import { cookies } from "next/headers";
import { type Locale, defaultLocale, isLocale } from "@/lib/i18n";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get("padel-locale")?.value;
  return isLocale(value) ? value : defaultLocale;
}
