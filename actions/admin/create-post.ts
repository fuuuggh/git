"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(20).max(300),
  category: z.string().trim().min(2).max(50),
  body: z.string().trim().min(20).max(50_000),
});

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!,
  );

const textToHtml = (body: string) =>
  body
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
    .join("\n");

export async function createPublishedPost(formData: FormData) {
  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/posts/new?error=invalid");

  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await (supabase.from("profiles") as never as any)
    .select("role")
    .eq("id", user?.id ?? "")
    .single();
  if (profile?.role !== "admin") redirect("/");

  let { data: category } = await (supabase.from("categories") as never as any)
    .select("id")
    .eq("scope", "blog")
    .eq("name", parsed.data.category)
    .maybeSingle();
  if (!category) {
    const { data } = await (supabase.from("categories") as never as any)
      .insert({
        name: parsed.data.category,
        slug: `blog-${crypto.randomUUID().slice(0, 8)}`,
        scope: "blog",
      })
      .select("id")
      .single();
    category = data;
  }

  const { error } = await (supabase.from("posts") as never as any).insert({
    author_id: user!.id,
    category_id: category?.id ?? null,
    title: parsed.data.title,
    slug: parsed.data.slug,
    description: parsed.data.description,
    // jsonb stores this as a JSON string; the public article page sanitizes it
    // before rendering, so the first publishing flow stays safe and simple.
    content: textToHtml(parsed.data.body),
    published: true,
    published_at: new Date().toISOString(),
  });
  if (error) redirect("/admin/posts/new?error=save");

  revalidatePath("/");
  revalidatePath(`/posts/${parsed.data.slug}`);
  redirect("/admin/reviews");
}
