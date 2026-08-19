import { createPublicClient } from "@/utils/supabase/public";
import { unstable_cache } from "next/cache";

export type PublicPost = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: unknown;
  published_at: string | null;
  updated_at: string;
  categories: { name: string; slug: string } | null;
  profiles: { full_name: string | null } | null;
};

const listPublicPosts = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data, error } = await (supabase.from("posts" as never) as any)
      .select("id,title,slug,description,content,published_at,updated_at,categories(name,slug),profiles(full_name)")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .order("updated_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Unable to load posts:", error.message);
      return [] as PublicPost[];
    }
    return (data ?? []) as PublicPost[];
  },
  ["public-blog-posts"],
  { revalidate: 60, tags: ["posts"] },
);

export async function getPublicPosts(query?: string, category?: string) {
  const normalizedQuery = query?.trim().toLocaleLowerCase();
  return (await listPublicPosts()).filter((post) => {
    const matchesQuery = !normalizedQuery || [post.title, post.description, post.categories?.name]
      .filter(Boolean)
      .some((value) => value!.toLocaleLowerCase().includes(normalizedQuery));
    return matchesQuery && (!category || post.categories?.slug === category);
  });
}

export async function getPublicPost(slug: string) {
  return (await listPublicPosts()).find((post) => post.slug === slug) ?? null;
}

export function getPostHtml(content: unknown) {
  if (typeof content === "string") return content;
  if (content && typeof content === "object") {
    const record = content as Record<string, unknown>;
    return typeof record.html === "string" ? record.html : typeof record.body === "string" ? record.body : "";
  }
  return "";
}
