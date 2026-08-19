"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const resourceSchema = z.object({
  name: z.string().trim().min(2).max(120), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(20).max(300), category: z.string().trim().min(2).max(50),
  website: z.string().trim().url().optional().or(z.literal("")), github: z.string().trim().url().optional().or(z.literal("")), download: z.string().trim().url().optional().or(z.literal("")),
  pricing: z.enum(["free", "freemium", "open_source"]), platform: z.string().trim(), tags: z.string().trim().max(200).optional(), license: z.string().trim().max(100).optional(),
  resourceType: z.enum(["website", "open_source", "download", "document", "template", "asset", "api", "service"]),
});

const attachmentMimeTypes = new Set([
  "application/pdf", "application/zip", "application/x-zip-compressed", "text/plain", "image/jpeg", "image/png", "image/webp",
]);
const attachmentMaxBytes = 25 * 1024 * 1024;

const cleanFileName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(-120) || "attachment";

export async function createResource(formData: FormData) {
  const parsed = resourceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/resources/new?error=invalid");
  const attachment = formData.get("attachment");
  const hasAttachment = attachment instanceof File && attachment.size > 0;
  if (hasAttachment && (!attachmentMimeTypes.has(attachment.type) || attachment.size > attachmentMaxBytes)) redirect("/admin/resources/new?error=invalid");
  if (!parsed.data.website && !parsed.data.github && !parsed.data.download && !hasAttachment) redirect("/admin/resources/new?error=invalid");
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await (supabase.from("profiles") as any).select("role").eq("id", user?.id ?? "").single();
  if (profile?.role !== "admin") redirect("/");
  let { data: category } = await (supabase.from("categories") as never as any).select("id").eq("scope", "resource").eq("name", parsed.data.category).maybeSingle();
  if (!category) {
    const { data } = await (supabase.from("categories") as never as any).insert({ name: parsed.data.category, slug: `resource-${crypto.randomUUID().slice(0, 8)}`, scope: "resource" }).select("id").single();
    category = data;
  }
  const resourceId = crypto.randomUUID();
  let storagePath: string | null = null;
  if (hasAttachment) {
    storagePath = `${resourceId}/${cleanFileName(attachment.name)}`;
    const { error: uploadError } = await supabase.storage.from("resource-files").upload(storagePath, Buffer.from(await attachment.arrayBuffer()), {
      contentType: attachment.type,
      upsert: false,
    });
    if (uploadError) redirect("/admin/resources/new?error=save");
  }

  const { error } = await (supabase.from("resources") as never as any).insert({
    id: resourceId, name: parsed.data.name, slug: parsed.data.slug, description: parsed.data.description, category_id: category?.id,
    website_url: parsed.data.website || null, github_url: parsed.data.github || null, download_url: parsed.data.download || null, resource_type: parsed.data.resourceType, pricing: parsed.data.pricing,
    open_source: parsed.data.pricing === "open_source" || parsed.data.resourceType === "open_source", platforms: parsed.data.platform.split(",").map((item) => item.trim()).filter(Boolean), license: parsed.data.license || null, last_checked_at: new Date().toISOString(),
  });
  if (error) {
    if (storagePath) await supabase.storage.from("resource-files").remove([storagePath]);
    redirect("/admin/resources/new?error=save");
  }
  if (hasAttachment && storagePath) {
    const { error: attachmentError } = await (supabase.from("resource_attachments") as never as any).insert({
      resource_id: resourceId, storage_path: storagePath, file_name: attachment.name, mime_type: attachment.type, size_bytes: attachment.size, created_by: user!.id,
    });
    if (attachmentError) {
      await supabase.storage.from("resource-files").remove([storagePath]);
      await (supabase.from("resources") as never as any).delete().eq("id", resourceId);
      redirect("/admin/resources/new?error=save");
    }
  }
  const tagNames = Array.from(new Set((parsed.data.tags ?? "").split(",").map((tag) => tag.trim()).filter(Boolean)));
  for (const name of tagNames) {
    let { data: tag } = await (supabase.from("tags") as never as any).select("id").eq("name", name).maybeSingle();
    if (!tag) {
      const { data } = await (supabase.from("tags") as never as any).insert({ name, slug: `tag-${crypto.randomUUID().slice(0, 8)}` }).select("id").single();
      tag = data;
    }
    if (tag?.id) await (supabase.from("resource_tags") as never as any).upsert({ resource_id: resourceId, tag_id: tag.id });
  }
  revalidatePath("/resources"); revalidatePath("/"); redirect("/admin/reviews");
}
