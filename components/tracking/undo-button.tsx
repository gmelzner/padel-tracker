"use client";

import { useMatch } from "@/lib/match-context";
import { POINT_TYPE_LABELS, MAGIA_TYPE_LABELS } from "@/lib/constants";

export function UndoButton() {
  const { state, dispatch } = useMatch();

  const lastPoint =
    state.history.length > 0
      ? state.history[state.history.length - 1]
      : null;
  const lastMagia =
    state.magias.length > 0
      ? state.magias[state.magias.length - 1]
      : null;

  // Show the most recent action (point or magia) by timestamp
  const showMagia =
    lastMagia && (!lastPoint || lastMagia.timestamp >= lastPoint.timestamp);

  if (!lastPoint && !lastMagia) return null;

  if (showMagia && lastMagia) {
    const player = state.players.find((p) => p.id === lastMagia.playerId);
    return (
      <button
        onClick={() => dispatch({ type: "UNDO_MAGIA" })}
        className="w-full h-12 rounded-xl border-2 border-purple-300 text-purple-600 text-sm font-medium active:bg-purple-50 transition-colors"
      >
        Deshacer: {MAGIA_TYPE_LABELS[lastMagia.magiaType]} — {player?.name}
      </button>
    );
  }

  if (lastPoint) {
    const player = lastPoint.playerId
      ? state.players.find((p) => p.id === lastPoint.playerId)
      : null;
    const label = lastPoint.pointType
      ? POINT_TYPE_LABELS[lastPoint.pointType]
      : "Punto directo";
    const who = player ? player.name : `Eq. ${lastPoint.pointWonByTeam}`;

    return (
      <button
        onClick={() => dispatch({ type: "UNDO_POINT" })}
        className="w-full h-12 rounded-xl border-2 border-slate-300 text-slate-600 text-sm font-medium active:bg-slate-100 transition-colors"
      >
        Deshacer: {label} — {who}
      </button>
    );
  }

  return null;
}
