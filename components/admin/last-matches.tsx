"use client";

import type { RecentMatch } from "@/lib/admin-queries";

interface Props {
  matches: RecentMatch[];
}

export function LastMatches({ matches }: Props) {
  if (matches.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-3">Last Matches</h3>
        <p className="text-sm text-slate-400">No shared matches yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="font-semibold text-slate-800 mb-4">Last Matches</h3>
      <div className="space-y-3">
        {matches.map((m) => {
          const team1 = m.player_names.slice(0, 2).join(" / ");
          const team2 = m.player_names.slice(2, 4).join(" / ");
          const date = new Date(m.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <a
              key={m.id}
              href={`/r/${m.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      className={`font-medium truncate ${m.winning_team === 1 ? "text-blue-600" : "text-slate-700"}`}
                    >
                      {team1}
                    </span>
                    <span className="text-slate-400 text-xs shrink-0">vs</span>
                    <span
                      className={`font-medium truncate ${m.winning_team === 2 ? "text-orange-600" : "text-slate-700"}`}
                    >
                      {team2}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{date}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-slate-800">
                    {m.score_line}
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
