import { getPublicResources } from "@/lib/resources";
import { createPublicClient } from "@/utils/supabase/public";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { ArrowUpRight, FileText, Search, Sparkles } from "lucide-react";
import { getRequestLocale } from "@/lib/i18n-server";
import { messages } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const copy = messages[await getRequestLocale()].search;
  const query = q?.trim() ?? "";
  const getPosts = unstable_cache(
    async () => {
      if (!query) return [];
      const supabase = createPublicClient();
      const { data } = await (supabase.from("posts" as never) as any)
        .select("id,title,slug,description,updated_at")
        .eq("published", true)
        .ilike("title", `%${query}%`)
        .order("updated_at", { ascending: false })
        .limit(8);
      return data ?? [];
    },
    ["public-post-search", query.toLocaleLowerCase()],
    { revalidate: 60, tags: ["posts"] },
  );
  const posts = await getPosts();
  const resources = query ? await getPublicResources(query) : [];

  return (
    <section className="py-4 sm:py-8">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">{copy.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.045em] text-foreground sm:text-4xl">{copy.title}</h1>
        <form action="/search" className="relative mt-7">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input name="q" defaultValue={query} autoFocus placeholder={copy.placeholder} className="w-full rounded-2xl border border-input bg-background py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-ring/15" />
        </form>
      </div>
      {!query ? <div className="mt-6 flex items-start gap-3 rounded-2xl border border-dashed border-border bg-secondary/40 p-5 text-sm leading-6 text-muted-foreground"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{copy.hint}</div> : (
        <div className="mt-10 space-y-10">
          <section><h2 className="flex items-center gap-2 text-lg font-bold tracking-[-0.03em] text-foreground"><FileText className="h-4 w-4 text-primary" />{copy.posts} <span className="text-sm font-normal text-muted-foreground">{posts?.length ?? 0}</span></h2>
            <div className="mt-4 space-y-3">{posts?.length ? posts.map((post) => <Link key={post.id} href={`/blog/${post.slug}`} className="group block rounded-2xl border border-border bg-card p-5 shadow-sm transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"><div className="flex gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><FileText className="h-4 w-4" /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-4"><h3 className="font-semibold tracking-[-0.02em] text-foreground">{post.title}</h3><ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-primary" /></div><p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{post.description}</p></div></div></Link>) : <p className="rounded-2xl border border-dashed border-border px-5 py-6 text-sm text-muted-foreground">{copy.noPosts}</p>}</div>
          </section>
          <section><h2 className="flex items-center gap-2 text-lg font-bold tracking-[-0.03em] text-foreground"><Sparkles className="h-4 w-4 text-primary" />{copy.resources} <span className="text-sm font-normal text-muted-foreground">{resources.length}</span></h2>
            <div className="mt-4 space-y-3">{resources.length ? resources.map((resource) => <Link key={resource.id} href={`/resources/${resource.slug}`} className="group block rounded-2xl border border-border bg-card p-5 shadow-sm transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"><div className="flex gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-sm font-bold text-primary">{resource.name.slice(0, 2).toUpperCase()}</div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-4"><h3 className="font-semibold tracking-[-0.02em] text-foreground">{resource.name}</h3><ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-primary" /></div><p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{resource.description}</p></div></div></Link>) : <p className="rounded-2xl border border-dashed border-border px-5 py-6 text-sm text-muted-foreground">{copy.noResources}</p>}</div>
          </section>
        </div>
      )}
    </section>
  );
}
