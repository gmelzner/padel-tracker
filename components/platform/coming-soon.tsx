"use client";

import { useTranslations } from "next-intl";

interface Props {
  icon: "blog" | "tournaments";
  descKey: string;
}

export function ComingSoon({ icon, descKey }: Props) {
  const t = useTranslations("comingSoon");

  return (
    <section className="flex-1 flex items-center justify-center py-20 md:py-32 px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-100 mb-8">
          {icon === "blog" ? (
            <svg className="w-9 h-9 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          ) : (
            <svg className="w-9 h-9 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-5.54 0" />
            </svg>
          )}
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          {t("title")}
        </div>

        {/* Description */}
        <p className="text-slate-500 leading-relaxed mb-10">
          {t(descKey)}
        </p>

        {/* CTA */}
        <a
          href="/tracker"
          className="inline-block h-12 px-8 rounded-xl bg-slate-900 text-white font-bold text-sm leading-[3rem] hover:bg-slate-800 active:scale-[0.98] transition-all"
        >
          {t("backToTracker")}
        </a>
      </div>
    </section>
  );
}
