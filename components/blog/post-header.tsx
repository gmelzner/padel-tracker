"use client";

import { useTranslations } from "next-intl";
import type { BlogPostMeta } from "@/lib/blog";

interface PostHeaderProps {
  post: BlogPostMeta;
}

export function PostHeader({ post }: PostHeaderProps) {
  const t = useTranslations("blog");

  return (
    <header className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          {t(`categories.${post.category}`)}
        </span>
        <span className="text-sm text-slate-400">
          {new Date(post.date).toLocaleDateString(
            post.locale === "es" ? "es-AR" : "en-US",
            { year: "numeric", month: "long", day: "numeric" }
          )}
        </span>
      </div>
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
        {post.title}
      </h1>
      <p className="text-lg text-slate-500">{post.description}</p>
      <div className="mt-4 text-sm text-slate-400">
        {t("byAuthor", { author: post.author })}
      </div>
    </header>
  );
}
