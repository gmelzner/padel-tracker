import { cookies } from "next/headers";
import { type Locale, defaultLocale } from "@/lib/i18n";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get("padel-locale")?.value;
  if (value === "en" || value === "es") return value;
  return defaultLocale;
}
