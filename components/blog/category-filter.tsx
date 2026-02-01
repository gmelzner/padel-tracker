"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { BlogPostMeta, BlogCategory } from "@/lib/blog";
import { PostCard } from "./post-card";

interface CategoryFilterProps {
  posts: BlogPostMeta[];
}

const categories: (BlogCategory | "all")[] = [
  "all",
  "news",
  "tips",
  "professional",
  "guides",
];

export function CategoryFilter({ posts }: CategoryFilterProps) {
  const t = useTranslations("blog");
  const [active, setActive] = useState<BlogCategory | "all">("all");

  const filtered =
    active === "all" ? posts : posts.filter((p) => p.category === active);

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              active === cat
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat === "all" ? t("allCategories") : t(`categories.${cat}`)}
          </button>
        ))}
      </div>

      {/* Post grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-slate-400 py-12">{t("noPosts")}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
