"use client";

import { useTranslations } from "next-intl";
import type { Match } from "@/lib/database.types";

interface MatchCardProps {
  match: Match;
  onDelete: (id: string) => void;
  onSelect: (match: Match) => void;
}

export function MatchCard({ match, onDelete, onSelect }: MatchCardProps) {
  const t = useTranslations();

  const isCoach = match.user_team === null;
  const userWon =
    !isCoach && match.winning_team !== null && match.winning_team === match.user_team;
  const userLost =
    !isCoach && match.winning_team !== null && match.winning_team !== match.user_team;

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
    <div
      onClick={() => onSelect(match)}
      className="rounded-xl border border-slate-200 bg-white p-3 space-y-2 active:scale-[0.98] transition-all cursor-pointer"
    >
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
          {isCoach && (
            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
              {t("profile.coach")}
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="text-xs text-slate-300 hover:text-red-500 transition-colors shrink-0"
        >
          {t("profile.deleteMatch")}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-sm">
            <span
              className={`font-semibold ${!isCoach && match.user_team === 1 ? "text-team1" : "text-slate-700"}`}
            >
              {match.team1_players.join(" / ")}
            </span>
            <span className="text-slate-400 mx-2">vs</span>
            <span
              className={`font-semibold ${!isCoach && match.user_team === 2 ? "text-team2" : "text-slate-700"}`}
            >
              {match.team2_players.join(" / ")}
            </span>
          </div>
          <div className="text-sm font-bold text-slate-800 mt-0.5">
            {scoreLine}
          </div>
        </div>
        <svg className="w-5 h-5 text-slate-300 shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
