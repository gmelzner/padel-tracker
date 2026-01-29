"use client";

import { useTranslations } from "next-intl";
import { useMatch } from "@/lib/match-context";
import { MAGIA_TYPE_LABELS } from "@/lib/constants";
import type { MagiaType, PointType } from "@/lib/types";

const POINT_TYPE_KEYS: Record<PointType, string> = {
  winner: "pointTypes.winner",
  "forced-error": "pointTypes.forcedError",
  "unforced-error": "pointTypes.unforcedError",
};

export function UndoButton() {
  const t = useTranslations();
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
        {t("undo.undo") + ":"} {MAGIA_TYPE_LABELS[lastMagia.magiaType]} — {player?.name}
      </button>
    );
  }

  if (lastPoint) {
    const player = lastPoint.playerId
      ? state.players.find((p) => p.id === lastPoint.playerId)
      : null;
    const label = lastPoint.pointType
      ? t(POINT_TYPE_KEYS[lastPoint.pointType])
      : t("undo.directPoint");
    const who = player ? player.name : t("undo.teamLabel", { team: lastPoint.pointWonByTeam });

    return (
      <button
        onClick={() => dispatch({ type: "UNDO_POINT" })}
        className="w-full h-12 rounded-xl border-2 border-slate-300 text-slate-600 text-sm font-medium active:bg-slate-100 transition-colors"
      >
        {t("undo.undo") + ":"} {label} — {who}
      </button>
    );
  }

  return null;
}
