import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/social-proof";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { TrackerPreview } from "@/components/landing/tracker-preview";
import { UseCases } from "@/components/landing/use-cases";
import { TrackerCta } from "@/components/landing/tracker-cta";
import { getServerLocale } from "@/lib/locale-server";
import { localizedAlternates, absoluteUrl, openGraphLocale } from "@/lib/seo";
import { getTotalMatches, getTotalShared, getTotalUsers } from "@/lib/admin-queries";

const META = {
  en: {
    title: "Padel Tracker — Track your padel matches live",
    description:
      "Real-time padel match tracking with detailed statistics. Score tracking, player stats, momentum charts, and shareable results. Free, no registration required.",
  },
  es: {
    title: "Padel Tracker — Marcador y estadísticas de pádel en vivo",
    description:
      "Llevá el marcador de tu partido de pádel punto por punto y obtené estadísticas por jugador, rachas y momentum. Gratis, sin registrarte, y con link para compartir el resultado.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const { title, description } = META[locale];
  return {
    title: { absolute: title },
    description,
    alternates: localizedAlternates(locale, "/"),
    openGraph: {
      title,
      description,
      url: absoluteUrl(locale, "/"),
      images: ["/opengraph-image"],
      siteName: "Padel Tracker",
      type: "website",
      locale: openGraphLocale(locale),
    },
  };
}

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
