import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { decodeMatchResults } from "@/lib/share-codec";
import { SharedResultsView } from "./shared-results-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = createServerSupabaseClient();

  const { data } = await supabase
    .from("shared_results")
    .select("player_names, score_line, winning_team")
    .eq("id", id)
    .single();

  if (!data) {
    return { title: "Result not found - Padel Tracker" };
  }

  const { player_names, score_line, winning_team } = data;
  const team1 = `${player_names[0]} / ${player_names[1]}`;
  const team2 = `${player_names[2]} / ${player_names[3]}`;

  let title: string;
  let description: string;

  if (winning_team) {
    const winners = winning_team === 1 ? team1 : team2;
    title = `${winners} won! ${score_line}`;
    description = `${team1} vs ${team2} — ${score_line} | Full match stats on Padel Tracker`;
  } else {
    title = `${team1} vs ${team2}`;
    description = `Match results: ${score_line || "In progress"} | Full match stats on Padel Tracker`;
  }

  return {
    title: `${title} - Padel Tracker`,
    description,
    openGraph: {
      title,
      description,
      url: `https://padeltracker.pro/r/${id}`,
      siteName: "Padel Tracker",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function SharedResultPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createServerSupabaseClient();

  const { data } = await supabase
    .from("shared_results")
    .select("encoded_data")
    .eq("id", id)
    .single();

  if (!data) {
    notFound();
  }

  const decoded = decodeMatchResults(data.encoded_data);
  if (!decoded) {
    notFound();
  }

  return <SharedResultsView data={decoded} />;
}
