"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const resourceSchema = z.object({
  name: z.string().trim().min(2).max(120), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(20).max(300), category: z.string().trim().min(2).max(50),
  website: z.string().trim().url().optional().or(z.literal("")), github: z.string().trim().url().optional().or(z.literal("")),
  pricing: z.enum(["free", "freemium", "open_source"]), platform: z.string().trim(), tags: z.string().trim().max(200).optional(), license: z.string().trim().max(100).optional(),
});

export async function createResource(formData: FormData) {
  const parsed = resourceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/resources/new?error=invalid");
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await (supabase.from("profiles") as any).select("role").eq("id", user?.id ?? "").single();
  if (profile?.role !== "admin") redirect("/");
  let { data: category } = await (supabase.from("categories") as never as any).select("id").eq("scope", "resource").eq("name", parsed.data.category).maybeSingle();
  if (!category) {
    const { data } = await (supabase.from("categories") as never as any).insert({ name: parsed.data.category, slug: `resource-${crypto.randomUUID().slice(0, 8)}`, scope: "resource" }).select("id").single();
    category = data;
  }
  const { data: resource, error } = await (supabase.from("resources") as never as any).insert({
    name: parsed.data.name, slug: parsed.data.slug, description: parsed.data.description, category_id: category?.id,
    website_url: parsed.data.website || null, github_url: parsed.data.github || null, pricing: parsed.data.pricing,
    open_source: parsed.data.pricing === "open_source", platforms: parsed.data.platform.split(",").map((item) => item.trim()).filter(Boolean), license: parsed.data.license || null, last_checked_at: new Date().toISOString(),
  }).select("id").single();
  if (error) redirect("/admin/resources/new?error=save");
  const tagNames = Array.from(new Set((parsed.data.tags ?? "").split(",").map((tag) => tag.trim()).filter(Boolean)));
  for (const name of tagNames) {
    let { data: tag } = await (supabase.from("tags") as never as any).select("id").eq("name", name).maybeSingle();
    if (!tag) {
      const { data } = await (supabase.from("tags") as never as any).insert({ name, slug: `tag-${crypto.randomUUID().slice(0, 8)}` }).select("id").single();
      tag = data;
    }
    if (tag?.id) await (supabase.from("resource_tags") as never as any).upsert({ resource_id: resource!.id, tag_id: tag.id });
  }
  revalidatePath("/resources"); revalidatePath("/"); redirect("/admin/reviews");
}
