export type Screen = "setup" | "tracking" | "results";

export type Team = 1 | 2;

export type Position = "drive" | "reves";

export type DeuceMode = "advantage" | "golden-point";

export type PointType = "winner" | "unforced-error" | "forced-error";

export type GamePoint = 0 | 15 | 30 | 40;

export interface Player {
  id: string;
  name: string;
  team: Team;
  position: Position;
}

export interface MatchConfig {
  gamesPerSet: number;
  numberOfSets: number;
  deuceMode: DeuceMode;
  tiebreakEnabled: boolean;
}

export interface CompletedSet {
  games: [number, number];
  tiebreakPlayed: boolean;
  tiebreakScore?: [number, number];
}

export interface ScoreSnapshot {
  sets: [number, number];
  games: [number, number];
  points: [GamePoint, GamePoint];
  advantage: Team | null;
  isTiebreak: boolean;
  tiebreakPoints: [number, number];
  completedSets: CompletedSet[];
  currentSetIndex: number;
  servingTeam: Team;
}

export interface PointRecord {
  id: string;
  timestamp: number;
  pointType: PointType | null;
  playerId: string | null;
  pointWonByTeam: Team;
  scoreBefore: ScoreSnapshot;
}

export type MagiaType = "x3" | "x4" | "dejada" | "dormilona" | "vibora" | "salida-de-pista";

export interface MagiaRecord {
  id: string;
  timestamp: number;
  magiaType: MagiaType;
  playerId: string;
}

export interface MatchState {
  screen: Screen;
  config: MatchConfig;
  players: Player[];
  score: ScoreSnapshot;
  history: PointRecord[];
  magias: MagiaRecord[];
  matchOver: boolean;
  winningTeam: Team | null;
}

export type MatchAction =
  | { type: "INITIALIZE_MATCH"; payload: { players: Player[]; config: MatchConfig } }
  | { type: "RECORD_POINT"; payload: { pointType: PointType; playerId: string } }
  | { type: "RECORD_QUICK_POINT"; payload: { team: Team } }
  | { type: "UNDO_POINT" }
  | { type: "END_MATCH" }
  | { type: "RESET_MATCH" }
  | { type: "SET_SCORE"; payload: { score: ScoreSnapshot } }
  | { type: "RECORD_MAGIA"; payload: { magiaType: MagiaType; playerId: string } }
  | { type: "UNDO_MAGIA" };
