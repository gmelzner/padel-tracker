import type { MatchState } from "./types";
import { encodeMatchResults } from "./share-codec";

type TranslateFn = (key: string, values?: Record<string, string>) => string;

// Legacy sync URL (hash-based, used as fallback)
export function generateResultsUrl(state: MatchState): string {
  const encoded = encodeMatchResults(state);
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/r#${encoded}`;
}

// New async URL — saves to Supabase, returns short URL
export async function createShareUrl(state: MatchState): Promise<string> {
  const encoded = encodeMatchResults(state);
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  try {
    const res = await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ encodedData: encoded }),
    });

    if (!res.ok) {
      return `${origin}/r#${encoded}`;
    }

    const { id } = await res.json();
    return `${origin}/r/${id}`;
  } catch {
    return `${origin}/r#${encoded}`;
  }
}

// Build share text with a known URL (for cached subsequent calls)
export function buildShareTextWithUrl(
  state: MatchState,
  t: TranslateFn,
  url: string
): string {
  const { players, winningTeam, score } = state;
  const lines: string[] = [];

  if (winningTeam) {
    const winners = players.filter((p) => p.team === winningTeam);
    const drive = winners.find((p) => p.position === "drive");
    const reves = winners.find((p) => p.position === "reves");

    const scoreLine = score.completedSets
      .map((set) => {
        let s = `${set.games[0]}-${set.games[1]}`;
        if (set.tiebreakPlayed && set.tiebreakScore) {
          s += ` (${set.tiebreakScore[0]}-${set.tiebreakScore[1]})`;
        }
        return s;
      })
      .join(" / ");

    lines.push(`🏆 ${t("shareText.greatMatch")}`);
    lines.push("");
    lines.push(
      t("shareText.congratulations", {
        backhand: reves?.name ?? "",
        forehand: drive?.name ?? "",
      })
    );
    lines.push("");
    lines.push(scoreLine);
  } else {
    lines.push(`🎾 ${t("shareText.matchEnded")}`);
  }

  lines.push("");
  lines.push(`${t("shareText.viewStats")} 👇`);
  lines.push(url);

  return lines.join("\n");
}

// Legacy sync version (kept for backward compat)
export function generateMatchSummary(
  state: MatchState,
  t: TranslateFn
): string {
  const url = generateResultsUrl(state);
  return buildShareTextWithUrl(state, t, url);
}

// Async version — creates short URL first
export async function generateMatchSummaryAsync(
  state: MatchState,
  t: TranslateFn
): Promise<{ text: string; url: string }> {
  const url = await createShareUrl(state);
  const text = buildShareTextWithUrl(state, t, url);
  return { text, url };
}

export async function shareViaWhatsApp(text: string) {
  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/?text=${encoded}`, "_blank");
}

export async function shareNative(text: string): Promise<boolean> {
  if (!navigator.share) return false;
  try {
    await navigator.share({ text });
    return true;
  } catch {
    return false;
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
