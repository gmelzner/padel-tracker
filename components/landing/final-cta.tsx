"use client";

import { useTranslations } from "next-intl";

export function FinalCta() {
  const t = useTranslations("landing");

  return (
    <section className="bg-slate-900 text-white py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-black">
          {t("finalCtaTitle")}
        </h2>
        <div className="mt-6">
          <a
            href="/tracker"
            className="inline-block h-14 px-10 rounded-2xl bg-white text-slate-900 font-bold text-lg leading-[3.5rem] active:scale-[0.98] transition-all"
          >
            {t("finalCtaButton")}
          </a>
        </div>
      </div>
    </section>
  );
}
