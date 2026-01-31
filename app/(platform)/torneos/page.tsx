import type { Metadata } from "next";
import { ComingSoon } from "@/components/platform/coming-soon";

export const metadata: Metadata = {
  title: "Torneos",
  description:
    "Find padel tournaments near you, register your team, and follow results. Discover amateur and professional padel events.",
  alternates: {
    canonical: "https://padeltracker.pro/torneos",
  },
};

export default function TorneosPage() {
  return (
    <ComingSoon
      icon="tournaments"
      descKey="tournamentsDesc"
    />
  );
}
