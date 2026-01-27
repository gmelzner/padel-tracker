import type {
  CompletedSet,
  DeuceMode,
  GamePoint,
  MatchConfig,
  ScoreSnapshot,
  Team,
} from "./types";

const NEXT_POINT: Record<GamePoint, GamePoint> = {
  0: 15,
  15: 30,
  30: 40,
  40: 40, // handled specially at 40
};

function otherTeam(team: Team): Team {
  return team === 1 ? 2 : 1;
}

function idx(team: Team): 0 | 1 {
  return team === 1 ? 0 : 1;
}

function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export interface AdvanceResult {
  newScore: ScoreSnapshot;
  matchOver: boolean;
  winningTeam: Team | null;
}

export function advanceScore(
  score: ScoreSnapshot,
  config: MatchConfig,
  pointWonByTeam: Team
): AdvanceResult {
  const s = clone(score);

  if (s.isTiebreak) {
    return advanceTiebreak(s, config, pointWonByTeam);
  }

  return advanceRegularGame(s, config, pointWonByTeam);
}

function advanceRegularGame(
  s: ScoreSnapshot,
  config: MatchConfig,
  winnerTeam: Team
): AdvanceResult {
  const wi = idx(winnerTeam);
  const li = idx(otherTeam(winnerTeam));
  const winnerPoints = s.points[wi];
  const loserPoints = s.points[li];

  // Both at 40: deuce situation
  if (winnerPoints === 40 && loserPoints === 40) {
    if (config.deuceMode === "golden-point") {
      // Golden point: next point wins the game
      return winGame(s, config, winnerTeam);
    }

    // Advantage mode
    if (s.advantage === winnerTeam) {
      // Had advantage, wins the game
      return winGame(s, config, winnerTeam);
    } else if (s.advantage === otherTeam(winnerTeam)) {
      // Opponent had advantage, back to deuce
      s.advantage = null;
      return { newScore: s, matchOver: false, winningTeam: null };
    } else {
      // No advantage yet, winner gets advantage
      s.advantage = winnerTeam;
      return { newScore: s, matchOver: false, winningTeam: null };
    }
  }

  // Winner at 40, loser below 40: winner wins the game
  if (winnerPoints === 40) {
    return winGame(s, config, winnerTeam);
  }

  // Normal point progression
  s.points[wi] = NEXT_POINT[winnerPoints];
  return { newScore: s, matchOver: false, winningTeam: null };
}

function winGame(
  s: ScoreSnapshot,
  config: MatchConfig,
  winnerTeam: Team
): AdvanceResult {
  const wi = idx(winnerTeam);

  // Reset points
  s.points = [0, 0];
  s.advantage = null;

  // Add game to winner
  s.games[wi] += 1;

  // Alternate serve
  s.servingTeam = otherTeam(s.servingTeam);

  // Check if set is won
  const setResult = checkSetWon(s.games, config);

  if (setResult.won) {
    return winSet(s, config, setResult.byTeam!);
  }

  // Check if tiebreak should start
  if (shouldStartTiebreak(s.games, config)) {
    s.isTiebreak = true;
    s.tiebreakPoints = [0, 0];
  }

  return { newScore: s, matchOver: false, winningTeam: null };
}

function winSet(
  s: ScoreSnapshot,
  config: MatchConfig,
  winnerTeam: Team
): AdvanceResult {
  const wi = idx(winnerTeam);

  // Record completed set
  const completedSet: CompletedSet = {
    games: [s.games[0], s.games[1]],
    tiebreakPlayed: s.isTiebreak,
    tiebreakScore: s.isTiebreak
      ? [s.tiebreakPoints[0], s.tiebreakPoints[1]]
      : undefined,
  };
  s.completedSets.push(completedSet);

  // Add set to winner
  s.sets[wi] += 1;

  // Check if match is won
  const setsToWin = Math.ceil(config.numberOfSets / 2);
  if (s.sets[wi] >= setsToWin) {
    return { newScore: s, matchOver: true, winningTeam: winnerTeam };
  }

  // Start new set
  s.games = [0, 0];
  s.points = [0, 0];
  s.advantage = null;
  s.isTiebreak = false;
  s.tiebreakPoints = [0, 0];
  s.currentSetIndex += 1;

  return { newScore: s, matchOver: false, winningTeam: null };
}

function advanceTiebreak(
  s: ScoreSnapshot,
  config: MatchConfig,
  winnerTeam: Team
): AdvanceResult {
  const wi = idx(winnerTeam);
  const li = idx(otherTeam(winnerTeam));

  s.tiebreakPoints[wi] += 1;

  const TIEBREAK_MIN = 7;
  const winnerTB = s.tiebreakPoints[wi];
  const loserTB = s.tiebreakPoints[li];

  // Tiebreak won: reach minimum AND lead by 2
  if (winnerTB >= TIEBREAK_MIN && winnerTB - loserTB >= 2) {
    // Winner gets the set game count = gamesPerSet + 1
    s.games[wi] = config.gamesPerSet + 1;
    return winSet(s, config, winnerTeam);
  }

  // Serve rotation in tiebreak:
  // After the first point, serve switches. Then every 2 points.
  const totalTBPoints = s.tiebreakPoints[0] + s.tiebreakPoints[1];
  if (totalTBPoints === 1) {
    s.servingTeam = otherTeam(s.servingTeam);
  } else if (totalTBPoints > 1 && (totalTBPoints - 1) % 2 === 0) {
    s.servingTeam = otherTeam(s.servingTeam);
  }

  return { newScore: s, matchOver: false, winningTeam: null };
}

function checkSetWon(
  games: [number, number],
  config: MatchConfig
): { won: boolean; byTeam?: Team } {
  const [g1, g2] = games;
  const target = config.gamesPerSet;

  // Team 1 reached target
  if (g1 >= target && g1 - g2 >= 2) {
    return { won: true, byTeam: 1 };
  }

  // Team 2 reached target
  if (g2 >= target && g2 - g1 >= 2) {
    return { won: true, byTeam: 2 };
  }

  return { won: false };
}

export function shouldStartTiebreak(
  games: [number, number],
  config: MatchConfig
): boolean {
  return (
    config.tiebreakEnabled &&
    games[0] === config.gamesPerSet &&
    games[1] === config.gamesPerSet
  );
}

export function getPointDisplay(score: ScoreSnapshot): [string, string] {
  if (score.isTiebreak) {
    return [
      String(score.tiebreakPoints[0]),
      String(score.tiebreakPoints[1]),
    ];
  }

  const [p1, p2] = score.points;

  if (p1 === 40 && p2 === 40) {
    if (score.advantage === 1) return ["Ad", "40"];
    if (score.advantage === 2) return ["40", "Ad"];
    return ["40", "40"];
  }

  return [String(p1), String(p2)];
}
