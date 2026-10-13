import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedTournament } from "@/lib/tournament-queries";
import { getServerLocale } from "@/lib/locale-server";
import { localizedAlternates, absoluteUrl } from "@/lib/seo";
import { getCountryForCity } from "@/lib/city-utils";
import { TournamentDetail } from "@/components/tournaments/tournament-detail";
import type { Tournament } from "@/lib/database.types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const locale = await getServerLocale();

  const data = await getPublishedTournament(id);

  if (!data) {
    return { title: "Tournament not found" };
  }

  const tournament = data as Tournament;
  const name = locale === "es" ? tournament.name_es : tournament.name_en;
  const description =
    (locale === "es" ? tournament.description_es : tournament.description_en) ??
    `${name} - ${tournament.city}`;
  const path = `/torneos/${tournament.id}`;
  const url = absoluteUrl(locale, path);

  return {
    title: name,
    description,
    alternates: localizedAlternates(locale, path),
    openGraph: {
      title: `${name} - Padel Tracker`,
      description,
      url,
      siteName: "Padel Tracker",
      type: "article",
      locale: locale === "es" ? "es_AR" : "en_US",
      images: tournament.image_url ? [{ url: tournament.image_url }] : undefined,
    },
    twitter: {
      card: tournament.image_url ? "summary_large_image" : "summary",
      title: name,
      description,
      images: tournament.image_url ? [tournament.image_url] : undefined,
    },
  };
}

export default async function TournamentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const locale = await getServerLocale();

  const data = await getPublishedTournament(id);

  if (!data) {
    notFound();
  }

  const tournament = data as Tournament;
  const name = locale === "es" ? tournament.name_es : tournament.name_en;

  const jsonLd =
    tournament.type === "tournament"
      ? {
          "@context": "https://schema.org",
          "@type": "SportsEvent",
          name,
          description:
            (locale === "es"
              ? tournament.description_es
              : tournament.description_en) ?? undefined,
          startDate: tournament.date_start ?? undefined,
          endDate: tournament.date_end ?? undefined,
          location: {
            "@type": "Place",
            name: tournament.address ?? tournament.city,
            address: {
              "@type": "PostalAddress",
              addressLocality: tournament.city,
              addressCountry: getCountryForCity(tournament.city),
            },
          },
          image: tournament.image_url ?? undefined,
          url: `https://www.padeltracker.pro/torneos/${tournament.id}`,
          organizer: {
            "@type": "Organization",
            name: "Padel Tracker",
            url: "https://www.padeltracker.pro",
          },
        }
      : {
          "@context": "https://schema.org",
          "@type": "SportsActivityLocation",
          name,
          description:
            (locale === "es"
              ? tournament.description_es
              : tournament.description_en) ?? undefined,
          address: {
            "@type": "PostalAddress",
            streetAddress: tournament.address ?? undefined,
            addressLocality: tournament.city,
            addressCountry: getCountryForCity(tournament.city),
          },
          image: tournament.image_url ?? undefined,
          url: `https://www.padeltracker.pro/torneos/${tournament.id}`,
        };

  return (
    <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TournamentDetail tournament={tournament} locale={locale} />
    </article>
  );
}
