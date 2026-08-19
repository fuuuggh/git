import { getPublicPosts } from "@/lib/posts";
import { getRequestLocale } from "@/lib/i18n-server";
import { messages } from "@/lib/i18n";
import { NookPostCard } from "@/components/main";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "Tutorials, learning notes, tool introductions and project records.",
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q, category } = await searchParams;
  const copy = messages[await getRequestLocale()].blog;
  const allPosts = await getPublicPosts();
  const posts = await getPublicPosts(q, category);
  const categories = Array.from(new Map(allPosts.filter((post) => post.categories).map((post) => [post.categories!.slug, post.categories!])).values());

  return <>
    <section className="rounded-3xl border border-border bg-card px-6 py-8 shadow-sm sm:px-8 sm:py-10">
      <p className="text-xs font-bold tracking-[0.16em] text-primary uppercase">{copy.eyebrow}</p>
      <h1 className="mt-3 text-4xl font-bold tracking-[-0.055em] text-foreground sm:text-5xl">{copy.title}</h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{copy.description}</p>
      <form className="mt-8 grid gap-3 sm:grid-cols-[1fr_12rem_auto]" action="/blog">
        <label htmlFor="blog-search" className="sr-only">{copy.search}</label>
        <input id="blog-search" name="q" defaultValue={q} placeholder={copy.search} className="rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20" />
        <select name="category" defaultValue={category} className="rounded-xl border border-input bg-card px-3 py-3 text-sm outline-none focus:border-primary"><option value="">{copy.allCategories}</option>{categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select>
        <button className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">{copy.filter}</button>
      </form>
    </section>
    <section className="py-10 sm:py-14">
      {posts.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{posts.map((post) => <NookPostCard key={post.id} post={post} fallbackCategory={copy.uncategorized} readLabel={copy.read} locale={copy.dateLocale} />)}</div> : <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center"><h2 className="font-semibold text-foreground">{copy.emptyTitle}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{copy.emptyDescription}</p></div>}
    </section>
  </>;
}
