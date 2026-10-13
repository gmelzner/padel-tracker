import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { getServerLocale } from "@/lib/locale-server";
import { localizedAlternates, absoluteUrl, openGraphLocale } from "@/lib/seo";
import { CategoryFilter } from "@/components/blog/category-filter";

const META = {
  en: {
    title: "Blog",
    description:
      "Padel strategy, tips, news, and guides. Learn how to improve your game with data-driven insights.",
  },
  es: {
    title: "Blog",
    description:
      "Estrategia, consejos, novedades y guías de pádel. Aprendé a mejorar tu juego con datos reales.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const { title, description } = META[locale];
  return {
    title,
    description,
    alternates: localizedAlternates(locale, "/blog"),
    openGraph: {
      title: `${title} - Padel Tracker`,
      description,
      url: absoluteUrl(locale, "/blog"),
      siteName: "Padel Tracker",
      type: "website",
      locale: openGraphLocale(locale),
    },
  };
}

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
