import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { type Locale } from "@/lib/i18n";

export type BlogCategory = "news" | "tips" | "professional" | "guides" | "gear";

export interface BlogPostMeta {
  title: string;
  slug: string;
  date: string;
  author: string;
  category: BlogCategory;
  description: string;
  image: string;
  locale: Locale;
  alternateSlug?: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function getPostDir(locale: Locale): string {
  return path.join(CONTENT_DIR, locale);
}

function parsePost(filePath: string): BlogPost {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    title: data.title,
    slug: data.slug,
    date: data.date,
    author: data.author,
    category: data.category,
    description: data.description,
    image: data.image ?? "",
    locale: data.locale,
    alternateSlug: data.alternateSlug,
    content,
  };
}

export function getAllPosts(locale: Locale): BlogPostMeta[] {
  const dir = getPostDir(locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const { content: _, ...meta } = parsePost(path.join(dir, f));
      return meta;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string, locale: Locale): BlogPost | null {
  const filePath = path.join(getPostDir(locale), `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return parsePost(filePath);
}

export function getLatestPosts(locale: Locale, count: number): BlogPostMeta[] {
  return getAllPosts(locale).slice(0, count);
}

export function getCategories(): BlogCategory[] {
  return ["news", "tips", "professional", "guides", "gear"];
}

export function getAllSlugs(): string[] {
  const slugs = new Set<string>();
  for (const locale of ["en", "es"] as Locale[]) {
    const dir = getPostDir(locale);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
      slugs.add(f.replace(/\.mdx$/, ""));
    }
  }
  return [...slugs];
}
