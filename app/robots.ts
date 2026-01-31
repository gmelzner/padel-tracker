import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/profile", "/admin"],
      },
    ],
    sitemap: "https://padeltracker.pro/sitemap.xml",
  };
}
