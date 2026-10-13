/**
 * Saved matches. Server-only — every query is scoped to the user it receives,
 * which callers must take from the session, never from the request body.
 */

import { query, queryOne } from "@/lib/db";
import type { Match, MatchInsert } from "@/lib/database.types";

const UNIQUE_VIOLATION = "23505";

export async function createMatch(
  userId: string,
  insert: MatchInsert
): Promise<{ data: Match | null; error: "ALREADY_CLAIMED" | null }> {
  try {
    const match = await queryOne<Match>(
      `insert into matches
         (user_id, team1_players, team2_players, winning_team, user_team, user_player_name,
          sets_score, total_points, match_data, source_shared_id)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       returning *`,
      [
        userId,
        insert.team1_players,
        insert.team2_players,
        insert.winning_team,
        insert.user_team,
        insert.user_player_name,
        JSON.stringify(insert.sets_score),
        insert.total_points,
        JSON.stringify(insert.match_data),
        insert.source_shared_id ?? null,
      ]
    );
    return { data: match, error: null };
  } catch (error) {
    if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
      return { data: null, error: "ALREADY_CLAIMED" };
    }
    throw error;
  }
}

export function getUserMatches(userId: string): Promise<Match[]> {
  return query<Match>(
    "select * from matches where user_id = $1 order by played_at desc",
    [userId]
  );
}

export async function deleteUserMatch(userId: string, matchId: string): Promise<void> {
  await query("delete from matches where id = $1 and user_id = $2", [matchId, userId]);
}
