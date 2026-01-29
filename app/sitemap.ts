import type { MetadataRoute } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";

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

  return [...staticPages, ...resultPages];
}
