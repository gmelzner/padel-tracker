import type { MagiaRecord, MagiaType, Player, PointRecord, Position, ScoreSnapshot, Team } from "./types";

// ============================================================
// Player Stats
// ============================================================

export interface PlayerStats {
  playerId: string;
  playerName: string;
  team: Team;
  position: Position;
  winners: number;
  unforcedErrors: number;
  forcedErrors: number;
  totalActions: number;
  effectiveness: number; // (winners + forcedErrors) / (winners + forcedErrors + unforcedErrors), 0-100
}

export function computePlayerStats(
  history: PointRecord[],
  players: Player[]
): PlayerStats[] {
  return players.map((player) => {
    const actions = history.filter((r) => r.playerId === player.id);
    const winners = actions.filter((r) => r.pointType === "winner").length;
    const unforcedErrors = actions.filter((r) => r.pointType === "unforced-error").length;
    const forcedErrors = actions.filter((r) => r.pointType === "forced-error").length;
    const positiveActions = winners + forcedErrors;
    const denominator = positiveActions + unforcedErrors;
    return {
      playerId: player.id,
      playerName: player.name,
      team: player.team,
      position: player.position,
      winners,
      unforcedErrors,
      forcedErrors,
      totalActions: actions.length,
      effectiveness: denominator > 0 ? Math.round((positiveActions / denominator) * 100) : 0,
    };
  });
}

// ============================================================
// Team Stats
// ============================================================

export interface TeamStats {
  team: Team;
  totalPointsWon: number;
  totalWinners: number;
  totalUnforcedErrors: number;
  totalForcedErrors: number;
}

export function computeTeamStats(
  history: PointRecord[],
  players: Player[]
): [TeamStats, TeamStats] {
  const teamIds: Record<Team, string[]> = {
    1: players.filter((p) => p.team === 1).map((p) => p.id),
    2: players.filter((p) => p.team === 2).map((p) => p.id),
  };

  function statsForTeam(team: Team): TeamStats {
    const ids = new Set(teamIds[team]);
    const teamActions = history.filter((r) => r.playerId !== null && ids.has(r.playerId));
    return {
      team,
      totalPointsWon: history.filter((r) => r.pointWonByTeam === team).length,
      totalWinners: teamActions.filter((r) => r.pointType === "winner").length,
      totalUnforcedErrors: teamActions.filter((r) => r.pointType === "unforced-error").length,
      totalForcedErrors: teamActions.filter((r) => r.pointType === "forced-error").length,
    };
  }

  return [statsForTeam(1), statsForTeam(2)];
}

// ============================================================
// Point Streaks
// ============================================================

export interface StreakInfo {
  team: Team;
  longestStreak: number;
}

export function computeStreaks(history: PointRecord[]): [StreakInfo, StreakInfo] {
  let maxStreak1 = 0;
  let maxStreak2 = 0;
  let current1 = 0;
  let current2 = 0;

  for (const record of history) {
    if (record.pointWonByTeam === 1) {
      current1++;
      current2 = 0;
      if (current1 > maxStreak1) maxStreak1 = current1;
    } else {
      current2++;
      current1 = 0;
      if (current2 > maxStreak2) maxStreak2 = current2;
    }
  }

  return [
    { team: 1, longestStreak: maxStreak1 },
    { team: 2, longestStreak: maxStreak2 },
  ];
}

// ============================================================
// Break Points
// ============================================================

export interface BreakInfo {
  team: Team;
  breakPointsWon: number; // games won when the OTHER team was serving
  totalGamesWon: number;
}

export function computeBreakPoints(
  history: PointRecord[],
  score: ScoreSnapshot
): [BreakInfo, BreakInfo] {
  // Track game-by-game: who was serving and who won
  let breaks1 = 0; // games team 1 won on team 2's serve
  let breaks2 = 0; // games team 2 won on team 1's serve
  let gamesWon1 = 0;
  let gamesWon2 = 0;

  // Walk through history and detect game transitions
  for (let i = 0; i < history.length; i++) {
    const record = history[i];
    const before = record.scoreBefore;

    // Check if this point ended a game by looking at the score after
    // The score after is the scoreBefore of the NEXT point, or the current score for the last point
    const after = i + 1 < history.length ? history[i + 1].scoreBefore : score;

    const beforeGames = before.games[0] + before.games[1] +
      before.completedSets.reduce((sum, s) => sum + s.games[0] + s.games[1], 0);
    const afterGames = after.games[0] + after.games[1] +
      after.completedSets.reduce((sum, s) => sum + s.games[0] + s.games[1], 0);

    if (afterGames > beforeGames) {
      // A game was won on this point
      const servingTeam = before.servingTeam;
      const gameWonBy = record.pointWonByTeam;

      if (gameWonBy === 1) {
        gamesWon1++;
        if (servingTeam === 2) breaks1++;
      } else {
        gamesWon2++;
        if (servingTeam === 1) breaks2++;
      }
    }
  }

  return [
    { team: 1, breakPointsWon: breaks1, totalGamesWon: gamesWon1 },
    { team: 2, breakPointsWon: breaks2, totalGamesWon: gamesWon2 },
  ];
}

