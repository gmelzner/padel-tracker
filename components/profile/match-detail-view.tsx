"use client";

import { useTranslations } from "next-intl";
import type { Match } from "@/lib/database.types";
import type { MatchState, MagiaType } from "@/lib/types";
import {
  computePlayerStats,
  computeTeamStats,
  computeStreaks,
  computeBreakPoints,
  computePointDistribution,
  computeTeamPointDistribution,
  computeMomentum,
  computePlayerMagiaStats,
  computeTeamMagiaStats,
} from "@/lib/analytics";
import { MAGIA_TYPE_LABELS } from "@/lib/constants";
import { MomentumChart } from "@/components/results/momentum-chart";

interface MatchDetailViewProps {
  match: Match;
  onBack: () => void;
}

export function MatchDetailView({ match, onBack }: MatchDetailViewProps) {
  const t = useTranslations();
  const state = match.match_data as unknown as MatchState;

  const { score, players, history, magias, winningTeam } = state;

  const playerStats = computePlayerStats(history, players);
  const [team1Stats, team2Stats] = computeTeamStats(history, players);
  const [streak1, streak2] = computeStreaks(history);
  const [break1, break2] = computeBreakPoints(history, score);
  const distribution = computePointDistribution(history);
  const [teamDist1, teamDist2] = computeTeamPointDistribution(history);
  const momentum = computeMomentum(history);
  const playerMagiaStats = computePlayerMagiaStats(magias, players);
  const [teamMagia1, teamMagia2] = computeTeamMagiaStats(magias, players);
  const hasMagias = magias.length > 0;

  const magiaTypes: MagiaType[] = ["x3", "x4", "dejada", "dormilona"];
  const magiaShortLabels: Record<MagiaType, string> = {
    x3: "x3", x4: "x4", dejada: "Dej", dormilona: "Dor",
  };

  const team1Players = players.filter((p) => p.team === 1);
  const team2Players = players.filter((p) => p.team === 2);
  const team1Label = team1Players.map((p) => p.name).join(" / ");
  const team2Label = team2Players.map((p) => p.name).join(" / ");

  const date = new Date(match.played_at).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-dvh bg-slate-50 p-4 pb-8">
      <div className="max-w-lg mx-auto space-y-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-slate-500 pt-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t("profile.goBack")}
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">
            {t("results.title")}
          </h1>
          <p className="text-sm text-slate-400">{date}</p>
        </div>

        {/* Winner */}
        {winningTeam ? (
          <div
            className={`rounded-xl p-4 text-center font-bold text-lg ${
              winningTeam === 1
                ? "bg-team1-light text-team1"
                : "bg-team2-light text-team2"
            }`}
          >
            {t("results.winner")}{" "}
            {players
              .filter((p) => p.team === winningTeam)
              .map((p) => p.name)
              .join(" / ")}
          </div>
        ) : (
          <div className="rounded-xl p-4 text-center font-medium text-slate-500 bg-slate-100">
            {t("results.matchEndedEarly")}
          </div>
        )}

        {/* Score summary */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <h2 className="font-semibold text-slate-800">{t("results.summary")}</h2>
          <div className="grid grid-cols-3 text-center text-sm text-slate-500">
            <div className="font-medium text-team1 truncate">{team1Label}</div>
            <div></div>
            <div className="font-medium text-team2 truncate">{team2Label}</div>
          </div>
          {score.completedSets.map((set, i) => (
            <div key={i} className="grid grid-cols-3 text-center">
              <div className="text-xl font-bold">{set.games[0]}</div>
              <div className="text-slate-400 text-xs self-center">
                {t("results.set")} {i + 1}
                {set.tiebreakPlayed && set.tiebreakScore
                  ? ` (${set.tiebreakScore[0]}-${set.tiebreakScore[1]})`
                  : ""}
              </div>
              <div className="text-xl font-bold">{set.games[1]}</div>
            </div>
          ))}
        </div>

        {/* Momentum chart */}
        <MomentumChart
          data={momentum}
          team1Label={team1Label}
          team2Label={team2Label}
        />

        {/* Player stats */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <h2 className="font-semibold text-slate-800">{t("results.playerStats")}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs">
                  <th className="text-left py-2 pr-2">{t("results.player")}</th>
                  <th className="text-center py-2 px-1">W</th>
                  <th className="text-center py-2 px-1">ENF</th>
                  <th className="text-center py-2 px-1">EFG</th>
                  <th className="text-center py-2 px-1">{t("results.effectiveness")}</th>
                </tr>
              </thead>
              <tbody>
                {playerStats.map((ps) => (
                  <tr key={ps.playerId} className="border-t border-slate-100">
                    <td className="py-2 pr-2">
                      <span className={`font-medium ${ps.team === 1 ? "text-team1" : "text-team2"}`}>
                        {ps.playerName}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">
                        ({ps.position === "drive" ? "D" : "R"})
                      </span>
                    </td>
                    <td className="text-center text-winner font-semibold">{ps.winners}</td>
                    <td className="text-center text-unforced font-semibold">{ps.unforcedErrors}</td>
                    <td className="text-center text-forced font-semibold">{ps.forcedErrors}</td>
                    <td className="text-center font-bold">{ps.effectiveness}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-slate-400">{t("results.statsLegend")}</div>
        </div>

        {/* Team stats */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <h2 className="font-semibold text-slate-800">{t("results.teamStats")}</h2>
          <div className="grid grid-cols-2 gap-3">
            {[team1Stats, team2Stats].map((ts) => (
              <div
                key={ts.team}
                className={`rounded-lg p-3 ${ts.team === 1 ? "bg-team1-light" : "bg-team2-light"}`}
              >
                <div className={`font-bold text-sm mb-2 ${ts.team === 1 ? "text-team1" : "text-team2"}`}>
                  {t("results.team", { num: String(ts.team) })}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t("results.pointsWon")}</span>
                    <span className="font-bold">{ts.totalPointsWon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t("results.winners")}</span>
                    <span className="font-bold text-winner">{ts.totalWinners}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t("results.unforcedErrors")}</span>
                    <span className="font-bold text-unforced">{ts.totalUnforcedErrors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t("results.forcedErrorsGen")}</span>
                    <span className="font-bold text-forced">{ts.totalForcedErrors}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streaks & Breaks */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <h2 className="font-semibold text-slate-800">{t("results.streaksAndBreaks")}</h2>
          <div className="grid grid-cols-2 gap-3">
            {[streak1, streak2].map((s) => (
              <div
                key={s.team}
                className={`rounded-lg p-3 ${s.team === 1 ? "bg-team1-light" : "bg-team2-light"}`}
              >
                <div className={`font-bold text-sm mb-1 ${s.team === 1 ? "text-team1" : "text-team2"}`}>
                  {t("results.team", { num: String(s.team) })}
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t("results.bestStreak")}</span>
                    <span className="font-bold">{s.longestStreak} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t("results.breaksWon")}</span>
                    <span className="font-bold">
                      {s.team === 1 ? break1.breakPointsWon : break2.breakPointsWon}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400">{t("results.breakExplanation")}</p>
        </div>

        {/* Point Distribution */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <h2 className="font-semibold text-slate-800">{t("results.pointDistribution")}</h2>
          <div className="text-sm text-slate-600">
            {t("results.pointsPlayed", { count: String(distribution.totalPoints) })}
          </div>
          {distribution.totalPoints > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {[teamDist1, teamDist2].map((td) => (
                <div key={td.team} className="space-y-2">
                  <div className={`text-sm font-bold ${td.team === 1 ? "text-team1" : "text-team2"}`}>
                    {td.team === 1 ? team1Label : team2Label} — {td.totalPointsWon} pts
                  </div>
                  <div className="flex rounded-lg overflow-hidden h-8">
                    {td.winnerPct > 0 && (
                      <div
                        className="bg-winner flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ width: `${td.winnerPct}%` }}
                      >
                        {td.winnerPct}%
                      </div>
                    )}
                    {td.unforcedPct > 0 && (
                      <div
                        className="bg-unforced flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ width: `${td.unforcedPct}%` }}
                      >
                        {td.unforcedPct}%
                      </div>
                    )}
                    {td.forcedPct > 0 && (
                      <div
                        className="bg-forced flex items-center justify-center text-white text-[10px] font-bold"
                        style={{ width: `${td.forcedPct}%` }}
                      >
                        {td.forcedPct}%
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 space-y-0.5">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-winner inline-block" />
                      W: {td.byWinner}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-unforced inline-block" />
                      ENF: {td.byUnforcedError}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded bg-forced inline-block" />
                      EFG: {td.byForcedError}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-xs text-slate-400">{t("results.distLegend")}</div>
        </div>

        {/* Magias */}
        {hasMagias && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <h2 className="font-semibold text-slate-800">{t("results.highlights")}</h2>
            <div className="grid grid-cols-2 gap-3">
              {[teamMagia1, teamMagia2].map((tm) => (
                <div
                  key={tm.team}
                  className={`rounded-lg p-3 ${tm.team === 1 ? "bg-team1-light" : "bg-team2-light"}`}
                >
                  <div className={`font-bold text-sm mb-2 ${tm.team === 1 ? "text-team1" : "text-team2"}`}>
                    {t("results.team", { num: String(tm.team) })}: {tm.total}
                  </div>
                  <div className="space-y-0.5 text-sm">
                    {magiaTypes.filter((mt) => tm.byType[mt] > 0).map((mt) => (
                      <div key={mt} className="flex justify-between">
                        <span className="text-slate-600">{MAGIA_TYPE_LABELS[mt]}</span>
                        <span className="font-bold">{tm.byType[mt]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 text-xs">
                    <th className="text-left py-2 pr-2">{t("results.player")}</th>
                    {magiaTypes.map((mt) => (
                      <th key={mt} className="text-center py-2 px-1">{magiaShortLabels[mt]}</th>
                    ))}
                    <th className="text-center py-2 px-1">Tot</th>
                  </tr>
                </thead>
                <tbody>
                  {playerMagiaStats.filter((ps) => ps.total > 0).map((ps) => (
                    <tr key={ps.playerId} className="border-t border-slate-100">
                      <td className="py-2 pr-2">
                        <span className={`font-medium ${ps.team === 1 ? "text-team1" : "text-team2"}`}>
                          {ps.playerName}
                        </span>
                      </td>
                      {magiaTypes.map((mt) => (
                        <td key={mt} className="text-center text-purple-600 font-semibold">
                          {ps.byType[mt] || ""}
                        </td>
                      ))}
                      <td className="text-center font-bold">{ps.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Back button */}
        <button
          onClick={onBack}
          className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold text-lg active:scale-[0.98] transition-all"
        >
          {t("profile.goBack")}
        </button>
      </div>
    </div>
  );
}
