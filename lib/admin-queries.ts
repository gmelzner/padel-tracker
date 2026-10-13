/**
 * Admin dashboard metrics. Server-only.
 */

import { query, queryOne } from "@/lib/db";
import { getRecentSharedResults } from "@/lib/shared-result-queries";

// Table and column names below are interpolated into SQL: they must stay
// literal unions, never values that come from a request.
type CountableTable = "users" | "matches" | "shared_results";
type DateColumn = "created_at" | "played_at";

// --- Counts ---

async function countRows(table: CountableTable): Promise<number> {
  const row = await queryOne<{ total: number }>(`select count(*)::int as total from ${table}`);
  return row?.total ?? 0;
}

export const getTotalUsers = () => countRows("users");
export const getTotalMatches = () => countRows("matches");
export const getTotalShared = () => countRows("shared_results");

export async function getCountInRange(
  table: CountableTable,
  dateColumn: DateColumn,
  from: string,
  to?: string
): Promise<number> {
  const row = await queryOne<{ total: number }>(
    `select count(*)::int as total from ${table}
     where ${dateColumn} >= $1 and ($2::timestamptz is null or ${dateColumn} < $2)`,
    [from, to ?? null]
  );
  return row?.total ?? 0;
}

// --- Time series (last 30 days, UTC days, zero-filled) ---

interface DailyCount {
  date: string;
  count: number;
}

function getDailyCounts(table: CountableTable, dateColumn: DateColumn): Promise<DailyCount[]> {
  return query<DailyCount>(
    `select to_char(day, 'YYYY-MM-DD') as date, count(rows.day_utc)::int as count
     from generate_series(
            (now() at time zone 'UTC')::date - 29,
            (now() at time zone 'UTC')::date,
            interval '1 day'
          ) as day
     left join (select (${dateColumn} at time zone 'UTC')::date as day_utc from ${table}) as rows
            on rows.day_utc = day::date
     group by day
     order by day`
  );
}

export const getUsersOverTime = () => getDailyCounts("users", "created_at");
export const getMatchesOverTime = () => getDailyCounts("matches", "played_at");
export const getSharedOverTime = () => getDailyCounts("shared_results", "created_at");

// --- Active & frequent users ---

export async function getActiveUsers7d(): Promise<number> {
  const row = await queryOne<{ total: number }>(
    "select count(distinct user_id)::int as total from matches where played_at >= now() - interval '7 days'"
  );
  return row?.total ?? 0;
}

export async function getFrequentUsers(): Promise<number> {
  const row = await queryOne<{ total: number }>(
    `select count(*)::int as total
     from (select user_id from matches group by user_id having count(*) >= 5) as frequent`
  );
  return row?.total ?? 0;
}

// --- Top users ---

export interface TopUser {
  email: string;
  display_name: string | null;
  match_count: number;
  last_played: string;
}

export function getTopUsers(): Promise<TopUser[]> {
  return query<TopUser>(
    `select users.email,
            users.display_name,
            count(*)::int as match_count,
            max(matches.played_at) as last_played
     from matches
     join users on users.id = matches.user_id
     group by users.id
     order by match_count desc
     limit 20`
  );
}

// --- Last matches (shared results with public links) ---

export interface RecentMatch {
  id: string;
  player_names: string[];
  score_line: string;
  winning_team: number | null;
  created_at: string;
}

export function getLastMatches(limit = 10): Promise<RecentMatch[]> {
  return getRecentSharedResults(limit);
}

// --- Date helpers ---

export function getStartOfWeek(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.getFullYear(), now.getMonth(), diff).toISOString();
}

export function getStartOfLastWeek(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1) - 7;
  return new Date(now.getFullYear(), now.getMonth(), diff).toISOString();
}

export function getStartOfMonth(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

export function getStartOfLastMonth(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
}
