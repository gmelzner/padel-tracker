import { createClient } from "./supabase";
import type { Match, MatchInsert } from "./database.types";
import type { MatchState, Player } from "./types";

export function buildMatchInsert(
  state: MatchState,
  userId: string,
  selectedPlayer: Player
): MatchInsert {
  const team1Players = state.players
    .filter((p) => p.team === 1)
    .map((p) => p.name);
  const team2Players = state.players
    .filter((p) => p.team === 2)
    .map((p) => p.name);

  return {
    user_id: userId,
    team1_players: team1Players,
    team2_players: team2Players,
    winning_team: state.winningTeam,
    user_team: selectedPlayer.team,
    user_player_name: selectedPlayer.name,
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

export async function saveMatch(
  state: MatchState,
  userId: string,
  selectedPlayer: Player
): Promise<{ data: Match | null; error: string | null }> {
  const supabase = createClient();
  const insert = buildMatchInsert(state, userId, selectedPlayer);

  const { data, error } = await supabase
    .from("matches")
    .insert(insert)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }
  return { data: data as Match, error: null };
}

export async function getUserMatches(
  userId: string
): Promise<{ data: Match[]; error: string | null }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("user_id", userId)
    .order("played_at", { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }
  return { data: (data ?? []) as Match[], error: null };
}

export async function deleteMatch(
  matchId: string
): Promise<{ error: string | null }> {
  const supabase = createClient();

  const { error } = await supabase.from("matches").delete().eq("id", matchId);

  if (error) {
    return { error: error.message };
  }
  return { error: null };
}
