import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { getServerLocale } from "@/lib/locale-server";
import { blogMdxComponents } from "@/components/blog/mdx-components";
import { PostHeader } from "@/components/blog/post-header";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getServerLocale();
  const post =
    getPostBySlug(slug, locale) ??
    getPostBySlug(slug, locale === "en" ? "es" : "en");

  if (!post) {
    return { title: "Post not found" };
  }

  const url = `https://padeltracker.pro/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    alternates: {
      canonical: url,
      languages: post.alternateSlug
        ? {
            en: `/blog/${locale === "en" ? post.slug : post.alternateSlug}`,
            es: `/blog/${locale === "es" ? post.slug : post.alternateSlug}`,
          }
        : undefined,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: "Padel Tracker",
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      locale: post.locale === "es" ? "es_AR" : "en_US",
      images: post.image ? [{ url: post.image }] : undefined,
    },
    twitter: {
      card: post.image ? "summary_large_image" : "summary",
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getServerLocale();

  // Try user's locale first, then fall back to the other
  let post = getPostBySlug(slug, locale);
  if (!post) {
    post = getPostBySlug(slug, locale === "en" ? "es" : "en");
  }
  if (!post) {
    notFound();
  }

  const { content } = await compileMDX({
    source: post.content,
    components: blogMdxComponents,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    author: { "@type": "Person", name: post.author },
    datePublished: post.date,
    image: post.image
      ? `https://padeltracker.pro${post.image}`
      : undefined,
    url: `https://padeltracker.pro/blog/${post.slug}`,
    publisher: {
      "@type": "Organization",
      name: "Padel Tracker",
      url: "https://padeltracker.pro",
    },
    inLanguage: post.locale,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://padeltracker.pro/blog/${post.slug}`,
    },
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostHeader post={post} />
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full rounded-2xl mb-8 aspect-[16/9] object-cover"
        />
      )}
      <div>{content}</div>
      <div className="mt-12 pt-8 border-t border-slate-200">
        <a
          href="/blog"
          className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          &larr; Blog
        </a>
      </div>
    </article>
  );
}
