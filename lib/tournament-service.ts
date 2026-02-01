import { createClient } from "./supabase";
import type { Tournament, TournamentInsert, TournamentType } from "./database.types";

// --- Public queries (browser client, respects RLS) ---

export async function getPublishedTournaments(filters?: {
  city?: string;
  type?: TournamentType;
}): Promise<{ data: Tournament[]; error: string | null }> {
  const supabase = createClient();
  let query = supabase
    .from("tournaments")
    .select("*")
    .order("date_start", { ascending: true, nullsFirst: false });

  if (filters?.city) {
    query = query.eq("city", filters.city);
  }
  if (filters?.type) {
    query = query.eq("type", filters.type);
  }

  const { data, error } = await query;
  if (error) return { data: [], error: error.message };
  return { data: (data ?? []) as Tournament[], error: null };
}

export async function getTournamentById(
  id: string
): Promise<{ data: Tournament | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tournaments")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as Tournament, error: null };
}

// --- Authenticated mutations ---

export async function submitTournament(
  insert: TournamentInsert
): Promise<{ data: Tournament | null; error: string | null }> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tournaments")
    .insert(insert)
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as Tournament, error: null };
}
