import { createPublicClient } from "@/utils/supabase/public";
import { unstable_cache } from "next/cache";

export type ResourcePricing = "free" | "freemium" | "open_source";

export type PublicResource = {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string | null;
  website_url: string | null;
  github_url: string | null;
  download_url: string | null;
  pricing: ResourcePricing;
  open_source: boolean;
  platforms: string[];
  license: string | null;
  featured: boolean;
  status: "active" | "broken" | "archived";
  updated_at: string;
  last_checked_at: string | null;
  categories: { name: string; slug: string } | null;
  tags: { name: string; slug: string }[];
};

export type ResourceFilters = {
  category?: string;
  pricing?: ResourcePricing;
  platform?: string;
  openSource?: boolean;
  sort?: "updated" | "name";
};

const listPublicResources = unstable_cache(
  async () => {
    const supabase = createPublicClient();

  // Generated Supabase types are refreshed after linking the project. Keeping
  // this boundary isolated prevents that tooling step from leaking into UI code.
    const { data, error } = await (supabase.from("resources" as never) as any)
    .select(
      "id,name,slug,description,long_description,website_url,github_url,download_url,pricing,open_source,platforms,license,featured,status,updated_at,last_checked_at,categories(name,slug),resource_tags(tags(name,slug))",
    )
    .eq("status", "active")
    .order("featured", { ascending: false })
    .order("updated_at", { ascending: false });

    if (error) {
      console.error("Unable to load resources:", error.message);
      return [] as PublicResource[];
    }

    return (data ?? []).map((resource: any) => ({
      ...resource,
      tags: (resource.resource_tags ?? [])
        .map((item: { tags: { name: string; slug: string } | null }) => item.tags)
        .filter(Boolean),
    })) as PublicResource[];
  },
  ["public-resources"],
  { revalidate: 60, tags: ["resources"] },
);

export async function getPublicResources(query?: string, filters?: ResourceFilters) {
  const resources = await listPublicResources();
  const normalizedQuery = query?.trim().toLocaleLowerCase();
  const filtered = resources.filter((resource) => {
    const matchesQuery = !normalizedQuery || [
      resource.name,
      resource.description,
      resource.long_description,
      ...resource.tags.map((tag) => tag.name),
    ]
      .filter(Boolean)
      .some((value) => value!.toLocaleLowerCase().includes(normalizedQuery));
    const matchesCategory = !filters?.category || resource.categories?.slug === filters.category;
    const matchesPricing = !filters?.pricing || resource.pricing === filters.pricing;
    const matchesPlatform = !filters?.platform || resource.platforms.includes(filters.platform);
    const matchesOpenSource = !filters?.openSource || resource.open_source;
    return matchesQuery && matchesCategory && matchesPricing && matchesPlatform && matchesOpenSource;
  });

  return filters?.sort === "name"
    ? filtered.toSorted((left, right) => left.name.localeCompare(right.name, "zh-CN"))
    : filtered;
}

export async function getPublicResource(slug: string) {
  const resources = await listPublicResources();
  return resources.find((resource) => resource.slug === slug) ?? null;
}
