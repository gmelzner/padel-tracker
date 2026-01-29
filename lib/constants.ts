import type { MagiaType, PointType, ScoreSnapshot } from "./types";

// Translation keys for point types — use with t() from next-intl
export const POINT_TYPE_KEYS: Record<PointType, string> = {
  winner: "pointTypes.winner",
  "forced-error": "pointTypes.forcedError",
  "unforced-error": "pointTypes.unforcedError",
};

// Magia labels are padel terms — same in all languages
export const MAGIA_TYPE_LABELS: Record<MagiaType, string> = {
  x3: "x3",
  x4: "x4",
  dejada: "Dejada",
  dormilona: "Dormilona",
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
