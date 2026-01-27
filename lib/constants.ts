import type { MagiaType, ScoreSnapshot } from "./types";

export const POINT_TYPE_LABELS = {
  winner: "Winner",
  "forced-error": "Error Forzado Generado",
  "unforced-error": "Error No Forzado",
} as const;

export const MAGIA_TYPE_LABELS: Record<MagiaType, string> = {
  x3: "x3",
  x4: "x4",
  dejada: "Dejada",
  dormilona: "Dormilona",
  vibora: "Víbora",
  "salida-de-pista": "Salida de Pista",
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
