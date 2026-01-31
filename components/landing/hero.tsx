"use client";

import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("landing");

  return (
    <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <style>{`
        @keyframes cta-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.3); }
          50% { box-shadow: 0 0 24px 6px rgba(255,255,255,0.12); }
        }
      `}</style>
      <div className="max-w-5xl mx-auto px-4 py-20 md:py-28 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
          {t("heroTitle")}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
          {t("heroSubtitle")}
        </p>
        <div className="mt-10">
          <a
            href="/tracker"
            className="inline-block h-14 px-10 rounded-2xl bg-white text-slate-900 font-bold text-lg leading-[3.5rem] hover:bg-slate-100 active:scale-[0.98] transition-all"
            style={{ animation: "cta-glow 2.5s ease-in-out infinite" }}
          >
            {t("heroCta")}
          </a>
        </div>
      </div>
    </section>
  );
}
