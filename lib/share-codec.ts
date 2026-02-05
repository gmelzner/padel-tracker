import type { MagiaType, MatchState, Team, Position } from "./types";
import {
  computePlayerStats,
  computeTeamStats,
  computeStreaks,
  computeBreakPoints,
  computePointDistribution,
  computeTeamPointDistribution,
  computePlayerMagiaStats,
  computeTeamMagiaStats,
  computeMomentum,
} from "./analytics";

/**
 * Compact data structure for URL-encoded match results.
 * Short keys to minimize URL length.
 */
export interface SharedMatchData {
  /** Player names: [t1drive, t1reves, t2drive, t2reves] */
  p: string[];
  /** Completed sets: [[games1, games2], ...] */
  s: number[][];
  /** Tiebreak scores per set (null if no tiebreak) */
  tb: (number[] | null)[];
  /** Winning team: 0=none, 1, 2 */
  w: number;
  /** Per-player stats: [[winners, unforcedErrors, forcedErrors, effectiveness], ...] */
  ps: number[][];
  /** Per-team stats: [[pointsWon, winners, unforcedErrors, forcedErrors], ...] */
  ts: number[][];
  /** Streaks: [team1longest, team2longest] */
  st: number[];
  /** Break points won: [team1, team2] */
  bp: number[];
  /** Distribution: [total, winPct, unfPct, forPct, decW, decU, decF] */
  d: number[];
  /** Optional per-team distribution: [[totalWon, byW, byUE, byFE], [totalWon, byW, byUE, byFE]] */
  dt?: number[][];
  /** Optional per-player magia stats: [[x3,x4,dej,dor,vib,sdp], ...] same order as p */
  mg?: number[][];
  /** Optional per-team magia totals: [[x3,x4,dej,dor,vib,sdp], [x3,x4,dej,dor,vib,sdp]] */
  mt?: number[][];
  /** Optional momentum data: array of differentials (team1 - team2) at each point */
  mo?: number[];
}

const MAGIA_ORDER: MagiaType[] = ["x3", "x4", "dejada", "dormilona"];

export function encodeMatchResults(state: MatchState): string {
  const { score, players, history, magias, winningTeam } = state;

  const t1d = players.find((p) => p.team === 1 && p.position === "drive");
  const t1r = players.find((p) => p.team === 1 && p.position === "reves");
  const t2d = players.find((p) => p.team === 2 && p.position === "drive");
  const t2r = players.find((p) => p.team === 2 && p.position === "reves");

  const playerStats = computePlayerStats(history, players);
  const [ts1, ts2] = computeTeamStats(history, players);
  const [streak1, streak2] = computeStreaks(history);
  const [break1, break2] = computeBreakPoints(history, score);
  const dist = computePointDistribution(history);

  const data: SharedMatchData = {
    p: [t1d?.name ?? "", t1r?.name ?? "", t2d?.name ?? "", t2r?.name ?? ""],
    s: score.completedSets.map((set) => [set.games[0], set.games[1]]),
    tb: score.completedSets.map((set) =>
      set.tiebreakPlayed && set.tiebreakScore
        ? [set.tiebreakScore[0], set.tiebreakScore[1]]
        : null
    ),
    w: winningTeam ?? 0,
    ps: playerStats.map((ps) => [
      ps.winners,
      ps.unforcedErrors,
      ps.forcedErrors,
      ps.effectiveness,
    ]),
    ts: [
      [ts1.totalPointsWon, ts1.totalWinners, ts1.totalUnforcedErrors, ts1.totalForcedErrors],
      [ts2.totalPointsWon, ts2.totalWinners, ts2.totalUnforcedErrors, ts2.totalForcedErrors],
    ],
    st: [streak1.longestStreak, streak2.longestStreak],
    bp: [break1.breakPointsWon, break2.breakPointsWon],
    d: [
      dist.totalPoints,
      dist.winnerPct,
      dist.unforcedPct,
      dist.forcedPct,
      dist.decidedByWinner,
      dist.decidedByUnforcedError,
      dist.decidedByForcedError,
    ],
  };

  // Per-team distribution
  const [td1, td2] = computeTeamPointDistribution(history);
  data.dt = [
    [td1.totalPointsWon, td1.byWinner, td1.byUnforcedError, td1.byForcedError],
    [td2.totalPointsWon, td2.byWinner, td2.byUnforcedError, td2.byForcedError],
  ];

  // Include magias only if there are any (backward compatible)
  if (magias.length > 0) {
    const pMagias = computePlayerMagiaStats(magias, players);
    const [tM1, tM2] = computeTeamMagiaStats(magias, players);
    data.mg = pMagias.map((pm) => MAGIA_ORDER.map((t) => pm.byType[t]));
    data.mt = [
      MAGIA_ORDER.map((t) => tM1.byType[t]),
      MAGIA_ORDER.map((t) => tM2.byType[t]),
    ];
  }

  // Include momentum data for the chart
  if (history.length > 0) {
    const momentum = computeMomentum(history);
    data.mo = momentum.map((m) => m.differential);
  }

  const json = JSON.stringify(data);
  // Use base64url encoding (URL-safe)
  const base64 = btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return base64;
}

