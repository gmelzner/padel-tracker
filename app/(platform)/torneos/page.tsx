import type { Metadata } from "next";
import { createAdminSupabaseClient } from "@/lib/supabase-admin";
import { getServerLocale } from "@/lib/locale-server";
import { TournamentList } from "@/components/tournaments/tournament-list";
import type { Tournament } from "@/lib/database.types";

export const revalidate = 300; // 5 minutes

export const metadata: Metadata = {
  title: "Torneos y Canchas",
  description:
    "Find padel tournaments and open courts near you. Discover amateur and professional padel events in Buenos Aires.",
  alternates: {
    canonical: "https://padeltracker.pro/torneos",
  },
  openGraph: {
    title: "Torneos y Canchas - Padel Tracker",
    description:
      "Find padel tournaments and open courts near you. Discover amateur and professional padel events in Buenos Aires.",
    url: "https://padeltracker.pro/torneos",
    siteName: "Padel Tracker",
    type: "website",
  },
};

export default async function TorneosPage() {
  const locale = await getServerLocale();

  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from("tournaments")
    .select("*")
    .eq("approved", true)
    .eq("status", "published")
    .order("date_start", { ascending: true, nullsFirst: false });

  const tournaments = (data ?? []) as Tournament[];

  return (
    <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
      <TournamentList tournaments={tournaments} locale={locale} />
    </section>
  );
}
