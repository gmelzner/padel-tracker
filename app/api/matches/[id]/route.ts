import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { deleteUserMatch } from "@/lib/match-queries";
import { isUuid } from "@/lib/db";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!isUuid(id)) {
    return NextResponse.json({ error: "Invalid match id" }, { status: 400 });
  }

  try {
    await deleteUserMatch(user.id, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PadelTracker] deleteMatch failed:", error);
    return NextResponse.json({ error: "Failed to delete match" }, { status: 500 });
  }
}
