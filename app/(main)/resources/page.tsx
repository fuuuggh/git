import MainResourceCard from "@/components/main/resource/main-resource-card";
import { getPublicResources } from "@/lib/resources";
import Link from "next/link";

export const revalidate = 60;

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; pricing?: "free" | "freemium" | "open_source"; platform?: string; openSource?: string; sort?: "updated" | "name" }>;
}) {
  const { q, category, pricing, platform, openSource, sort } = await searchParams;
  const allResources = await getPublicResources();
  const resources = await getPublicResources(q?.trim(), {
    category,
    pricing,
    platform,
    openSource: openSource === "true",
    sort,
  });
  const categories = Array.from(new Map(allResources.filter((resource) => resource.categories).map((resource) => [resource.categories!.slug, resource.categories!])).values());
  const platforms = Array.from(new Set(allResources.flatMap((resource) => resource.platforms))).sort();

  return (
    <>
      <section className="border-b border-border pb-10 pt-4 sm:pb-14 sm:pt-8">
        <p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">资源库</p>
        <div className="mt-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-[-0.04em] text-foreground">免费且值得使用的资源。</h1>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">优先收录免费工具、开源项目与可靠学习资源，并持续检查链接状态。</p>
          </div>
          <Link href="/submit" className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent">推荐资源</Link>
        </div>
        <form className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" action="/resources">
          <label htmlFor="resource-search" className="sr-only">搜索资源</label>
          <input id="resource-search" name="q" defaultValue={q} placeholder="搜索资源名称或标签…" className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20 sm:col-span-2" />
          <select name="category" defaultValue={category} className="rounded-xl border border-input bg-card px-3 py-3 text-sm outline-none focus:border-primary"><option value="">全部分类</option>{categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select>
          <select name="pricing" defaultValue={pricing} className="rounded-xl border border-input bg-card px-3 py-3 text-sm outline-none focus:border-primary"><option value="">全部价格</option><option value="free">免费</option><option value="open_source">开源</option><option value="freemium">免费增值</option></select>
          <select name="platform" defaultValue={platform} className="rounded-xl border border-input bg-card px-3 py-3 text-sm outline-none focus:border-primary"><option value="">全部平台</option>{platforms.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          <label className="flex items-center gap-2 rounded-xl border border-input bg-card px-3 py-3 text-sm"><input type="checkbox" name="openSource" value="true" defaultChecked={openSource === "true"} />仅开源</label>
          <select name="sort" defaultValue={sort} className="rounded-xl border border-input bg-card px-3 py-3 text-sm outline-none focus:border-primary"><option value="updated">最近更新</option><option value="name">按名称</option></select>
          <button className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">筛选</button>
        </form>
      </section>
      <section className="py-10 sm:py-14">
        {resources.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {resources.map((resource) => <MainResourceCard key={resource.id} resource={resource} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
            <h2 className="font-semibold text-foreground">资源正在整理中</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">第一批资源会在审核后发布。你可以先提交一个值得推荐的免费资源。</p>
            <Link href="/submit" className="mt-6 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">提交资源</Link>
          </div>
        )}
      </section>
    </>
  );
}
