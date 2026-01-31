"use client";

interface GrowthPeriod {
  label: string;
  current: number;
  previous: number;
}

export function GrowthSummary({ periods }: { periods: GrowthPeriod[] }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Growth</h3>
      <div className="space-y-3">
        {periods.map((period) => {
          const diff = period.current - period.previous;
          const pct =
            period.previous > 0
              ? Math.round((diff / period.previous) * 100)
              : period.current > 0
                ? 100
                : 0;
          const isPositive = diff >= 0;

          return (
            <div
              key={period.label}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-slate-600">{period.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-800">
                  {period.current}
                </span>
                <span
                  className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                    isPositive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-500"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {pct}%
                </span>
                <span className="text-xs text-slate-400">
                  vs {period.previous} prev
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
