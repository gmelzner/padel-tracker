import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/social-proof";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { TrackerPreview } from "@/components/landing/tracker-preview";
import { UseCases } from "@/components/landing/use-cases";
import { TrackerCta } from "@/components/landing/tracker-cta";
import { getTotalMatches, getTotalShared, getTotalUsers } from "@/lib/admin-queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Padel Tracker — Track your padel matches live",
  description:
    "Real-time padel match tracking with detailed statistics. Score tracking, player stats, momentum charts, and shareable results. Free, no registration required.",
  alternates: {
    canonical: "https://www.padeltracker.pro",
  },
  openGraph: {
    title: "Padel Tracker — Track your padel matches live",
    description:
      "Real-time padel match tracking with detailed statistics, shareable results, and match history.",
    url: "https://www.padeltracker.pro",
    images: ["/opengraph-image"],
    siteName: "Padel Tracker",
    type: "website",
    locale: "es_AR",
    alternateLocale: "en_US",
  },
};

async function getSocialProofStats() {
  try {
    const [totalMatches, totalShared, totalUsers] = await Promise.all([
      getTotalMatches(),
      getTotalShared(),
      getTotalUsers(),
    ]);
    return { totalMatches, totalShared, totalUsers };
  } catch {
    return { totalMatches: 0, totalShared: 0, totalUsers: 0 };
  }
}

export default async function LandingPage() {
  const stats = await getSocialProofStats();

  return (
    <div>
      <Hero />
      <SocialProof
        totalMatches={stats.totalMatches}
        totalShared={stats.totalShared}
        totalUsers={stats.totalUsers}
      />
      <HowItWorks />
      <Features />
      <TrackerPreview />
      <UseCases />
      <TrackerCta />
    </div>
  );
}
