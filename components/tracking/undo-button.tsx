"use client";

import { useMatch } from "@/lib/match-context";
import { POINT_TYPE_LABELS } from "@/lib/constants";

export function UndoButton() {
  const { state, dispatch } = useMatch();
  const lastRecord =
    state.history.length > 0
      ? state.history[state.history.length - 1]
      : null;

  if (!lastRecord) return null;

  const player = state.players.find((p) => p.id === lastRecord.playerId);
  const label = POINT_TYPE_LABELS[lastRecord.pointType];

  return (
    <button
      onClick={() => dispatch({ type: "UNDO_POINT" })}
      className="w-full h-12 rounded-xl border-2 border-slate-300 text-slate-600 text-sm font-medium active:bg-slate-100 transition-colors"
    >
      Deshacer: {label} de {player?.name}
    </button>
  );
}
