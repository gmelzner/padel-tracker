import type { Metadata } from "next";
import { getPublishedTournaments } from "@/lib/tournament-queries";
import { getServerLocale } from "@/lib/locale-server";
import { localizedAlternates, absoluteUrl, openGraphLocale } from "@/lib/seo";
import { TournamentList } from "@/components/tournaments/tournament-list";

const META = {
  en: {
    title: "Padel Tournaments & Courts",
    description:
      "Find padel tournaments and open courts in Argentina and Spain. Browse courts in Buenos Aires, Madrid, Barcelona, Córdoba, Rosario, and more.",
  },
  es: {
    title: "Torneos y canchas de pádel",
    description:
      "Encontrá torneos y canchas abiertas de pádel en Argentina y España: Buenos Aires, Madrid, Barcelona, Córdoba, Rosario y más.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const { title, description } = META[locale];
  return {
    title,
    description,
    alternates: localizedAlternates(locale, "/torneos"),
    openGraph: {
      title: `${title} - Padel Tracker`,
      description,
      url: absoluteUrl(locale, "/torneos"),
      siteName: "Padel Tracker",
      type: "website",
      locale: openGraphLocale(locale),
    },
  };
}

export default async function TorneosPage() {
  const locale = await getServerLocale();

  const tournaments = await getPublishedTournaments();

  return (
    <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
      <TournamentList tournaments={tournaments} locale={locale} />
    </section>
  );
}
