import { createClient } from "@supabase/supabase-js";

export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    // During build time, env vars may not be available.
    // Return a dummy URL so createClient doesn't throw.
    // Queries will fail gracefully (return empty data).
    return createClient("https://placeholder.supabase.co", "placeholder");
  }

  return createClient(url, key);
}
