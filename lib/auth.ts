/**
 * Authentication: Google sign-in through NextAuth, sessions in a signed cookie.
 * Accounts live in our own Postgres (users table), keyed by email.
 */

import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { queryOne } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/tracker", error: "/tracker" },
  callbacks: {
    async jwt({ token, account }) {
      // `account` is only present right after a sign-in
      if (account && token.email) {
        const user = await queryOne<{ id: string }>(
          `insert into users (email, display_name, avatar_url, last_sign_in_at)
           values ($1, $2, $3, now())
           on conflict (email) do update set
             display_name = coalesce(excluded.display_name, users.display_name),
             avatar_url = coalesce(excluded.avatar_url, users.avatar_url),
             last_sign_in_at = now(),
             updated_at = now()
           returning id`,
          [token.email.toLowerCase(), token.name ?? null, token.picture ?? null]
        );
        token.userId = user?.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId;
      }
      return session;
    },
  },
};

export interface SessionUser {
  id: string;
  email: string;
}

/** The signed-in user, or null when there is no session. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  const email = session?.user?.email;
  return id && email ? { id, email } : null;
}

export async function getPreferredLocale(userId: string): Promise<string | null> {
  const row = await queryOne<{ preferred_locale: string }>(
    "select preferred_locale from users where id = $1",
    [userId]
  );
  return row?.preferred_locale ?? null;
}

export async function setPreferredLocale(userId: string, locale: string): Promise<void> {
  await queryOne(
    "update users set preferred_locale = $2, updated_at = now() where id = $1",
    [userId, locale]
  );
}
