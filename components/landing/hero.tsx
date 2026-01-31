"use client";

import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("landing");

  return (
    <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="max-w-5xl mx-auto px-4 py-20 md:py-28 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
          {t("heroTitle")}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
          {t("heroSubtitle")}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/tracker"
            className="inline-block h-14 px-8 rounded-2xl bg-white text-slate-900 font-bold text-lg leading-[3.5rem] active:scale-[0.98] transition-all"
          >
            {t("heroCta")}
          </a>
        </div>

        {/* Score preview */}
        <div className="mt-12 max-w-sm mx-auto">
          <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-6">
            <div className="flex items-center justify-between text-sm text-slate-400 mb-3">
              <span>SETS</span>
              <span>GAMES</span>
              <span>POINTS</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">1</div>
                <div className="text-xs text-slate-400 mt-1">Team 1</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">5</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">40</div>
              </div>
            </div>
            <div className="h-px bg-white/10 my-3" />
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">0</div>
                <div className="text-xs text-slate-400 mt-1">Team 2</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">4</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">30</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
