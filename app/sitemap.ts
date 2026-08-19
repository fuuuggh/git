import type { MetadataRoute } from "next";
import { getUrl } from "@/lib/utils";
import { getPublicResources } from "@/lib/resources";
import { createPublicClient } from "@/utils/supabase/public";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getUrl();
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = ["/", "/about", "/contact", "/policy", "/terms"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.5,
  }));

  try {
    const supabase = createPublicClient();
    const [{ data: posts }, resources] = await Promise.all([
      (supabase.from("posts" as never) as any)
        .select("slug,updated_at")
        .eq("published", true)
        .order("updated_at", { ascending: false }),
      getPublicResources(),
    ]);
    return [
      ...staticPages,
      ...(posts ?? []).map((post: { slug: string; updated_at: string }) => ({
        url: `${baseUrl}/posts/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
      ...resources.map((resource) => ({
        url: `${baseUrl}/resources/${resource.slug}`,
        lastModified: new Date(resource.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    // The base pages remain discoverable even during a temporary database outage.
    return staticPages;
  }
}
