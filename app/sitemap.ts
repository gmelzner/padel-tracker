import type { MetadataRoute } from "next";
import { getRecentSharedResults } from "@/lib/shared-result-queries";
import { getRecentPublishedTournaments } from "@/lib/tournament-queries";
import { getAllPosts } from "@/lib/blog";
import { locales } from "@/lib/i18n";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

// Regenerate sitemap every hour to include new shared results
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages that exist at the same path in every language
  const sharedPaths: {
    path: string;
    changeFrequency: "weekly" | "monthly" | "yearly";
    priority: number;
    lastModified?: Date;
  }[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/tracker", changeFrequency: "monthly", priority: 0.9 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
    { path: "/torneos", changeFrequency: "weekly", priority: 0.7 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3, lastModified: new Date("2025-01-29") },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3, lastModified: new Date("2025-01-29") },
  ];

  // The sitemap must still render if the database is unreachable
  const [sharedResults, tournaments] = await Promise.all([
    getRecentSharedResults(500).catch(() => []),
    getRecentPublishedTournaments(200).catch(() => []),
  ]);

  const localizedPages: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    ...sharedPaths.map(({ path, lastModified, ...rest }) => ({
      url: absoluteUrl(locale, path),
      lastModified: lastModified ?? new Date(),
      ...rest,
    })),
    // Each post exists only in its own language
    ...getAllPosts(locale).map((post) => ({
      url: absoluteUrl(locale, `/blog/${post.slug}`),
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...tournaments.map((tournament) => ({
      url: absoluteUrl(locale, `/torneos/${tournament.id}`),
      lastModified: new Date(tournament.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ]);

  // Shared results have one URL; the reader's language is resolved on arrival
  const resultPages: MetadataRoute.Sitemap = sharedResults.map((result) => ({
    url: `${SITE_URL}/r/${result.id}`,
    lastModified: new Date(result.created_at),
    changeFrequency: "never" as const,
    priority: 0.6,
  }));

  return [...localizedPages, ...resultPages];
}
