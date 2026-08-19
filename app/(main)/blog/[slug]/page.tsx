import { getPostHtml, getPublicPost } from "@/lib/posts";
import { getRequestLocale } from "@/lib/i18n-server";
import { messages } from "@/lib/i18n";
import { sanitizeHtml } from "@/lib/utils";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.description },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const copy = messages[await getRequestLocale()].blog;
  const post = await getPublicPost(slug);
  if (!post) notFound();
  const date = new Intl.DateTimeFormat(copy.dateLocale, { year: "numeric", month: "long", day: "numeric" }).format(new Date(post.published_at ?? post.updated_at));

  return <article className="mx-auto max-w-3xl py-4 sm:py-10">
    <p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">{post.categories?.name ?? copy.uncategorized}</p>
    <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl">{post.title}</h1>
    <p className="mt-5 text-lg leading-8 text-muted-foreground">{post.description}</p>
    <div className="mt-6 flex flex-wrap gap-x-3 text-sm text-muted-foreground"><span>{date}</span><span>·</span><span>{post.profiles?.full_name ?? copy.siteAuthor}</span></div>
    <div className="prose prose-slate mt-12 max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: sanitizeHtml(getPostHtml(post.content)) }} />
  </article>;
}
