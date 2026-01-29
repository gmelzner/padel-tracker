"use client";

import { useTranslations } from "next-intl";
import type { MomentumPoint } from "@/lib/analytics";

interface MomentumChartProps {
  data: MomentumPoint[];
  team1Label: string;
  team2Label: string;
}

export function MomentumChart({ data, team1Label, team2Label }: MomentumChartProps) {
  const t = useTranslations();
  if (data.length < 2) return null;

  const width = 320;
  const height = 160;
  const padX = 8;
  const padY = 24;

  const maxIndex = data[data.length - 1].index;
  const diffs = data.map((d) => d.differential);
  const maxDiff = Math.max(Math.abs(Math.min(...diffs)), Math.abs(Math.max(...diffs)), 1);

  function x(index: number) {
    return padX + (index / maxIndex) * (width - 2 * padX);
  }

  function y(diff: number) {
    // Positive diff (team 1 leading) = above center, Negative = below
    const center = height / 2;
    return center - (diff / maxDiff) * (center - padY);
  }

  // Build SVG path
  const pathPoints = data.map((d) => `${x(d.index)},${y(d.differential)}`);
  const linePath = `M ${pathPoints.join(" L ")}`;

  // Area fill: from line to center
  const centerY = height / 2;
  const areaPath = `M ${x(0)},${centerY} L ${pathPoints.join(" L ")} L ${x(maxIndex)},${centerY} Z`;

  // Determine final state for color
  const finalDiff = data[data.length - 1].differential;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
      <h2 className="font-semibold text-slate-800">{t("momentum.title")}</h2>
      <div className="flex justify-between text-xs text-slate-400 px-1">
        <span className="text-team1 font-medium">{team1Label}</span>
        <span className="text-team2 font-medium">{team2Label}</span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="none"
      >
        {/* Center line (equilibrium) */}
        <line
          x1={padX}
          y1={centerY}
          x2={width - padX}
          y2={centerY}
          stroke="#e2e8f0"
          strokeWidth="1"
          strokeDasharray="4 2"
        />

        {/* Area fill */}
        <path
          d={areaPath}
          fill={finalDiff >= 0 ? "#dbeafe" : "#ffedd5"}
          opacity="0.5"
        />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={finalDiff >= 0 ? "#3b82f6" : "#f97316"}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* End dot */}
        <circle
          cx={x(maxIndex)}
          cy={y(finalDiff)}
          r="4"
          fill={finalDiff >= 0 ? "#3b82f6" : "#f97316"}
        />
      </svg>
      <p className="text-xs text-slate-400 text-center">
        {t("momentum.explanation")}
      </p>
    </div>
  );
}
