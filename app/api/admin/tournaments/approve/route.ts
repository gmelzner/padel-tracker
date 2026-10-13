import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { approveTournament } from "@/lib/tournament-queries";
import { isUuid } from "@/lib/db";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!isUuid(id)) {
    return NextResponse.json({ error: "Missing tournament id" }, { status: 400 });
  }

  try {
    await approveTournament(id);
  } catch (error) {
    console.error("[PadelTracker] approveTournament failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
