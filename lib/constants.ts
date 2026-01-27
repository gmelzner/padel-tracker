import type { ScoreSnapshot } from "./types";

export const POINT_TYPE_LABELS = {
  winner: "Winner",
  "unforced-error": "Error No Forzado",
  "forced-error": "Error Forzado",
} as const;

export function getInitialScore(): ScoreSnapshot {
  return {
    sets: [0, 0],
    games: [0, 0],
    points: [0, 0],
    advantage: null,
    isTiebreak: false,
    tiebreakPoints: [0, 0],
    completedSets: [],
    currentSetIndex: 0,
    servingTeam: 1,
  };
}
