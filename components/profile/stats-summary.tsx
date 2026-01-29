"use client";

import { useTranslations } from "next-intl";
import type { Match } from "@/lib/database.types";

interface StatsSummaryProps {
  matches: Match[];
}

export function StatsSummary({ matches }: StatsSummaryProps) {
  const t = useTranslations();

  const played = matches.length;
  const won = matches.filter(
    (m) => m.winning_team !== null && m.winning_team === m.user_team
  ).length;
  const lost = matches.filter(
    (m) => m.winning_team !== null && m.winning_team !== m.user_team
  ).length;
  const winRate = played > 0 ? Math.round((won / played) * 100) : 0;

  const stats = [
    { label: t("profile.matchesPlayed"), value: String(played) },
    { label: t("profile.matchesWon"), value: String(won), color: "text-emerald-600" },
    { label: t("profile.matchesLost"), value: String(lost), color: "text-red-500" },
    { label: t("profile.winRate"), value: `${winRate}%` },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl bg-white border border-slate-200 p-3 text-center"
        >
          <div className={`text-2xl font-bold ${s.color ?? "text-slate-800"}`}>
            {s.value}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
