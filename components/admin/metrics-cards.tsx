"use client";

interface MetricCard {
  label: string;
  value: number | string;
  subtitle?: string;
}

export function MetricsCards({ cards }: { cards: MetricCard[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl bg-white border border-slate-200 p-5"
        >
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{card.value}</p>
          {card.subtitle && (
            <p className="text-xs text-slate-400 mt-1">{card.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  );
}
