import { NextResponse } from "next/server";
import { queryOne } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Used by the uptime check: 200 when the app can reach the database. */
export async function GET() {
  try {
    await queryOne("select 1");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[PadelTracker] health check failed:", error);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