// ============================================================
// Point Distribution
// ============================================================

export interface PointDistribution {
  totalPoints: number;
  decidedByWinner: number;
  decidedByUnforcedError: number;
  decidedByForcedError: number;
  winnerPct: number;
  unforcedPct: number;
  forcedPct: number;
}

export function computePointDistribution(history: PointRecord[]): PointDistribution {
  const categorized = history.filter((r) => r.pointType !== null);
  const total = categorized.length;
  const winners = categorized.filter((r) => r.pointType === "winner").length;
  const unforced = categorized.filter((r) => r.pointType === "unforced-error").length;
  const forced = categorized.filter((r) => r.pointType === "forced-error").length;
  return {
    totalPoints: history.length,
    decidedByWinner: winners,
    decidedByUnforcedError: unforced,
    decidedByForcedError: forced,
    winnerPct: total > 0 ? Math.round((winners / total) * 100) : 0,
    unforcedPct: total > 0 ? Math.round((unforced / total) * 100) : 0,
    forcedPct: total > 0 ? Math.round((forced / total) * 100) : 0,
  };
}

// ============================================================
// Per-Team Point Distribution
// ============================================================

export interface TeamPointDistribution {
  team: Team;
  totalPointsWon: number;
  byWinner: number;
  byUnforcedError: number;
  byForcedError: number;
  winnerPct: number;
  unforcedPct: number;
  forcedPct: number;
}

export function computeTeamPointDistribution(
  history: PointRecord[]
): [TeamPointDistribution, TeamPointDistribution] {
  function distForTeam(team: Team): TeamPointDistribution {
    const teamPoints = history.filter((r) => r.pointWonByTeam === team);
    const categorized = teamPoints.filter((r) => r.pointType !== null);
    const catTotal = categorized.length;
    const byWinner = categorized.filter((r) => r.pointType === "winner").length;
    const byUnforcedError = categorized.filter((r) => r.pointType === "unforced-error").length;
    const byForcedError = categorized.filter((r) => r.pointType === "forced-error").length;
    return {
      team,
      totalPointsWon: teamPoints.length,
      byWinner,
      byUnforcedError,
      byForcedError,
      winnerPct: catTotal > 0 ? Math.round((byWinner / catTotal) * 100) : 0,
      unforcedPct: catTotal > 0 ? Math.round((byUnforcedError / catTotal) * 100) : 0,
      forcedPct: catTotal > 0 ? Math.round((byForcedError / catTotal) * 100) : 0,
    };
  }
  return [distForTeam(1), distForTeam(2)];
}

// ============================================================
// Momentum Data (for chart)
// ============================================================

export interface MomentumPoint {
  index: number;         // point number (0-based)
  differential: number;  // cumulative: team1 points - team2 points
}

export function computeMomentum(history: PointRecord[]): MomentumPoint[] {
  const points: MomentumPoint[] = [{ index: 0, differential: 0 }];
  let diff = 0;

  for (let i = 0; i < history.length; i++) {
    diff += history[i].pointWonByTeam === 1 ? 1 : -1;
    points.push({ index: i + 1, differential: diff });
  }

  return points;
}

// ============================================================
// Magia Stats
// ============================================================

const MAGIA_TYPES: MagiaType[] = ["x3", "x4", "dejada", "dormilona"];

export interface PlayerMagiaStats {
  playerId: string;
  playerName: string;
  team: Team;
  total: number;
  byType: Record<MagiaType, number>;
}

export function computePlayerMagiaStats(
  magias: MagiaRecord[],
  players: Player[]
): PlayerMagiaStats[] {
  return players.map((player) => {
    const mine = magias.filter((m) => m.playerId === player.id);
    const byType = {} as Record<MagiaType, number>;
    for (const t of MAGIA_TYPES) {
      byType[t] = mine.filter((m) => m.magiaType === t).length;
    }
    return {
      playerId: player.id,
      playerName: player.name,
      team: player.team,
      total: mine.length,
      byType,
    };
  });
}

export interface TeamMagiaStats {
  team: Team;
  total: number;
  byType: Record<MagiaType, number>;
}

export function computeTeamMagiaStats(
  magias: MagiaRecord[],
  players: Player[]
): [TeamMagiaStats, TeamMagiaStats] {
  function statsForTeam(team: Team): TeamMagiaStats {
    const ids = new Set(players.filter((p) => p.team === team).map((p) => p.id));
    const teamMagias = magias.filter((m) => ids.has(m.playerId));
    const byType = {} as Record<MagiaType, number>;
    for (const t of MAGIA_TYPES) {
      byType[t] = teamMagias.filter((m) => m.magiaType === t).length;
    }
    return { team, total: teamMagias.length, byType };
  }
  return [statsForTeam(1), statsForTeam(2)];
}
