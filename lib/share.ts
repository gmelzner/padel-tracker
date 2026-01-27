import type { MatchState } from "./types";
import { encodeMatchResults } from "./share-codec";

export function generateResultsUrl(state: MatchState): string {
  const encoded = encodeMatchResults(state);
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/r#${encoded}`;
}

export function generateMatchSummary(state: MatchState): string {
  const { players, winningTeam, score } = state;
  const url = generateResultsUrl(state);

  const lines: string[] = [];

  if (winningTeam) {
    const winners = players.filter((p) => p.team === winningTeam);
    const drive = winners.find((p) => p.position === "drive");
    const reves = winners.find((p) => p.position === "reves");

    // Score line: "6-3 / 4-6 / 7-5"
    const scoreLine = score.completedSets
      .map((set) => {
        let s = `${set.games[0]}-${set.games[1]}`;
        if (set.tiebreakPlayed && set.tiebreakScore) {
          s += ` (${set.tiebreakScore[0]}-${set.tiebreakScore[1]})`;
        }
        return s;
      })
      .join(" / ");

    lines.push("🏆 ¡Partidazo jugado!");
    lines.push("");
    lines.push(
      `Felicitaciones a los ganadores: ${reves?.name ?? ""} en el revés y ${drive?.name ?? ""} en el drive.`
    );
    lines.push("");
    lines.push(scoreLine);
  } else {
    lines.push("🎾 ¡Partido terminado!");
  }

  lines.push("");
  lines.push(`Mirá las estadísticas completas acá 👇`);
  lines.push(url);

  return lines.join("\n");
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
