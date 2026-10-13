/**
 * Loads .env.local for standalone scripts, without a dotenv dependency.
 * Variables already set in the shell win, including empty ones.
 */

import { readFileSync } from "fs";
import { resolve } from "path";

try {
  const envPath = resolve(__dirname, "..", ".env.local");
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].trim();
    }
  }
} catch {
  // env may come from the shell instead
}
