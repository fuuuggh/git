import { MainResourceCard, NookPostCard } from "@/components/main";
import { getRequestLocale } from "@/lib/i18n-server";
import { messages } from "@/lib/i18n";
import { getPublicPosts } from "@/lib/posts";
import { getPublicResources } from "@/lib/resources";
import { ArrowUpRight, BookOpen, FolderKanban, GraduationCap, PenLine } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  const locale = await getRequestLocale();
  const allCopy = messages[locale];
  const copy = allCopy.home;
  const [posts, resources] = await Promise.all([getPublicPosts(), getPublicResources()]);
  const categories = [
    { title: allCopy.nook.development, description: copy.categoryDevelopment, icon: FolderKanban },
    { title: allCopy.nook.learning, description: copy.categoryLearning, icon: GraduationCap },
    { title: allCopy.nook.design, description: copy.categoryDesign, icon: PenLine },
    { title: allCopy.nook.efficiency, description: copy.categoryEfficiency, icon: BookOpen },
  ];

  return <div className="space-y-14 pb-5 sm:space-y-20">
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-10 shadow-sm sm:px-10 sm:py-14">
      <div className="absolute inset-y-0 right-0 hidden w-[43%] border-l border-border/70 bg-[radial-gradient(circle_at_60%_35%,hsl(var(--secondary)),transparent_34%),linear-gradient(145deg,transparent_10%,hsl(var(--muted)))] lg:block" aria-hidden="true"><div className="absolute bottom-10 left-10 h-36 w-28 rounded-t-[3rem] border border-foreground/10 bg-card/70 shadow-xl" /><div className="absolute bottom-10 left-36 h-20 w-44 rounded-xl border border-foreground/10 bg-card/70 shadow-lg" /></div>
      <div className="relative max-w-2xl">
        <p className="text-xs font-bold tracking-[0.16em] text-primary uppercase">{copy.eyebrow}</p>
        <h1 className="mt-5 text-4xl font-bold tracking-[-0.065em] text-foreground sm:text-5xl lg:text-6xl">{copy.title}</h1>
        <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">{copy.description}</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link href="/resources" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5">{copy.browseResources}<ArrowUpRight className="h-4 w-4" /></Link><Link href="/blog" className="rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent">{copy.readLatest}</Link></div>
      </div>
    </section>

    <section>
      <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.15em] text-primary uppercase">{copy.categoriesEyebrow}</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.045em]">{copy.categories}</h2></div><Link href="/resources" className="hidden items-center gap-1 text-sm font-semibold text-primary sm:inline-flex">{copy.viewAll}<ArrowUpRight className="h-3.5 w-3.5" /></Link></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{categories.map(({ title, description, icon: Icon }) => <Link href="/resources" key={title} className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"><Icon className="h-5 w-5 text-primary" /><h3 className="mt-8 font-bold tracking-tight">{title}</h3><p className="mt-2 text-sm text-muted-foreground">{description}</p><ArrowUpRight className="mt-5 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>)}</div>
    </section>

    <section>
      <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.15em] text-primary uppercase">{copy.latestHint}</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.045em]">{copy.latest}</h2></div><Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">{copy.viewAll}<ArrowUpRight className="h-3.5 w-3.5" /></Link></div>
      {posts.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{posts.slice(0, 3).map((post) => <NookPostCard key={post.id} post={post} fallbackCategory={allCopy.blog.uncategorized} readLabel={allCopy.blog.read} locale={allCopy.blog.dateLocale} />)}</div> : <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center"><p className="font-semibold">{copy.emptyTitle}</p><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{copy.emptyDescription}</p></div>}
    </section>

    <section>
      <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.15em] text-primary uppercase">{copy.resourcesEyebrow}</p><h2 className="mt-2 text-2xl font-bold tracking-[-0.045em]">{copy.featuredResources}</h2></div><Link href="/resources" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">{copy.viewAll}<ArrowUpRight className="h-3.5 w-3.5" /></Link></div>
      {resources.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{resources.slice(0, 3).map((resource) => <MainResourceCard key={resource.id} resource={resource} />)}</div> : <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center"><p className="font-semibold">{allCopy.resources.emptyTitle}</p><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{allCopy.resources.emptyDescription}</p><Link href="/submit" className="mt-5 inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">{allCopy.resources.submit}</Link></div>}
    </section>
  </div>;
}
