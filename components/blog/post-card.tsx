"use client";

import { useTranslations } from "next-intl";
import type { BlogPostMeta } from "@/lib/blog";

interface PostCardProps {
  post: BlogPostMeta;
}

export function PostCard({ post }: PostCardProps) {
  const t = useTranslations("blog");

  return (
    <a href={`/blog/${post.slug}`} className="group block">
      <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow h-full">
        {post.image && (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {t(`categories.${post.category}`)}
            </span>
            <span className="text-xs text-slate-400">
              {new Date(post.date).toLocaleDateString(
                post.locale === "es" ? "es-AR" : "en-US",
                { year: "numeric", month: "short", day: "numeric" }
              )}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-800 group-hover:text-slate-900 mb-2 line-clamp-2">
            {post.title}
          </h2>
          <p className="text-sm text-slate-500 line-clamp-2">
            {post.description}
          </p>
        </div>
      </article>
    </a>
  );
}
