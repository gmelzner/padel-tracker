/**
 * Migration runner. Plain SQL files, applied in filename order, each inside a
 * transaction, recorded in schema_migrations so re-running is a no-op.
 *
 *   npm run db:migrate
 *
 * Standalone: loads .env.local (see load-env.ts), no Next.js runtime.
 */

import { readFileSync, readdirSync } from "fs";
import { resolve, join } from "path";
import { Client } from "pg";
import "./load-env";
import { getDatabaseConfig } from "../lib/db";

const MIGRATIONS_DIR = resolve(__dirname, "..", "db", "migrations");

async function main() {
  const client = new Client(getDatabaseConfig());
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename    text PRIMARY KEY,
      applied_at  timestamptz NOT NULL DEFAULT now()
    )
  `);

  const applied = new Set(
    (await client.query<{ filename: string }>("SELECT filename FROM schema_migrations")).rows.map(
      (r) => r.filename
    )
  );

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  let count = 0;
  for (const file of files) {
    if (applied.has(file)) continue;

    const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf-8");
    process.stdout.write(`  applying ${file} ... `);
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [file]);
      await client.query("COMMIT");
      console.log("ok");
      count++;
    } catch (error) {
      await client.query("ROLLBACK");
      console.log("FAILED");
      console.error(error instanceof Error ? error.message : error);
      await client.end();
      process.exit(1);
    }
  }

  console.log(count === 0 ? "Nothing to apply — schema is current." : `Applied ${count} migration(s).`);
  await client.end();
}

main();
