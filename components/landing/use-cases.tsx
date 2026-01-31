"use client";

import { useTranslations } from "next-intl";

export function UseCases() {
  const t = useTranslations("landing");

  return (
    <section className="bg-slate-900 text-white py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4">
        {/* Manifesto */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <blockquote className="text-2xl md:text-3xl font-black italic leading-tight">
            &ldquo;{t("manifestoQuote")}&rdquo;
          </blockquote>
          <p className="mt-4 text-slate-400 leading-relaxed">
            {t("manifestoDesc")}
          </p>
        </div>

        {/* Use case cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coaches */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold">{t("useCase1Title")}</h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              {t("useCase1Desc")}
            </p>
          </div>

          {/* Friends */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold">{t("useCase2Title")}</h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              {t("useCase2Desc")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
