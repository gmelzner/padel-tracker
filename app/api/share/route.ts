import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { decodeMatchResults } from "@/lib/share-codec";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { encodedData } = body;

    if (!encodedData || typeof encodedData !== "string") {
      return NextResponse.json(
        { error: "Missing encodedData" },
        { status: 400 }
      );
    }

    const decoded = decodeMatchResults(encodedData);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid match data" },
        { status: 400 }
      );
    }

    const playerNames = decoded.players.map((p) => p.name);
    const scoreLine = decoded.completedSets
      .map((set) => {
        let s = `${set.games[0]}-${set.games[1]}`;
        if (set.tiebreakPlayed && set.tiebreakScore) {
          s += ` (${set.tiebreakScore[0]}-${set.tiebreakScore[1]})`;
        }
        return s;
      })
      .join(" / ");

    const id = nanoid(8);
    const supabase = createServerSupabaseClient();

    const { error } = await supabase.from("shared_results").insert({
      id,
      encoded_data: encodedData,
      player_names: playerNames,
      score_line: scoreLine,
      winning_team: decoded.winningTeam,
    });

    if (error) {
      // Handle nanoid collision — retry once
      if (error.code === "23505") {
        const retryId = nanoid(8);
        const { error: retryError } = await supabase
          .from("shared_results")
          .insert({
            id: retryId,
            encoded_data: encodedData,
            player_names: playerNames,
            score_line: scoreLine,
            winning_team: decoded.winningTeam,
          });
        if (retryError) {
          return NextResponse.json(
            { error: "Failed to save" },
            { status: 500 }
          );
        }
        return NextResponse.json({ id: retryId });
      }
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
