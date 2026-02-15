import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getServerUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // During build time, env vars may not be available
    return null;
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Read-only in server components
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
