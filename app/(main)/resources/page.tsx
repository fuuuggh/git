import MainResourceCard from "@/components/main/resource/main-resource-card";
import { getPublicResources } from "@/lib/resources";
import Link from "next/link";
import { getRequestLocale } from "@/lib/i18n-server";
import { messages } from "@/lib/i18n";

export const revalidate = 60;

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; pricing?: "free" | "freemium" | "open_source"; platform?: string; openSource?: string; sort?: "updated" | "name" }>;
}) {
  const { q, category, pricing, platform, openSource, sort } = await searchParams;
  const copy = messages[await getRequestLocale()].resources;
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
      <section className="rounded-3xl border border-border bg-card px-6 py-8 shadow-sm sm:px-8 sm:py-10">
        <p className="text-xs font-bold tracking-[0.16em] text-primary uppercase">{copy.eyebrow}</p>
        <div className="mt-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-[-0.055em] text-foreground sm:text-5xl">{copy.title}</h1>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{copy.description}</p>
          </div>
          <Link href="/submit" className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent">{copy.recommend}</Link>
        </div>
        <form className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" action="/resources">
          <label htmlFor="resource-search" className="sr-only">{copy.search}</label>
          <input id="resource-search" name="q" defaultValue={q} placeholder={copy.search} className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20 sm:col-span-2" />
          <select name="category" defaultValue={category} className="rounded-xl border border-input bg-card px-3 py-3 text-sm outline-none focus:border-primary"><option value="">{copy.allCategories}</option>{categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select>
          <select name="pricing" defaultValue={pricing} className="rounded-xl border border-input bg-card px-3 py-3 text-sm outline-none focus:border-primary"><option value="">{copy.allPricing}</option><option value="free">{copy.free}</option><option value="open_source">{copy.openSource}</option><option value="freemium">{copy.freemium}</option></select>
          <select name="platform" defaultValue={platform} className="rounded-xl border border-input bg-card px-3 py-3 text-sm outline-none focus:border-primary"><option value="">{copy.allPlatforms}</option>{platforms.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          <label className="flex items-center gap-2 rounded-xl border border-input bg-card px-3 py-3 text-sm"><input type="checkbox" name="openSource" value="true" defaultChecked={openSource === "true"}/>{copy.onlyOpenSource}</label>
          <select name="sort" defaultValue={sort} className="rounded-xl border border-input bg-card px-3 py-3 text-sm outline-none focus:border-primary"><option value="updated">{copy.recent}</option><option value="name">{copy.byName}</option></select>
          <button className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">{copy.filter}</button>
        </form>
      </section>
      <section className="py-10 sm:py-14">
        {resources.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {resources.map((resource) => <MainResourceCard key={resource.id} resource={resource} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
            <h2 className="font-semibold text-foreground">{copy.emptyTitle}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{copy.emptyDescription}</p>
            <Link href="/submit" className="mt-6 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">{copy.submit}</Link>
          </div>
        )}
      </section>
    </>
  );
}
