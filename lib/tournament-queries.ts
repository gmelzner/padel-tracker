/**
 * Tournaments and open courts. Server-only.
 * The public only ever sees rows that are approved and published.
 */

import { isUuid, query, queryOne } from "@/lib/db";
import type { Tournament, TournamentInsert } from "@/lib/database.types";

const IS_PUBLIC = "approved and status = 'published'";

export function getPublishedTournaments(): Promise<Tournament[]> {
  return query<Tournament>(
    `select * from tournaments where ${IS_PUBLIC} order by date_start asc nulls last`
  );
}

export async function getPublishedTournament(id: string): Promise<Tournament | null> {
  if (!isUuid(id)) return null;
  return queryOne<Tournament>(
    `select * from tournaments where id = $1 and ${IS_PUBLIC}`,
    [id]
  );
}

export function getRecentPublishedTournaments(
  limit: number
): Promise<Pick<Tournament, "id" | "updated_at">[]> {
  return query(
    `select id, updated_at from tournaments where ${IS_PUBLIC} order by created_at desc limit $1`,
    [limit]
  );
}

export async function getTotalTournaments(): Promise<number> {
  const row = await queryOne<{ total: number }>(
    `select count(*)::int as total from tournaments where ${IS_PUBLIC}`
  );
  return row?.total ?? 0;
}

export function getPendingTournaments(): Promise<Tournament[]> {
  return query<Tournament>(
    "select * from tournaments where not approved and status = 'pending' order by created_at desc"
  );
}

/** New submissions always start pending and unapproved, whatever the client sent. */
export function createTournament(
  userId: string,
  insert: TournamentInsert
): Promise<Tournament | null> {
  return queryOne<Tournament>(
    `insert into tournaments
       (name_es, name_en, description_es, description_en, city, address, date_start, date_end,
        type, category, price, contact_phone, contact_email, contact_whatsapp, external_url,
        image_url, submitted_by)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
     returning *`,
    [
      insert.name_es,
      insert.name_en,
      insert.description_es ?? null,
      insert.description_en ?? null,
      insert.city,
      insert.address ?? null,
      insert.date_start ?? null,
      insert.date_end ?? null,
      insert.type,
      insert.category ?? null,
      insert.price ?? null,
      insert.contact_phone ?? null,
      insert.contact_email ?? null,
      insert.contact_whatsapp ?? null,
      insert.external_url ?? null,
      insert.image_url ?? null,
      userId,
    ]
  );
}

export async function approveTournament(id: string): Promise<void> {
  await query(
    "update tournaments set approved = true, status = 'published', updated_at = now() where id = $1",
    [id]
  );
}

export async function rejectTournament(id: string): Promise<void> {
  await query("delete from tournaments where id = $1", [id]);
}
