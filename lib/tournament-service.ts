import type { Tournament, TournamentInsert } from "./database.types";

export async function submitTournament(
  insert: TournamentInsert
): Promise<{ data: Tournament | null; error: string | null }> {
  try {
    const response = await fetch("/api/tournaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(insert),
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      return { data: null, error: body?.error ?? `Error ${response.status}` };
    }
    return { data: body.data as Tournament, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : "Network error" };
  }
}
