import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createTournament } from "@/lib/tournament-queries";
import type { TournamentInsert } from "@/lib/database.types";

const MAXIMUM_BODY_BYTES = 20_000;
const TYPES = ["tournament", "open_court"];
const CATEGORIES = ["open", "amateur", "advanced", "pro"];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const OPTIONAL_TEXT_FIELDS = [
  "description_es",
  "description_en",
  "address",
  "price",
  "contact_phone",
  "contact_email",
  "contact_whatsapp",
  "external_url",
  "image_url",
] as const;

function isOptionalDate(value: unknown): boolean {
  return value === undefined || (typeof value === "string" && ISO_DATE.test(value));
}

function isTournamentInsert(value: unknown): value is TournamentInsert {
  if (!value || typeof value !== "object") return false;
  const tournament = value as Record<string, unknown>;
  return (
    typeof tournament.name_es === "string" &&
    tournament.name_es.trim() !== "" &&
    typeof tournament.name_en === "string" &&
    tournament.name_en.trim() !== "" &&
    typeof tournament.city === "string" &&
    TYPES.includes(tournament.type as string) &&
    (tournament.category === undefined || CATEGORIES.includes(tournament.category as string)) &&
    isOptionalDate(tournament.date_start) &&
    isOptionalDate(tournament.date_end) &&
    OPTIONAL_TEXT_FIELDS.every(
      (field) => tournament[field] === undefined || typeof tournament[field] === "string"
    )
  );
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const text = await request.text();
    if (text.length > MAXIMUM_BODY_BYTES) {
      return NextResponse.json({ error: "Submission too large" }, { status: 413 });
    }

    const insert: unknown = JSON.parse(text);
    if (!isTournamentInsert(insert)) {
      return NextResponse.json({ error: "Invalid tournament data" }, { status: 400 });
    }

    return NextResponse.json({ data: await createTournament(user.id, insert) });
  } catch (error) {
    console.error("[PadelTracker] submitTournament failed:", error);
    return NextResponse.json({ error: "Failed to submit tournament" }, { status: 500 });
  }
}
