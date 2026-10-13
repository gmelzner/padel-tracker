import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createSharedResult, hasSharedResultCapacity } from "@/lib/shared-result-queries";
import { decodeMatchResults } from "@/lib/share-codec";

// An encoded match is a few KB
const MAXIMUM_ENCODED_BYTES = 100_000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { encodedData } = body;

    if (typeof encodedData === "string" && encodedData.length > MAXIMUM_ENCODED_BYTES) {
      return NextResponse.json({ error: "Result too large" }, { status: 413 });
    }
    if (!(await hasSharedResultCapacity())) {
      return NextResponse.json({ error: "Too many results, try again later" }, { status: 429 });
    }

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
    await createSharedResult({
      id,
      encoded_data: encodedData,
      player_names: playerNames,
      score_line: scoreLine,
      winning_team: decoded.winningTeam,
    });

    return NextResponse.json({ id });
  } catch (error) {
    console.error("[PadelTracker] share failed:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
