"use client";

import { useTranslations } from "next-intl";
import { LocaleLink } from "@/components/locale-link";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm">
            <LocaleLink href="/privacy" className="hover:text-slate-200 transition-colors">
              {t("privacy")}
            </LocaleLink>
            <LocaleLink href="/terms" className="hover:text-slate-200 transition-colors">
              {t("terms")}
            </LocaleLink>
          </div>
          <p className="text-xs text-slate-500">
            {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
