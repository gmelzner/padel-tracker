import type { Metadata } from "next";
import { MatchApp } from "@/components/match-app";

export const metadata: Metadata = {
  title: "Tracker",
  description:
    "Track your padel match live. Record winners, unforced errors, forced errors, and special shots. Real-time score and detailed statistics.",
  alternates: {
    canonical: "https://www.padeltracker.pro/tracker",
  },
};

export default function TrackerPage() {
  return <MatchApp />;
}
