"use client";

import { useState } from "react";
import { useMatch } from "@/lib/match-context";
import {
  computePlayerStats,
  computeTeamStats,
  computeStreaks,
  computeBreakPoints,
  computePointDistribution,
  computeMomentum,
} from "@/lib/analytics";
import { MomentumChart } from "./momentum-chart";
import {
  generateMatchSummary,
  shareViaWhatsApp,
  shareNative,
  copyToClipboard,
} from "@/lib/share";

export function ResultsScreen() {
  const { state, dispatch } = useMatch();
  const { score, players, history, winningTeam } = state;
  const [copied, setCopied] = useState(false);

  const playerStats = computePlayerStats(history, players);
  const [team1Stats, team2Stats] = computeTeamStats(history, players);
  const [streak1, streak2] = computeStreaks(history);
  const [break1, break2] = computeBreakPoints(history, score);
  const distribution = computePointDistribution(history);
  const momentum = computeMomentum(history);

  const team1Players = players.filter((p) => p.team === 1);
  const team2Players = players.filter((p) => p.team === 2);
  const team1Label = team1Players.map((p) => p.name).join(" / ");
  const team2Label = team2Players.map((p) => p.name).join(" / ");

  return (
    <div className="min-h-dvh bg-slate-50 p-4 pb-8">
      <div className="max-w-lg mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-slate-800 text-center pt-4">
          Resultado
        </h1>

        {/* Winner */}
        {winningTeam ? (
          <div
            className={`rounded-xl p-4 text-center font-bold text-lg ${
              winningTeam === 1
                ? "bg-team1-light text-team1"
                : "bg-team2-light text-team2"
            }`}
          >
            Ganador:{" "}
            {players
              .filter((p) => p.team === winningTeam)
              .map((p) => p.name)
              .join(" / ")}
          </div>
        ) : (
          <div className="rounded-xl p-4 text-center font-medium text-slate-500 bg-slate-100">
            Partido terminado anticipadamente
          </div>
        )}

        {/* Score summary */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <h2 className="font-semibold text-slate-800">Resumen</h2>
          <div className="grid grid-cols-3 text-center text-sm text-slate-500">
            <div className="font-medium text-team1 truncate">{team1Label}</div>
            <div></div>
            <div className="font-medium text-team2 truncate">{team2Label}</div>
          </div>
          {score.completedSets.map((set, i) => (
            <div key={i} className="grid grid-cols-3 text-center">
              <div className="text-xl font-bold">{set.games[0]}</div>
              <div className="text-slate-400 text-xs self-center">
                Set {i + 1}
                {set.tiebreakPlayed && set.tiebreakScore
                  ? ` (${set.tiebreakScore[0]}-${set.tiebreakScore[1]})`
                  : ""}
              </div>
              <div className="text-xl font-bold">{set.games[1]}</div>
            </div>
          ))}
          {!winningTeam && (score.games[0] > 0 || score.games[1] > 0) && (
            <div className="grid grid-cols-3 text-center">
              <div className="text-xl font-bold text-slate-400">
                {score.games[0]}
              </div>
              <div className="text-slate-400 text-xs self-center">
                Set {score.currentSetIndex + 1} (en curso)
              </div>
              <div className="text-xl font-bold text-slate-400">
                {score.games[1]}
              </div>
            </div>
          )}
        </div>

        {/* Momentum chart */}
        <MomentumChart
          data={momentum}
          team1Label={team1Label}
          team2Label={team2Label}
        />

        {/* Player stats with effectiveness */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <h2 className="font-semibold text-slate-800">
            Estadísticas por Jugador
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs">
                  <th className="text-left py-2 pr-2">Jugador</th>
                  <th className="text-center py-2 px-1">W</th>
                  <th className="text-center py-2 px-1">ENF</th>
                  <th className="text-center py-2 px-1">EF</th>
                  <th className="text-center py-2 px-1">Efect.</th>
                </tr>
              </thead>
              <tbody>
                {playerStats.map((ps) => (
                  <tr key={ps.playerId} className="border-t border-slate-100">
                    <td className="py-2 pr-2">
                      <span
                        className={`font-medium ${
                          ps.team === 1 ? "text-team1" : "text-team2"
                        }`}
                      >
                        {ps.playerName}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">
                        ({ps.position === "drive" ? "D" : "R"})
                      </span>
                    </td>
                    <td className="text-center text-winner font-semibold">
                      {ps.winners}
                    </td>
                    <td className="text-center text-unforced font-semibold">
                      {ps.unforcedErrors}
                    </td>
                    <td className="text-center text-forced font-semibold">
                      {ps.forcedErrors}
                    </td>
                    <td className="text-center font-bold">{ps.effectiveness}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-slate-400">
            W = Winners · ENF = Errores No Forzados · EF = Errores Forzados ·
            Efect. = W / (W + ENF)
          </div>
        </div>

        {/* Team stats */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <h2 className="font-semibold text-slate-800">
            Estadísticas por Equipo
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[team1Stats, team2Stats].map((ts) => (
              <div
                key={ts.team}
                className={`rounded-lg p-3 ${
                  ts.team === 1 ? "bg-team1-light" : "bg-team2-light"
                }`}
              >
                <div
                  className={`font-bold text-sm mb-2 ${
                    ts.team === 1 ? "text-team1" : "text-team2"
                  }`}
                >
                  Equipo {ts.team}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Puntos ganados</span>
                    <span className="font-bold">{ts.totalPointsWon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Winners</span>
                    <span className="font-bold text-winner">
                      {ts.totalWinners}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Err. No Forzados</span>
                    <span className="font-bold text-unforced">
                      {ts.totalUnforcedErrors}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Err. Forzados</span>
                    <span className="font-bold text-forced">
                      {ts.totalForcedErrors}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rachas + Break Points */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <h2 className="font-semibold text-slate-800">Rachas y Breaks</h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Streaks */}
            {[streak1, streak2].map((s) => (
              <div
                key={s.team}
                className={`rounded-lg p-3 ${
                  s.team === 1 ? "bg-team1-light" : "bg-team2-light"
                }`}
              >
                <div
                  className={`font-bold text-sm mb-1 ${
                    s.team === 1 ? "text-team1" : "text-team2"
                  }`}
                >
                  Equipo {s.team}
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Mejor racha</span>
                    <span className="font-bold">{s.longestStreak} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Breaks ganados</span>
                    <span className="font-bold">
                      {s.team === 1 ? break1.breakPointsWon : break2.breakPointsWon}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400">
            Break = game ganado cuando sacaba el otro equipo
          </p>
        </div>

        {/* Point Distribution */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <h2 className="font-semibold text-slate-800">
            Distribución de Puntos
          </h2>
          <div className="text-sm text-slate-600">
            {distribution.totalPoints} puntos jugados
          </div>

          {/* Distribution bar */}
          {distribution.totalPoints > 0 && (
            <div className="space-y-2">
              <div className="flex rounded-lg overflow-hidden h-8">
                {distribution.winnerPct > 0 && (
                  <div
                    className="bg-winner flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${distribution.winnerPct}%` }}
                  >
                    {distribution.winnerPct}%
                  </div>
                )}
                {distribution.unforcedPct > 0 && (
                  <div
                    className="bg-unforced flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${distribution.unforcedPct}%` }}
                  >
                    {distribution.unforcedPct}%
                  </div>
                )}
                {distribution.forcedPct > 0 && (
                  <div
                    className="bg-forced flex items-center justify-center text-white text-xs font-bold"
                    style={{ width: `${distribution.forcedPct}%` }}
                  >
                    {distribution.forcedPct}%
                  </div>
                )}
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-winner inline-block" />
                  Winners ({distribution.decidedByWinner})
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-unforced inline-block" />
                  ENF ({distribution.decidedByUnforcedError})
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-forced inline-block" />
                  EF ({distribution.decidedByForcedError})
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Share buttons */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <h2 className="font-semibold text-slate-800">Compartir</h2>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => shareViaWhatsApp(generateMatchSummary(state))}
              className="h-12 rounded-xl bg-[#25D366] text-white font-semibold text-sm active:scale-95 transition-all"
            >
              WhatsApp
            </button>
            <button
              onClick={async () => {
                const text = generateMatchSummary(state);
                const shared = await shareNative(text);
                if (!shared) {
                  const ok = await copyToClipboard(text);
                  if (ok) {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }
              }}
              className="h-12 rounded-xl bg-slate-700 text-white font-semibold text-sm active:scale-95 transition-all"
            >
              Compartir
            </button>
            <button
              onClick={async () => {
                const ok = await copyToClipboard(generateMatchSummary(state));
                if (ok) {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }
              }}
              className="h-12 rounded-xl bg-slate-200 text-slate-700 font-semibold text-sm active:scale-95 transition-all"
            >
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </div>

        {/* New match button */}
        <button
          onClick={() => dispatch({ type: "RESET_MATCH" })}
          className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold text-lg active:scale-[0.98] transition-all"
        >
          Nuevo Partido
        </button>
      </div>
    </div>
  );
}
