import { createAdminSupabaseClient } from "@/lib/supabase-admin";

function getSupabase() {
  return createAdminSupabaseClient();
}

// --- Counts ---

export async function getTotalUsers(): Promise<number> {
  const { count } = await getSupabase()
    .from("profiles")
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function getTotalMatches(): Promise<number> {
  const { count } = await getSupabase()
    .from("matches")
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function getTotalShared(): Promise<number> {
  const { count } = await getSupabase()
    .from("shared_results")
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function getCountInRange(
  table: "matches" | "profiles" | "shared_results",
  dateColumn: string,
  from: string,
  to?: string
): Promise<number> {
  let query = getSupabase()
    .from(table)
    .select("*", { count: "exact", head: true })
    .gte(dateColumn, from);
  if (to) query = query.lt(dateColumn, to);
  const { count } = await query;
  return count ?? 0;
}

// --- Time series (last 30 days) ---

interface DailyCount {
  date: string;
  count: number;
}

function groupByDay(dates: string[]): DailyCount[] {
  const counts: Record<string, number> = {};

  // Initialize last 30 days with 0
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    counts[key] = 0;
  }

  for (const dateStr of dates) {
    const key = dateStr.slice(0, 10);
    if (key in counts) {
      counts[key]++;
    }
  }

  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}

export async function getUsersOverTime(): Promise<DailyCount[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data } = await getSupabase()
    .from("profiles")
    .select("created_at")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: true });

  return groupByDay((data ?? []).map((r) => r.created_at));
}

export async function getMatchesOverTime(): Promise<DailyCount[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data } = await getSupabase()
    .from("matches")
    .select("played_at")
    .gte("played_at", thirtyDaysAgo.toISOString())
    .order("played_at", { ascending: true });

  return groupByDay((data ?? []).map((r) => r.played_at));
}

export async function getSharedOverTime(): Promise<DailyCount[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data } = await getSupabase()
    .from("shared_results")
    .select("created_at")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: true });

  return groupByDay((data ?? []).map((r) => r.created_at));
}

// --- Active & frequent users ---

export async function getActiveUsers7d(): Promise<number> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data } = await getSupabase()
    .from("matches")
    .select("user_id")
    .gte("played_at", sevenDaysAgo.toISOString());

  const uniqueUsers = new Set((data ?? []).map((r) => r.user_id));
  return uniqueUsers.size;
}

export async function getFrequentUsers(): Promise<number> {
  const { data } = await getSupabase().from("matches").select("user_id");

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.user_id] = (counts[row.user_id] || 0) + 1;
  }

  return Object.values(counts).filter((c) => c >= 5).length;
}

// --- Top users ---

export interface TopUser {
  email: string;
  display_name: string | null;
  match_count: number;
  last_played: string;
}

export async function getTopUsers(): Promise<TopUser[]> {
  // Fetch all matches with user_id
  const { data: matches } = await getSupabase()
    .from("matches")
    .select("user_id, played_at");

  if (!matches || matches.length === 0) return [];

  // Aggregate match counts and last played per user
  const userStats: Record<string, { count: number; lastPlayed: string }> = {};
  for (const m of matches) {
    if (!userStats[m.user_id]) {
      userStats[m.user_id] = { count: 0, lastPlayed: m.played_at };
    }
    userStats[m.user_id].count++;
    if (m.played_at > userStats[m.user_id].lastPlayed) {
      userStats[m.user_id].lastPlayed = m.played_at;
    }
  }

  // Sort by count desc, take top 20
  const topUserIds = Object.entries(userStats)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 20);

  // Fetch profiles for top users
  const ids = topUserIds.map(([id]) => id);
  const supabase = getSupabase();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name")
    .in("id", ids);

  // Fetch auth users for emails
  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const emailMap: Record<string, string> = {};
  for (const u of authUsers?.users ?? []) {
    emailMap[u.id] = u.email ?? "";
  }

  const profileMap: Record<string, string | null> = {};
  for (const p of profiles ?? []) {
    profileMap[p.id] = p.display_name;
  }

  return topUserIds.map(([userId, stats]) => ({
    email: emailMap[userId] ?? "unknown",
    display_name: profileMap[userId] ?? null,
    match_count: stats.count,
    last_played: stats.lastPlayed,
  }));
}

// --- Last matches (shared results with public links) ---

export interface RecentMatch {
  id: string;
  player_names: string[];
  score_line: string;
  winning_team: number | null;
  created_at: string;
}

export async function getLastMatches(limit = 10): Promise<RecentMatch[]> {
  const { data } = await getSupabase()
    .from("shared_results")
    .select("id, player_names, score_line, winning_team, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as RecentMatch[];
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

// --- Tournament admin queries ---

import type { Tournament } from "@/lib/database.types";

export async function getPendingTournaments(): Promise<Tournament[]> {
  const { data } = await getSupabase()
    .from("tournaments")
    .select("*")
    .eq("approved", false)
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  return (data ?? []) as Tournament[];
}

export async function getTotalTournaments(): Promise<number> {
  const { count } = await getSupabase()
    .from("tournaments")
    .select("*", { count: "exact", head: true })
    .eq("approved", true)
    .eq("status", "published");
  return count ?? 0;
}

export async function approveTournament(
  id: string
): Promise<{ error: string | null }> {
  const { error } = await getSupabase()
    .from("tournaments")
    .update({ approved: true, status: "published" })
    .eq("id", id);
  return { error: error?.message ?? null };
}

export async function rejectTournament(
  id: string
): Promise<{ error: string | null }> {
  const { error } = await getSupabase().from("tournaments").delete().eq("id", id);
  return { error: error?.message ?? null };
}
