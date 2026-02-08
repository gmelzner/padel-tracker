import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { getServerLocale } from "@/lib/locale-server";
import { CategoryFilter } from "@/components/blog/category-filter";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Padel strategy, tips, news, and guides. Learn how to improve your game with data-driven insights.",
  alternates: {
    canonical: "https://www.padeltracker.pro/blog",
  },
  openGraph: {
    title: "Blog - Padel Tracker",
    description:
      "Padel strategy, tips, news, and guides. Learn how to improve your game with data-driven insights.",
    url: "https://www.padeltracker.pro/blog",
    siteName: "Padel Tracker",
    type: "website",
  },
};

export default async function BlogPage() {
  const locale = await getServerLocale();
  const posts = getAllPosts(locale);

  return (
    <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-8">
        Blog
      </h1>
      <CategoryFilter posts={posts} />
    </section>
  );
}
