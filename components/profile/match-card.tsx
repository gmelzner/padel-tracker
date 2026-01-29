"use client";

import { useTranslations } from "next-intl";
import type { Match } from "@/lib/database.types";

interface MatchCardProps {
  match: Match;
  onDelete: (id: string) => void;
}

export function MatchCard({ match, onDelete }: MatchCardProps) {
  const t = useTranslations();

  const userWon =
    match.winning_team !== null && match.winning_team === match.user_team;
  const userLost =
    match.winning_team !== null && match.winning_team !== match.user_team;

  const scoreLine = match.sets_score
    .map((s) => {
      let text = `${s.games[0]}-${s.games[1]}`;
      if (s.tiebreakPlayed && s.tiebreakScore) {
        text += ` (${s.tiebreakScore[0]}-${s.tiebreakScore[1]})`;
      }
      return text;
    })
    .join("  ");

  const date = new Date(match.played_at).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });

  function handleDelete() {
    if (confirm(t("profile.confirmDelete"))) {
      onDelete(match.id);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{date}</span>
          {userWon && (
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
              {t("profile.won")}
            </span>
          )}
          {userLost && (
            <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
              {t("profile.lost")}
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400">
          {t("profile.pointsPlayed", { count: String(match.total_points) })}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-sm">
            <span
              className={`font-semibold ${match.user_team === 1 ? "text-team1" : "text-slate-700"}`}
            >
              {match.team1_players.join(" / ")}
            </span>
            <span className="text-slate-400 mx-2">vs</span>
            <span
              className={`font-semibold ${match.user_team === 2 ? "text-team2" : "text-slate-700"}`}
            >
              {match.team2_players.join(" / ")}
            </span>
          </div>
          <div className="text-sm font-bold text-slate-800 mt-0.5">
            {scoreLine}
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="text-xs text-slate-300 hover:text-red-500 transition-colors ml-2 shrink-0"
        >
          {t("profile.deleteMatch")}
        </button>
      </div>
    </div>
  );
}
