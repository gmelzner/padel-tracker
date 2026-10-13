import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getPostBySlug, getAllSlugs, type BlogPostMeta } from "@/lib/blog";
import { type Locale, defaultLocale, localizePath } from "@/lib/i18n";
import { SITE_URL, openGraphLocale } from "@/lib/seo";
import { getServerLocale } from "@/lib/locale-server";
import { blogMdxComponents } from "@/components/blog/mdx-components";
import { PostHeader } from "@/components/blog/post-header";
import { LocaleLink } from "@/components/locale-link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

/**
 * A post lives at one URL: /blog/<slug> in English, /es/blog/<slug> in Spanish.
 * When the slug belongs to the other language, say where the reader should go.
 */
function resolvePost(slug: string, locale: Locale) {
  const post = getPostBySlug(slug, locale);
  if (post) return { post, redirectTo: null };

  const other = getPostBySlug(slug, locale === "en" ? "es" : "en");
  if (!other) return { post: null, redirectTo: null };

  // Unprefixed URL of a Spanish post (the pre-/es address): send it home
  if (locale === defaultLocale) {
    return { post: other, redirectTo: postPath(other) };
  }
  // /es/<english slug>: prefer its translation. Without one, show it here
  // rather than bounce between this URL and the reader's language redirect.
  const translation = other.alternateSlug && getPostBySlug(other.alternateSlug, locale);
  return { post: other, redirectTo: translation ? postPath(translation) : null };
}

function postPath(post: BlogPostMeta): string {
  return localizePath(post.locale, `/blog/${post.slug}`);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { post } = resolvePost(slug, await getServerLocale());

  if (!post) {
    return { title: "Post not found" };
  }

  const url = `${SITE_URL}${postPath(post)}`;
  const translation =
    post.alternateSlug &&
    getPostBySlug(post.alternateSlug, post.locale === "en" ? "es" : "en");

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    alternates: {
      canonical: url,
      languages: translation
        ? {
            [post.locale]: url,
            [translation.locale]: `${SITE_URL}${postPath(translation)}`,
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
      locale: openGraphLocale(post.locale),
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
  const { post, redirectTo } = resolvePost(slug, await getServerLocale());

  if (!post) {
    notFound();
  }
  if (redirectTo) {
    permanentRedirect(redirectTo);
  }

  const url = `${SITE_URL}${postPath(post)}`;

  const { content } = await compileMDX({
    source: post.content,
    components: blogMdxComponents,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    author: { "@type": "Person", name: post.author },
    datePublished: post.date,
    image: post.image
      ? `${SITE_URL}${post.image}`
      : undefined,
    url,
    publisher: {
      "@type": "Organization",
      name: "Padel Tracker",
      url: SITE_URL,
    },
    inLanguage: post.locale,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
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
        <LocaleLink
          href="/blog"
          className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          &larr; Blog
        </LocaleLink>
      </div>
    </article>
  );
}
