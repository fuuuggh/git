import { getPostHtml, getPublicPost } from "@/lib/posts";
import { getRequestLocale } from "@/lib/i18n-server";
import { messages } from "@/lib/i18n";
import { sanitizeHtml } from "@/lib/utils";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";

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

  return <article className="mx-auto max-w-4xl py-2 sm:py-5">
    <header className="rounded-3xl border border-border bg-card px-6 py-9 shadow-sm sm:px-10 sm:py-12">
      <p className="text-xs font-bold tracking-[0.16em] text-primary uppercase">{post.categories?.name ?? copy.uncategorized}</p>
      <h1 className="mt-4 text-4xl font-bold tracking-[-0.06em] text-foreground sm:text-5xl lg:text-6xl">{post.title}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{post.description}</p>
      <div className="mt-7 flex flex-wrap gap-x-3 text-sm text-muted-foreground"><span>{date}</span><span>·</span><span>{post.profiles?.full_name ?? copy.siteAuthor}</span></div>
    </header>
    {post.cover_image_url ? <Image src={post.cover_image_url} alt={post.title} width={1440} height={810} className="mt-6 aspect-[16/9] w-full rounded-3xl border border-border object-cover shadow-sm" priority /> : null}
    <div className="prose prose-slate mx-auto mt-12 max-w-3xl dark:prose-invert prose-headings:tracking-[-0.04em] prose-p:leading-8 prose-img:rounded-2xl" dangerouslySetInnerHTML={{ __html: sanitizeHtml(getPostHtml(post.content)) }} />
  </article>;
}
