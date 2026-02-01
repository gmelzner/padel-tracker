import { NextRequest, NextResponse } from "next/server";
import { getServerUser } from "@/lib/supabase-server-auth";
import { isAdmin } from "@/lib/admin";
import { approveTournament } from "@/lib/admin-queries";

export async function POST(req: NextRequest) {
  const user = await getServerUser();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Missing tournament id" }, { status: 400 });
  }

  const { error } = await approveTournament(id);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
