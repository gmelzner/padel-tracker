"use client";

import { useTranslations } from "next-intl";

export function TrackerCta() {
  const t = useTranslations("landing");

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800">
          {t("trackerCtaTitle")}
        </h2>
        <p className="mt-3 text-slate-500 max-w-xl mx-auto">
          <span className="inline-block bg-emerald-100 text-emerald-700 font-bold text-sm px-2.5 py-0.5 rounded-full mr-1.5 align-middle">
            {t("trackerCtaFree")}
          </span>
          {t("trackerCtaDesc")}
        </p>
        <div className="mt-8">
          <a
            href="/tracker"
            className="inline-block h-14 px-10 rounded-2xl bg-slate-900 text-white font-bold text-lg leading-[3.5rem] active:scale-[0.98] transition-all"
          >
            {t("trackerCtaButton")}
          </a>
        </div>
      </div>
    </section>
  );
}
