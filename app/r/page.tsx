"use client";

import { useEffect, useState } from "react";
import {
  decodeMatchResults,
  type DecodedMatchResults,
} from "@/lib/share-codec";
import { MAGIA_TYPE_LABELS } from "@/lib/constants";
import type { MagiaType } from "@/lib/types";

export default function SharedResultsPage() {
  const [data, setData] = useState<DecodedMatchResults | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      setError(true);
      return;
    }
    const decoded = decodeMatchResults(hash);
    if (!decoded) {
      setError(true);
      return;
    }
    setData(decoded);
  }, []);

  if (error) {
    return (
      <div className="min-h-dvh bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-slate-800">
            Resultado no encontrado
          </h1>
          <p className="text-slate-500">
            El link no es válido o expiró.
          </p>
          <a
            href="/"
            className="inline-block mt-4 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold"
          >
            Ir a Padel Tracker
          </a>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-dvh bg-slate-50 flex items-center justify-center">
        <div className="text-slate-400">Cargando...</div>
      </div>
    );
  }

  const { players, completedSets, winningTeam, playerStats, teamStats, streaks, breaks, distribution, teamDistribution, magiaPlayerStats, magiaTeamStats } = data;

  const magiaTypes: MagiaType[] = ["x3", "x4", "dejada", "dormilona"];
  const magiaShortLabels: Record<MagiaType, string> = {
    x3: "x3", x4: "x4", dejada: "Dej", dormilona: "Dor",
  };

  const team1Players = players.filter((p) => p.team === 1);
  const team2Players = players.filter((p) => p.team === 2);
  const team1Label = team1Players.map((p) => p.name).join(" / ");
  const team2Label = team2Players.map((p) => p.name).join(" / ");

  return (
    <div className="min-h-dvh bg-slate-50 p-4 pb-8">
      <div className="max-w-lg mx-auto space-y-4">
        <div className="text-center pt-4 space-y-1">
          <h1 className="text-2xl font-bold text-slate-800">Resultado</h1>
          <p className="text-slate-400 text-xs">Padel Tracker</p>
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
          {completedSets.map((set, i) => (
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
        </div>

        {/* Player stats */}
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
                  <th className="text-center py-2 px-1">EFG</th>
                  <th className="text-center py-2 px-1">Efect.</th>
                </tr>
              </thead>
              <tbody>
                {playerStats.map((ps, i) => (
                  <tr key={i} className="border-t border-slate-100">
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
                    <td className="text-center font-bold">
                      {ps.effectiveness}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-slate-400">
            W = Winners · ENF = Errores No Forzados · EFG = Errores Forzados Gen. ·
            Efect. = (W + EFG) / (W + EFG + ENF)
          </div>
        </div>

        {/* Team stats */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <h2 className="font-semibold text-slate-800">
            Estadísticas por Equipo
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {teamStats.map((ts) => (
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
                    <span className="text-slate-600">Err. Forz. Gen.</span>
                    <span className="font-bold text-forced">
                      {ts.totalForcedErrors}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streaks + Break Points */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <h2 className="font-semibold text-slate-800">Rachas y Breaks</h2>
          <div className="grid grid-cols-2 gap-3">
            {streaks.map((s, i) => (
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
                      {breaks[i].breakPointsWon}
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

        {/* Point Distribution by Team */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
          <h2 className="font-semibold text-slate-800">
            Distribución de Puntos
          </h2>
          <div className="text-sm text-slate-600">
            {distribution.totalPoints} puntos jugados
          </div>

          {distribution.totalPoints > 0 && teamDistribution ? (
            <div className="grid grid-cols-2 gap-3">
              {teamDistribution.map((td) => (
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
          ) : distribution.totalPoints > 0 ? (
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
                  EFG ({distribution.decidedByForcedError})
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Magias / Highlights */}
        {magiaTeamStats && magiaPlayerStats && magiaTeamStats.some((t) => t.total > 0) && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
            <h2 className="font-semibold text-slate-800">Highlights</h2>
            <div className="grid grid-cols-2 gap-3">
              {magiaTeamStats.map((tm) => (
                <div
                  key={tm.team}
                  className={`rounded-lg p-3 ${
                    tm.team === 1 ? "bg-team1-light" : "bg-team2-light"
                  }`}
                >
                  <div
                    className={`font-bold text-sm mb-2 ${
                      tm.team === 1 ? "text-team1" : "text-team2"
                    }`}
                  >
                    Equipo {tm.team}: {tm.total}
                  </div>
                  <div className="space-y-0.5 text-sm">
                    {magiaTypes.filter((t) => tm.byType[t] > 0).map((t) => (
                      <div key={t} className="flex justify-between">
                        <span className="text-slate-600">{MAGIA_TYPE_LABELS[t]}</span>
                        <span className="font-bold">{tm.byType[t]}</span>
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
                    <th className="text-left py-2 pr-2">Jugador</th>
                    {magiaTypes.map((t) => (
                      <th key={t} className="text-center py-2 px-1">{magiaShortLabels[t]}</th>
                    ))}
                    <th className="text-center py-2 px-1">Tot</th>
                  </tr>
                </thead>
                <tbody>
                  {magiaPlayerStats.filter((ps) => ps.total > 0).map((ps, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="py-2 pr-2">
                        <span className={`font-medium ${ps.team === 1 ? "text-team1" : "text-team2"}`}>
                          {ps.playerName}
                        </span>
                      </td>
                      {magiaTypes.map((t) => (
                        <td key={t} className="text-center text-purple-600 font-semibold">
                          {ps.byType[t] || ""}
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

        {/* CTA */}
        <a
          href="/"
          className="block w-full h-14 rounded-2xl bg-slate-900 text-white font-bold text-lg text-center leading-[3.5rem] active:scale-[0.98] transition-all"
        >
          Crear mi partido
        </a>
      </div>
    </div>
  );
}
