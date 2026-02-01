import type { MetadataRoute } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getAllSlugs } from "@/lib/blog";

// Regenerate sitemap every hour to include new shared results
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://padeltracker.pro";

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
  const supabase = createServerSupabaseClient();
  const { data: sharedResults } = await supabase
    .from("shared_results")
    .select("id, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  const resultPages: MetadataRoute.Sitemap = (sharedResults ?? []).map(
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

  return [...staticPages, ...blogPages, ...resultPages];
}