export interface DecodedMatchResults {
  players: { name: string; team: 1 | 2; position: Position }[];
  completedSets: {
    games: [number, number];
    tiebreakPlayed: boolean;
    tiebreakScore?: [number, number];
  }[];
  winningTeam: Team | null;
  playerStats: {
    playerName: string;
    team: 1 | 2;
    position: Position;
    winners: number;
    unforcedErrors: number;
    forcedErrors: number;
    effectiveness: number;
  }[];
  teamStats: {
    team: Team;
    totalPointsWon: number;
    totalWinners: number;
    totalUnforcedErrors: number;
    totalForcedErrors: number;
  }[];
  streaks: { team: Team; longestStreak: number }[];
  breaks: { team: Team; breakPointsWon: number }[];
  distribution: {
    totalPoints: number;
    winnerPct: number;
    unforcedPct: number;
    forcedPct: number;
    decidedByWinner: number;
    decidedByUnforcedError: number;
    decidedByForcedError: number;
  };
  teamDistribution: {
    team: Team;
    totalPointsWon: number;
    byWinner: number;
    byUnforcedError: number;
    byForcedError: number;
    winnerPct: number;
    unforcedPct: number;
    forcedPct: number;
  }[] | null;
  magiaPlayerStats: {
    playerName: string;
    team: 1 | 2;
    total: number;
    byType: Record<MagiaType, number>;
  }[] | null;
  magiaTeamStats: {
    team: Team;
    total: number;
    byType: Record<MagiaType, number>;
  }[] | null;
  momentum: { index: number; differential: number }[] | null;
}

export function decodeMatchResults(encoded: string): DecodedMatchResults | null {
  try {
    // Restore base64 padding and standard chars
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";

    const json = decodeURIComponent(escape(atob(base64)));
    const data: SharedMatchData = JSON.parse(json);

    const positions: Position[] = ["drive", "reves", "drive", "reves"];
    const teams: (1 | 2)[] = [1, 1, 2, 2];

    const players = data.p.map((name, i) => ({
      name,
      team: teams[i],
      position: positions[i],
    }));

    const completedSets = data.s.map((games, i) => ({
      games: games as [number, number],
      tiebreakPlayed: data.tb[i] !== null,
      tiebreakScore: data.tb[i]
        ? (data.tb[i] as [number, number])
        : undefined,
    }));

    const playerStats = data.ps.map((ps, i) => ({
      playerName: data.p[i],
      team: teams[i],
      position: positions[i],
      winners: ps[0],
      unforcedErrors: ps[1],
      forcedErrors: ps[2],
      effectiveness: ps[3],
    }));

    const teamStats: DecodedMatchResults["teamStats"] = [
      {
        team: 1,
        totalPointsWon: data.ts[0][0],
        totalWinners: data.ts[0][1],
        totalUnforcedErrors: data.ts[0][2],
        totalForcedErrors: data.ts[0][3],
      },
      {
        team: 2,
        totalPointsWon: data.ts[1][0],
        totalWinners: data.ts[1][1],
        totalUnforcedErrors: data.ts[1][2],
        totalForcedErrors: data.ts[1][3],
      },
    ];

    // Decode optional per-team distribution
    let teamDistribution: DecodedMatchResults["teamDistribution"] = null;
    if (data.dt) {
      teamDistribution = data.dt.map((row, idx) => {
        const total = row[0];
        const byW = row[1];
        const byUE = row[2];
        const byFE = row[3];
        const catTotal = byW + byUE + byFE;
        return {
          team: (idx + 1) as Team,
          totalPointsWon: total,
          byWinner: byW,
          byUnforcedError: byUE,
          byForcedError: byFE,
          winnerPct: catTotal > 0 ? Math.round((byW / catTotal) * 100) : 0,
          unforcedPct: catTotal > 0 ? Math.round((byUE / catTotal) * 100) : 0,
          forcedPct: catTotal > 0 ? Math.round((byFE / catTotal) * 100) : 0,
        };
      });
    }

    // Decode optional magia data
    let magiaPlayerStats: DecodedMatchResults["magiaPlayerStats"] = null;
    let magiaTeamStats: DecodedMatchResults["magiaTeamStats"] = null;

    if (data.mg && data.mt) {
      magiaPlayerStats = data.mg.map((row, i) => {
        const byType = {} as Record<MagiaType, number>;
        MAGIA_ORDER.forEach((t, j) => { byType[t] = row[j]; });
        return {
          playerName: data.p[i],
          team: teams[i],
          total: row.reduce((a, b) => a + b, 0),
          byType,
        };
      });

      magiaTeamStats = data.mt.map((row, idx) => {
        const byType = {} as Record<MagiaType, number>;
        MAGIA_ORDER.forEach((t, j) => { byType[t] = row[j]; });
        return {
          team: (idx + 1) as Team,
          total: row.reduce((a, b) => a + b, 0),
          byType,
        };
      });
    }

    // Decode momentum data
    const momentum = data.mo
      ? data.mo.map((diff, i) => ({ index: i, differential: diff }))
      : null;

    return {
      players,
      completedSets,
      winningTeam: data.w === 0 ? null : (data.w as Team),
      playerStats,
      teamStats,
      streaks: [
        { team: 1, longestStreak: data.st[0] },
        { team: 2, longestStreak: data.st[1] },
      ],
      breaks: [
        { team: 1, breakPointsWon: data.bp[0] },
        { team: 2, breakPointsWon: data.bp[1] },
      ],
      distribution: {
        totalPoints: data.d[0],
        winnerPct: data.d[1],
        unforcedPct: data.d[2],
        forcedPct: data.d[3],
        decidedByWinner: data.d[4],
        decidedByUnforcedError: data.d[5],
        decidedByForcedError: data.d[6],
      },
      teamDistribution,
      magiaPlayerStats,
      magiaTeamStats,
      momentum,
    };
  } catch {
    return null;
  }
}
