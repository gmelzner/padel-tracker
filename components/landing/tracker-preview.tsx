"use client";

import { useTranslations } from "next-intl";

const players = [
  { name: "Martín", w: 5, ue: 2, feg: 3, eff: 80 },
  { name: "Lucas", w: 3, ue: 1, feg: 2, eff: 83 },
  { name: "Fede", w: 2, ue: 4, feg: 1, eff: 43 },
  { name: "Nico", w: 4, ue: 3, feg: 0, eff: 57 },
];

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

        {/* Results card mockup */}
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden">
            {/* Score header */}
            <div className="bg-slate-900 text-white px-5 py-4">
              <div className="text-xs text-slate-400 font-medium mb-2">
                Resultado
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-blue-400">
                    Martín / Lucas
                  </div>
                  <div className="text-sm text-slate-400 mt-0.5">
                    Fede / Nico
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black tracking-wide">
                    6-4 / 7-5
                  </div>
                </div>
              </div>
            </div>

            {/* Player stats table */}
            <div className="px-5 py-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Stats por jugador
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-400">
                    <th className="text-left font-medium pb-2">Jugador</th>
                    <th className="text-center font-medium pb-2 w-10">W</th>
                    <th className="text-center font-medium pb-2 w-10">ENF</th>
                    <th className="text-center font-medium pb-2 w-10">EFG</th>
                    <th className="text-right font-medium pb-2 w-14">Efect.</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((p, i) => (
                    <tr
                      key={i}
                      className="border-t border-slate-100"
                    >
                      <td className="py-2 font-medium text-slate-800">
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${i < 2 ? "bg-blue-500" : "bg-orange-500"}`}
                          />
                          {p.name}
                        </span>
                      </td>
                      <td className="py-2 text-center text-slate-600">{p.w}</td>
                      <td className="py-2 text-center text-slate-600">{p.ue}</td>
                      <td className="py-2 text-center text-slate-600">{p.feg}</td>
                      <td className="py-2 text-right font-bold">
                        <span
                          className={
                            p.eff >= 70
                              ? "text-emerald-600"
                              : p.eff >= 50
                                ? "text-amber-600"
                                : "text-red-500"
                          }
                        >
                          {p.eff}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Momentum mini chart */}
            <div className="px-5 pb-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Momentum
              </div>
              <div className="h-10 flex items-end gap-[2px]">
                {[3, 5, 2, -1, -3, 4, 6, 3, -2, 1, 4, 7, 5, 2, -1, 3, 5, 8, 4, 1].map(
                  (v, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: `${Math.abs(v) * 10 + 10}%`,
                        backgroundColor:
                          v >= 0
                            ? `rgba(59, 130, 246, ${0.3 + Math.abs(v) * 0.08})`
                            : `rgba(249, 115, 22, ${0.3 + Math.abs(v) * 0.08})`,
                        alignSelf: v >= 0 ? "flex-end" : "flex-start",
                      }}
                    />
                  )
                )}
              </div>
            </div>

            {/* Share button */}
            <div className="px-5 pb-5">
              <div className="h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  Compartir
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
