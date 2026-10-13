/**
 * One-off import of the Supabase project into our own Postgres.
 *
 *   npx tsx scripts/import-from-supabase.ts
 *
 * Reads through the Supabase REST and auth admin APIs with the service role
 * key and inserts keeping the original ids, so matches stay linked to their
 * users. Safe to re-run: existing rows are left untouched.
 */

import { Client } from "pg";
import "./load-env";
import { getDatabaseConfig } from "../lib/db";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

type Row = Record<string, unknown>;

async function supabaseGet<T>(path: string): Promise<T> {
  const response = await fetch(`${supabaseUrl}${path}`, {
    headers: {
      apikey: serviceRoleKey ?? "",
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });
  if (!response.ok) {
    throw new Error(`${path} -> ${response.status} ${await response.text()}`);
  }
  return (await response.json()) as T;
}

async function insertRows(
  client: Client,
  table: string,
  columns: string[],
  jsonColumns: string[],
  rows: Row[]
): Promise<number> {
  const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
  let inserted = 0;
  for (const row of rows) {
    const values = columns.map((column) =>
      jsonColumns.includes(column) ? JSON.stringify(row[column]) : row[column]
    );
    const result = await client.query(
      `insert into ${table} (${columns.join(", ")}) values (${placeholders}) on conflict do nothing`,
      values
    );
    inserted += result.rowCount ?? 0;
  }
  return inserted;
}

async function main() {
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
    process.exit(1);
  }

  const client = new Client(getDatabaseConfig());
  await client.connect();

  const { users: authUsers } = await supabaseGet<{ users: Row[] }>(
    "/auth/v1/admin/users?per_page=1000"
  );
  const profiles = await supabaseGet<Row[]>("/rest/v1/profiles?select=*");
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));

  const users = authUsers
    .filter((authUser) => authUser.email)
    .map((authUser) => {
      const profile = profileById.get(authUser.id) ?? {};
      const metadata = (authUser.user_metadata ?? {}) as Row;
      return {
        id: authUser.id,
        email: String(authUser.email).toLowerCase(),
        display_name: profile.display_name ?? metadata.full_name ?? null,
        avatar_url: profile.avatar_url ?? metadata.avatar_url ?? null,
        preferred_locale: profile.preferred_locale ?? "en",
        created_at: profile.created_at ?? authUser.created_at,
        updated_at: profile.updated_at ?? authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at ?? null,
      };
    });

  const sharedResults = await supabaseGet<Row[]>("/rest/v1/shared_results?select=*");
  const matches = await supabaseGet<Row[]>("/rest/v1/matches?select=*");
  const tournaments = await supabaseGet<Row[]>("/rest/v1/tournaments?select=*");

  // Order matters: matches and tournaments reference users and shared_results
  const report = {
    users: await insertRows(
      client,
      "users",
      ["id", "email", "display_name", "avatar_url", "preferred_locale", "created_at", "updated_at", "last_sign_in_at"],
      [],
      users
    ),
    shared_results: await insertRows(
      client,
      "shared_results",
      ["id", "encoded_data", "player_names", "score_line", "winning_team", "created_at"],
      [],
      sharedResults
    ),
    matches: await insertRows(
      client,
      "matches",
      [
        "id", "user_id", "played_at", "team1_players", "team2_players", "winning_team", "user_team",
        "user_player_name", "sets_score", "total_points", "match_data", "source_shared_id", "created_at",
      ],
      ["sets_score", "match_data"],
      matches
    ),
    tournaments: await insertRows(
      client,
      "tournaments",
      [
        "id", "name_es", "name_en", "description_es", "description_en", "city", "address", "date_start",
        "date_end", "type", "category", "price", "contact_phone", "contact_email", "contact_whatsapp",
        "external_url", "image_url", "status", "submitted_by", "approved", "created_at", "updated_at",
      ],
      [],
      tournaments
    ),
  };

  console.log("read from Supabase:", {
    users: users.length,
    shared_results: sharedResults.length,
    matches: matches.length,
    tournaments: tournaments.length,
  });
  console.log("inserted now:", report);

  const totals = await client.query(
    `select (select count(*)::int from users) as users,
            (select count(*)::int from shared_results) as shared_results,
            (select count(*)::int from matches) as matches,
            (select count(*)::int from tournaments) as tournaments`
  );
  console.log("totals in our database:", totals.rows[0]);

  await client.end();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
