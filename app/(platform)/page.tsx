import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { TrackerCta } from "@/components/landing/tracker-cta";
import { FinalCta } from "@/components/landing/final-cta";

export const metadata: Metadata = {
  title: "Padel Tracker — Track your padel matches live",
  description:
    "Real-time padel match tracking with detailed statistics. Score tracking, player stats, momentum charts, and shareable results. Free, no registration required.",
  alternates: {
    canonical: "https://padeltracker.pro",
  },
  openGraph: {
    title: "Padel Tracker — Track your padel matches live",
    description:
      "Real-time padel match tracking with detailed statistics, shareable results, and match history.",
    url: "https://padeltracker.pro",
    siteName: "Padel Tracker",
    type: "website",
    locale: "es_AR",
    alternateLocale: "en_US",
  },
};

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <Features />
      <TrackerCta />
      <FinalCta />
    </div>
  );
}
