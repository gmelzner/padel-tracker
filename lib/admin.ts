import { getSessionUser, type SessionUser } from "@/lib/auth";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * The signed-in user when they are an admin, otherwise null.
 * Every admin page, layout and route must call this itself: a layout check
 * does not stop its page from rendering and streaming data.
 */
export async function getAdminUser(): Promise<SessionUser | null> {
  const user = await getSessionUser();
  return user && isAdmin(user.email) ? user : null;
}
