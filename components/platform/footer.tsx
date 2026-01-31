"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm">
            <a href="/privacy" className="hover:text-slate-200 transition-colors">
              {t("privacy")}
            </a>
            <a href="/terms" className="hover:text-slate-200 transition-colors">
              {t("terms")}
            </a>
          </div>
          <p className="text-xs text-slate-500">
            {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
