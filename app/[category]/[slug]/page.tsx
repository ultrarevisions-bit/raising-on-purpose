import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { mdxComponents } from "@/components/mdx-components";
import { CategoryBadge } from "@/components/category-badge";
import { ShareButtons } from "@/components/share-buttons";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { AdSlot } from "@/components/ad-slot";
import { TableOfContents } from "@/components/table-of-contents";
import { PostGrid } from "@/components/post-grid";
import { DownloadCard } from "@/components/download-card";
import { siteConfig } from "@/lib/site";
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { getCategoryBySlug } from "@/lib/categories";
import {
  estimateReadTime,
  formatDate,
  formatDateISO,
} from "@/lib/utils";

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPostSlugs();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${siteConfig.url}/${post.category}/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/${post.category}/${post.slug}` },
    keywords: post.keywords?.join(", ") ?? post.category,
    authors: [{ name: post.author ?? siteConfig.name }],
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: formatDateISO(post.date),
      modifiedTime: post.updated ? formatDateISO(post.updated) : undefined,
      authors: [post.author ?? siteConfig.name],
      tags: [post.category],
      images: [
        {
          url: siteConfig.url + post.featuredImage,
          width: 1200,
          height: 1800,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [siteConfig.url + post.featuredImage],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { category, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const categoryMeta = getCategoryBySlug(post.category);
  const related = getRelatedPosts(post.slug);
  const url = `${siteConfig.url}/${post.category}/${post.slug}`;
  const readTime = estimateReadTime(post.content);
  const updatedISO = post.updated ? formatDateISO(post.updated) : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: siteConfig.url + post.featuredImage,
    datePublished: formatDateISO(post.date),
    ...(updatedISO ? { dateModified: updatedISO } : {}),
    author: {
      "@type": "Person",
      name: post.author ?? siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: url,
    keywords: post.keywords?.join(", ") ?? post.category,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryMeta?.name ?? post.category,
        item: `${siteConfig.url}/${post.category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: url,
      },
    ],
  };

  return (
    <article className="mx-auto max-w-6xl px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="pt-6 text-xs text-ink-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="no-underline hover:text-terracotta-600">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/${post.category}`} className="no-underline hover:text-terracotta-600">
              {categoryMeta?.name ?? post.category}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink-muted">
            {post.title.length > 40 ? post.title.slice(0, 40) + "..." : post.title}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mx-auto max-w-3xl py-8 text-center">
        <CategoryBadge category={post.category} />
        <h1 className="mt-4 font-heading text-3xl leading-tight sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-ink-muted">
          <span>By {post.author ?? siteConfig.name}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={formatDateISO(post.date)}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{readTime} min read</span>
          {post.stage && (
            <>
              <span aria-hidden="true">·</span>
              <span className="capitalize">Ages {post.stage}</span>
            </>
          )}
        </div>
        {post.updated && (
          <p className="mt-2 text-xs text-ink-muted">
            Last updated {formatDate(post.updated)}
          </p>
        )}
        <div className="mt-6 flex justify-center">
          <ShareButtons
            title={post.title}
            slug={post.slug}
            category={post.category}
            featuredImage={post.featuredImage}
          />
        </div>
      </header>

      {/* Hero image */}
      <div className="relative mx-auto aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-2xl">
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
          priority
        />
      </div>

      {/* Body */}
      <div className="mx-auto mt-10 grid max-w-3xl gap-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_240px]">
          <div className="min-w-0">
            <div className="prose">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeSlug],
                  },
                }}
              />
            </div>

            {post.download && (
              <DownloadCard
                title={post.downloadTitle ?? "Free printable"}
                href={post.download}
              />
            )}

            <AdSlot className="my-10" slot={`post-inline-${post.slug}`} />

            <div className="mt-8 border-t border-cream-300 pt-6">
              <ShareButtons
                title={post.title}
                slug={post.slug}
                category={post.category}
                featuredImage={post.featuredImage}
              />
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <TableOfContents content={post.content} />
              <AdSlot className="min-h-[250px]" slot={`post-sidebar-${post.slug}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Author box */}
      <section aria-label="About the author" className="mx-auto mt-12 max-w-3xl rounded-2xl border border-cream-300 bg-cream-50 p-6 sm:p-8">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-terracotta-500 font-heading text-2xl font-semibold text-white">
            R
          </div>
          <div>
            <h2 className="font-heading text-lg font-semibold">By {post.author ?? siteConfig.name}</h2>
            <p className="mt-1 text-sm text-ink-light">
              {siteConfig.author.bio} More essays and printables in the{" "}
              <Link href={`/${post.category}`} className="no-underline hover:text-terracotta-600">
                {categoryMeta?.name.toLowerCase()}
              </Link>{" "}
              section.
            </p>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mx-auto mt-14 max-w-6xl">
          <h2 id="related-heading" className="mb-6 text-center font-heading text-2xl sm:text-3xl">
            Keep reading
          </h2>
          <PostGrid posts={related} />
        </section>
      )}

      {/* Newsletter */}
      <section aria-label="Newsletter" className="mx-auto mt-14 max-w-2xl pb-4">
        <NewsletterSignup context="post" />
      </section>
    </article>
  );
}