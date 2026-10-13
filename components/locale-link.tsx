"use client";

import type { ComponentProps } from "react";
import { localizePath } from "@/lib/i18n";
import { useLocale } from "@/components/locale-provider";

/** An internal link that stays in the visitor's language (/es/... in Spanish). */
export function LocaleLink({
  href,
  ...props
}: Omit<ComponentProps<"a">, "href"> & { href: string }) {
  const { locale } = useLocale();
  return <a href={localizePath(locale, href)} {...props} />;
}
