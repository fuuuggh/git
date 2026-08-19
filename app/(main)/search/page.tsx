import { getPublicResources } from "@/lib/resources";
import { createPublicClient } from "@/utils/supabase/public";
import { unstable_cache } from "next/cache";
import Link from "next/link";
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
      <p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">{copy.eyebrow}</p>
      <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-foreground">{copy.title}</h1>
      <form action="/search" className="mt-7"><input name="q" defaultValue={query} autoFocus placeholder={copy.placeholder} className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20" /></form>
      {!query ? <p className="mt-8 text-muted-foreground">{copy.hint}</p> : (
        <div className="mt-10 space-y-10">
          <section><h2 className="text-lg font-bold text-foreground">{copy.posts} <span className="text-sm font-normal text-muted-foreground">{posts?.length ?? 0}</span></h2>
            <div className="mt-4 space-y-3">{posts?.length ? posts.map((post) => <Link key={post.id} href={`/posts/${post.slug}`} className="block rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"><h3 className="font-semibold text-foreground">{post.title}</h3><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{post.description}</p></Link>) : <p className="text-sm text-muted-foreground">{copy.noPosts}</p>}</div>
          </section>
          <section><h2 className="text-lg font-bold text-foreground">{copy.resources} <span className="text-sm font-normal text-muted-foreground">{resources.length}</span></h2>
            <div className="mt-4 space-y-3">{resources.length ? resources.map((resource) => <Link key={resource.id} href={`/resources/${resource.slug}`} className="block rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"><h3 className="font-semibold text-foreground">{resource.name}</h3><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{resource.description}</p></Link>) : <p className="text-sm text-muted-foreground">{copy.noResources}</p>}</div>
          </section>
        </div>
      )}
    </section>
  );
}
