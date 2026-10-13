import type { Match, MatchInsert } from "./database.types";
import type { MatchState, Player } from "./types";
import type { DecodedMatchResults } from "./share-codec";

export function buildMatchInsert(
  state: MatchState,
  selectedPlayer: Player | null
): MatchInsert {
  const team1Players = state.players
    .filter((p) => p.team === 1)
    .map((p) => p.name);
  const team2Players = state.players
    .filter((p) => p.team === 2)
    .map((p) => p.name);

  return {
    team1_players: team1Players,
    team2_players: team2Players,
    winning_team: state.winningTeam,
    user_team: selectedPlayer?.team ?? null,
    user_player_name: selectedPlayer?.name ?? null,
    sets_score: [
      ...state.score.completedSets.map((s) => ({
        games: s.games,
        tiebreakPlayed: s.tiebreakPlayed,
        ...(s.tiebreakScore ? { tiebreakScore: s.tiebreakScore } : {}),
      })),
      // Include current set if match ended early and games were played
      ...(!state.winningTeam &&
      (state.score.games[0] > 0 || state.score.games[1] > 0)
        ? [{ games: state.score.games, tiebreakPlayed: false }]
        : []),
    ],
    total_points: state.history.length,
    match_data: state as unknown as Record<string, unknown>,
  };
}

async function postMatch(
  insert: MatchInsert
): Promise<{ data: Match | null; error: string | null }> {
  try {
    const response = await fetch("/api/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(insert),
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      const error = body?.error ?? `Error ${response.status}`;
      console.error("[PadelTracker] saveMatch failed:", error);
      return { data: null, error };
    }
    return { data: body.data as Match, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Network error" };
  }
}

export function saveMatch(
  state: MatchState,
  selectedPlayer: Player | null
): Promise<{ data: Match | null; error: string | null }> {
  return postMatch(buildMatchInsert(state, selectedPlayer));
}

export function saveMatchFromShared(
  decoded: DecodedMatchResults,
  selectedPlayer: { name: string; team: 1 | 2 } | null,
  sourceSharedId?: string
): Promise<{ data: Match | null; error: string | null }> {
  const team1Players = decoded.players
    .filter((p) => p.team === 1)
    .map((p) => p.name);
  const team2Players = decoded.players
    .filter((p) => p.team === 2)
    .map((p) => p.name);

  const totalPoints = decoded.teamStats.reduce(
    (sum, ts) => sum + ts.totalPointsWon,
    0
  );

  // The server answers "ALREADY_CLAIMED" when this user saved this result before
  return postMatch({
    team1_players: team1Players,
    team2_players: team2Players,
    winning_team: decoded.winningTeam,
    user_team: selectedPlayer?.team ?? null,
    user_player_name: selectedPlayer?.name ?? null,
    sets_score: decoded.completedSets.map((s) => ({
      games: s.games,
      tiebreakPlayed: s.tiebreakPlayed,
      ...(s.tiebreakScore ? { tiebreakScore: s.tiebreakScore } : {}),
    })),
    total_points: totalPoints,
    match_data: decoded as unknown as Record<string, unknown>,
    ...(sourceSharedId ? { source_shared_id: sourceSharedId } : {}),
  });
}

export async function getUserMatches(): Promise<{ data: Match[]; error: string | null }> {
  try {
    const response = await fetch("/api/matches");
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      return { data: [], error: body?.error ?? `Error ${response.status}` };
    }
    return { data: (body.data ?? []) as Match[], error: null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : "Network error" };
  }
}

export async function deleteMatch(
  matchId: string
): Promise<{ error: string | null }> {
  try {
    const response = await fetch(`/api/matches/${matchId}`, { method: "DELETE" });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      return { error: body?.error ?? `Error ${response.status}` };
    }
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}
