import type { MetadataRoute } from "next";
import { getRecentSharedResults } from "@/lib/shared-result-queries";
import { getRecentPublishedTournaments } from "@/lib/tournament-queries";
import { getAllSlugs } from "@/lib/blog";

// Regenerate sitemap every hour to include new shared results
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.padeltracker.pro";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/tracker`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/torneos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2025-01-29"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date("2025-01-29"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/r`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Dynamic shared results pages
  // The sitemap must still render if the database is unreachable
  const [sharedResults, tournaments] = await Promise.all([
    getRecentSharedResults(500).catch(() => []),
    getRecentPublishedTournaments(200).catch(() => []),
  ]);

  const resultPages: MetadataRoute.Sitemap = sharedResults.map(
    (result) => ({
      url: `${baseUrl}/r/${result.id}`,
      lastModified: new Date(result.created_at),
      changeFrequency: "never" as const,
      priority: 0.6,
    })
  );

  // Blog post pages
  const blogSlugs = getAllSlugs();
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Published tournament pages
  const tournamentPages: MetadataRoute.Sitemap = tournaments.map(
    (t) => ({
      url: `${baseUrl}/torneos/${t.id}`,
      lastModified: new Date(t.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  return [...staticPages, ...blogPages, ...tournamentPages, ...resultPages];
}
