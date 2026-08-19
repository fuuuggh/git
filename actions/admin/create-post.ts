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

const imageMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);
const maxImageBytes = 6 * 1024 * 1024;
const maxTotalImageBytes = 20 * 1024 * 1024;
const maxInlineImages = 8;

const cleanFileName = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(-120) || "image";

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

const imageToHtml = (url: string, name: string) =>
  `<figure><img src="${escapeHtml(url)}" alt="${escapeHtml(name)}" loading="lazy" /></figure>`;

export async function createPublishedPost(formData: FormData) {
  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/posts/new?error=invalid");

  const coverImage = formData.get("coverImage");
  const inlineImages = formData
    .getAll("inlineImages")
    .filter((file): file is File => file instanceof File && file.size > 0);
  const images = [
    ...(coverImage instanceof File && coverImage.size > 0 ? [coverImage] : []),
    ...inlineImages,
  ];
  if (
    inlineImages.length > maxInlineImages ||
    images.some((file) => !imageMimeTypes.has(file.type) || file.size > maxImageBytes) ||
    images.reduce((total, file) => total + file.size, 0) > maxTotalImageBytes
  ) {
    redirect("/admin/posts/new?error=images");
  }

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

  const postId = crypto.randomUUID();
  const uploadedPaths: string[] = [];
  const uploadImage = async (file: File, kind: "cover" | "body", index: number) => {
    const path = `${postId}/${kind}-${index + 1}-${cleanFileName(file.name)}`;
    const { error } = await supabase.storage.from("post-images").upload(
      path,
      Buffer.from(await file.arrayBuffer()),
      { contentType: file.type, upsert: false },
    );
    if (error) throw error;
    uploadedPaths.push(path);
    return supabase.storage.from("post-images").getPublicUrl(path).data.publicUrl;
  };

  let coverImageUrl: string | null = null;
  let bodyImageUrls: { url: string; name: string }[] = [];
  try {
    if (coverImage instanceof File && coverImage.size > 0) {
      coverImageUrl = await uploadImage(coverImage, "cover", 0);
    }
    bodyImageUrls = await Promise.all(
      inlineImages.map(async (file, index) => ({
        url: await uploadImage(file, "body", index),
        name: file.name,
      })),
    );
  } catch {
    if (uploadedPaths.length) await supabase.storage.from("post-images").remove(uploadedPaths);
    redirect("/admin/posts/new?error=images");
  }

  const content = [
    textToHtml(parsed.data.body),
    ...bodyImageUrls.map((image) => imageToHtml(image.url, image.name)),
  ].join("\n");
  const { error } = await (supabase.from("posts") as never as any).insert({
    id: postId,
    author_id: user!.id,
    category_id: category?.id ?? null,
    title: parsed.data.title,
    slug: parsed.data.slug,
    description: parsed.data.description,
    content,
    cover_image_url: coverImageUrl,
    published: true,
    published_at: new Date().toISOString(),
  });
  if (error) {
    if (uploadedPaths.length) await supabase.storage.from("post-images").remove(uploadedPaths);
    redirect("/admin/posts/new?error=save");
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);
  revalidatePath(`/posts/${parsed.data.slug}`);
  redirect("/admin/reviews");
}
