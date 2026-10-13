/**
 * Postgres access. Self-hosted — plain pg, no ORM.
 *
 * Every query runs on the server, so nothing about the database reaches the
 * browser bundle.
 */

import { Pool, types, type PoolConfig, type QueryResultRow } from "pg";

// Rows go straight to client components and JSON responses, which expect the
// strings the app always worked with: ISO timestamps and YYYY-MM-DD dates.
types.setTypeParser(types.builtins.TIMESTAMPTZ, (value) =>
  new Date(value).toISOString()
);
types.setTypeParser(types.builtins.DATE, (value) => value);

declare global {
  var __padelTrackerPool: Pool | undefined;
}

/**
 * Connection settings shared by the app and the scripts.
 * The server uses a certificate signed by our own CA: when
 * DATABASE_CA_CERTIFICATE_BASE64 is set the connection is TLS and verified
 * against it. Do not put sslmode in DATABASE_URL — pg would ignore this CA.
 */
export function getDatabaseConfig(): PoolConfig {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set — see README");
  }
  const certificate = process.env.DATABASE_CA_CERTIFICATE_BASE64;
  return {
    connectionString,
    ssl: certificate
      ? { ca: Buffer.from(certificate, "base64").toString("utf-8") }
      : undefined,
  };
}

/** Reused across invocations and hot reloads so we don't leak connections. */
function getPool(): Pool {
  if (!global.__padelTrackerPool) {
    global.__padelTrackerPool = new Pool({
      ...getDatabaseConfig(),
      max: 3,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }
  return global.__padelTrackerPool;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Ids come from URLs and request bodies; Postgres raises on a malformed uuid. */
export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value);
}

/** Run a parameterised query. Never interpolate values into SQL strings. */
export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await getPool().query<T>(text, params);
  return result.rows;
}

/** Run a query expected to return at most one row. */
export async function queryOne<T extends QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
