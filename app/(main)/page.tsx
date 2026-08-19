import { MainPostItem, MainPostItemLoading } from "@/components/main";
import { SharedPagination } from "@/components/shared";
import { PostWithCategoryWithProfile } from "@/types/collection";
import { createPublicClient } from "@/utils/supabase/public";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import { getRequestLocale } from "@/lib/i18n-server";
import { messages } from "@/lib/i18n";

export const revalidate = 60;

interface HomePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const copy = messages[await getRequestLocale()].home;
  const limit = 10;
  // Resolve the requested page before querying, then get both content and the
  // total in one database request instead of making a separate count call.
  const requestedPage =
    typeof resolvedSearchParams.page === "string" && +resolvedSearchParams.page > 1
      ? +resolvedSearchParams.page
      : 1;
  const from = (requestedPage - 1) * limit;
  const to = from + limit - 1;

  const getPosts = unstable_cache(
    async () => {
      const supabase = createPublicClient();
      return (supabase.from("posts" as never) as any)
        .select(`*, categories(*), profiles(*)`, { count: "exact" })
        .eq("published", true)
        .order("created_at", { ascending: false })
        .range(from, to);
    },
    ["public-posts", String(requestedPage)],
    { revalidate: 60, tags: ["posts"] },
  );
  const { data, error, count } = (await getPosts()) as {
    data: PostWithCategoryWithProfile[] | null;
    error: Error | null;
    count: number | null;
  };

  const totalPages = count ? Math.ceil(count / limit) : 0;
  const page =
    requestedPage <= Math.max(totalPages, 1)
      ? requestedPage
      : 1;

  return (
    <>
      <section className="border-b border-border pb-12 pt-4 sm:pb-16 sm:pt-8">
        <p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">
          {copy.eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
          {copy.title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
          {copy.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="#latest"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {copy.readLatest}
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary/35 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {copy.learnMore}
          </Link>
        </div>
      </section>

      <section id="latest" className="py-10 sm:py-14">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {copy.latest}
          </h2>
          {data?.length ? (
            <span className="text-sm text-muted-foreground">{copy.latestHint}</span>
          ) : null}
        </div>

        {data?.length && !error ? (
          <div className="space-y-6">
            {data.map((post) => (
              <Suspense key={post.id} fallback={<MainPostItemLoading />}>
                <MainPostItem post={post} />
              </Suspense>
            ))}
          </div>
        ) : (
          <div className="rounded-[var(--radius)] border border-dashed border-border bg-card px-6 py-12 text-center sm:px-10">
            <p className="text-base font-semibold text-foreground">{copy.emptyTitle}</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              {copy.emptyDescription}
            </p>
          </div>
        )}
      </section>

      {totalPages > 1 && (
        <div className="pb-4">
          <SharedPagination
            page={page}
            totalPages={totalPages}
            baseUrl="/"
            pageUrl="?page="
          />
        </div>
      )}
    </>
  );
}
