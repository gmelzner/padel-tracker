import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, getPreferredLocale, setPreferredLocale } from "@/lib/auth";
import { isLocale } from "@/lib/i18n";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ preferred_locale: await getPreferredLocale(user.id) });
}

export async function PUT(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!isLocale(body?.preferred_locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  await setPreferredLocale(user.id, body.preferred_locale);
  return NextResponse.json({ success: true });
}
