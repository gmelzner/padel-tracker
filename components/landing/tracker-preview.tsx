"use client";

import { useTranslations } from "next-intl";

export function TrackerPreview() {
  const t = useTranslations("landing");

  return (
    <section className="bg-slate-50 py-16 md:py-20 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800">
            {t("previewTitle")}
          </h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto">
            {t("previewDesc")}
          </p>
        </div>

        {/* Phone mockup */}
        <div className="max-w-xs mx-auto">
          <div className="rounded-[2rem] bg-slate-900 p-3 shadow-2xl shadow-slate-900/40">
            <div className="rounded-[1.4rem] bg-slate-50 overflow-hidden">
              {/* Status bar */}
              <div className="bg-slate-100 px-4 py-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500">Padel Tracker</span>
                <span className="text-[10px] text-slate-400">Set 2</span>
              </div>

              {/* Scoreboard */}
              <div className="px-4 pt-3 pb-4 bg-white">
                {/* Team 1 */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-sm font-bold text-slate-800">Martin / Lucas</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="w-5 text-center text-slate-400 font-medium">1</span>
                    <span className="w-5 text-center font-bold text-blue-600">5</span>
                    <span className="w-7 text-center font-black text-blue-600 text-lg">40</span>
                  </div>
                </div>
                <div className="h-px bg-slate-100" />
                {/* Team 2 */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-sm font-bold text-slate-800">Fede / Nico</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="w-5 text-center text-slate-400 font-medium">0</span>
                    <span className="w-5 text-center font-bold text-orange-600">4</span>
                    <span className="w-7 text-center font-black text-orange-600 text-lg">30</span>
                  </div>
                </div>
                {/* Column labels */}
                <div className="flex justify-end gap-3 mt-1">
                  <span className="w-5 text-center text-[9px] text-slate-400">SETS</span>
                  <span className="w-5 text-center text-[9px] text-slate-400">GAMES</span>
                  <span className="w-7 text-center text-[9px] text-slate-400">PTS</span>
                </div>
              </div>

              {/* Point buttons mockup */}
              <div className="px-4 py-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-11 rounded-xl bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">Martin / Lucas</span>
                  </div>
                  <div className="h-11 rounded-xl bg-orange-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">Fede / Nico</span>
                  </div>
                </div>
                {/* Action bar */}
                <div className="flex items-center justify-between pt-1 pb-2">
                  <div className="flex gap-2">
                    <div className="h-8 px-3 rounded-lg bg-slate-100 flex items-center">
                      <span className="text-[10px] text-slate-500 font-medium">Winner</span>
                    </div>
                    <div className="h-8 px-3 rounded-lg bg-slate-100 flex items-center">
                      <span className="text-[10px] text-slate-500 font-medium">Error</span>
                    </div>
                    <div className="h-8 px-3 rounded-lg bg-slate-100 flex items-center">
                      <span className="text-[10px] text-slate-500 font-medium">Magia</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
