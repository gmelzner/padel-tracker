import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createMatch, getUserMatches } from "@/lib/match-queries";
import type { MatchInsert } from "@/lib/database.types";

// match_data holds the whole point-by-point history of a match
const MAXIMUM_BODY_BYTES = 1_000_000;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isTeam(value: unknown): boolean {
  return value === null || value === 1 || value === 2;
}

function isMatchInsert(value: unknown): value is MatchInsert {
  if (!value || typeof value !== "object") return false;
  const match = value as Record<string, unknown>;
  return (
    isStringArray(match.team1_players) &&
    isStringArray(match.team2_players) &&
    isTeam(match.winning_team) &&
    isTeam(match.user_team) &&
    (match.user_player_name === null || typeof match.user_player_name === "string") &&
    Array.isArray(match.sets_score) &&
    typeof match.total_points === "number" &&
    typeof match.match_data === "object" &&
    match.match_data !== null &&
    (match.source_shared_id === undefined || typeof match.source_shared_id === "string")
  );
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json({ data: await getUserMatches(user.id) });
  } catch (error) {
    console.error("[PadelTracker] getUserMatches failed:", error);
    return NextResponse.json({ error: "Failed to load matches" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const text = await request.text();
    if (text.length > MAXIMUM_BODY_BYTES) {
      return NextResponse.json({ error: "Match too large" }, { status: 413 });
    }

    const insert: unknown = JSON.parse(text);
    if (!isMatchInsert(insert)) {
      return NextResponse.json({ error: "Invalid match data" }, { status: 400 });
    }

    const { data, error } = await createMatch(user.id, insert);
    if (error) {
      return NextResponse.json({ error }, { status: 409 });
    }
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[PadelTracker] saveMatch failed:", error);
    return NextResponse.json({ error: "Failed to save match" }, { status: 500 });
  }
}
