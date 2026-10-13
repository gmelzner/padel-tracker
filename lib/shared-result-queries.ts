/**
 * Shared results (/r/<id>). Server-only.
 */

import { query, queryOne } from "@/lib/db";
import type { SharedResult, SharedResultInsert } from "@/lib/database.types";

// Sharing needs no account, so cap how fast the table can grow
const MAXIMUM_SHARED_RESULTS_PER_HOUR = 200;

export async function hasSharedResultCapacity(): Promise<boolean> {
  const row = await queryOne<{ recent: number }>(
    "select count(*)::int as recent from shared_results where created_at > now() - interval '1 hour'"
  );
  return (row?.recent ?? 0) < MAXIMUM_SHARED_RESULTS_PER_HOUR;
}

export async function createSharedResult(insert: SharedResultInsert): Promise<void> {
  await query(
    `insert into shared_results (id, encoded_data, player_names, score_line, winning_team)
     values ($1, $2, $3, $4, $5)`,
    [insert.id, insert.encoded_data, insert.player_names, insert.score_line, insert.winning_team]
  );
}

export function getSharedResult(id: string): Promise<SharedResult | null> {
  return queryOne<SharedResult>("select * from shared_results where id = $1", [id]);
}

export function getRecentSharedResults(
  limit: number
): Promise<Pick<SharedResult, "id" | "player_names" | "score_line" | "winning_team" | "created_at">[]> {
  return query(
    `select id, player_names, score_line, winning_team, created_at
     from shared_results
     order by created_at desc
     limit $1`,
    [limit]
  );
}
