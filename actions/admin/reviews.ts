"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function requireAdmin() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await (supabase.from("profiles") as any).select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Forbidden");
  return { supabase, user };
}

const toResourceSlug = (name: string) => {
  const normalized = name
    .toLocaleLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${normalized || "resource"}-${crypto.randomUUID().slice(0, 8)}`;
};

const toStorageFileName = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(-120) || "attachment";

export async function reviewSubmission(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["approved", "rejected"].includes(status)) return;
  const { supabase, user } = await requireAdmin();
  const { data: submission } = await (supabase.from("submissions") as never as any)
    .select("id,name,website_url,github_url,download_url,resource_type,attachment_path,attachment_name,attachment_mime_type,attachment_size_bytes,description,status")
    .eq("id", id)
    .eq("status", "pending")
    .maybeSingle();
  if (!submission) return;

  let resourceSlug: string | null = null;
  if (status === "approved") {
    resourceSlug = toResourceSlug(submission.name);
    const resourceId = crypto.randomUUID();
    let publishedAttachmentPath: string | null = null;
    if (submission.attachment_path) {
      const { data: sourceFile, error: downloadError } = await supabase.storage.from("submission-files").download(submission.attachment_path);
      if (downloadError || !sourceFile) throw new Error("Unable to read submitted attachment");
      publishedAttachmentPath = `${resourceId}/${toStorageFileName(submission.attachment_name || "attachment")}`;
      const { error: uploadError } = await supabase.storage.from("resource-files").upload(publishedAttachmentPath, Buffer.from(await sourceFile.arrayBuffer()), {
        contentType: submission.attachment_mime_type || sourceFile.type || "application/octet-stream",
        upsert: false,
      });
      if (uploadError) throw new Error("Unable to publish submitted attachment");
    }
    const { error } = await (supabase.from("resources") as never as any).insert({
      id: resourceId,
      name: submission.name,
      slug: resourceSlug,
      description: submission.description,
      website_url: submission.website_url,
      github_url: submission.github_url,
      download_url: submission.download_url,
      resource_type: submission.resource_type || "website",
      status: "active",
      pricing: "free",
      open_source: Boolean(submission.github_url),
      last_checked_at: new Date().toISOString(),
      created_by: user.id,
    });
    if (error) {
      if (publishedAttachmentPath) await supabase.storage.from("resource-files").remove([publishedAttachmentPath]);
      throw new Error("Unable to publish resource");
    }
    if (publishedAttachmentPath) {
      const { error: attachmentError } = await (supabase.from("resource_attachments") as never as any).insert({
        resource_id: resourceId,
        storage_path: publishedAttachmentPath,
        file_name: submission.attachment_name || "attachment",
        mime_type: submission.attachment_mime_type || "application/octet-stream",
        size_bytes: submission.attachment_size_bytes || 0,
        created_by: user.id,
      });
      if (attachmentError) {
        await supabase.storage.from("resource-files").remove([publishedAttachmentPath]);
        await (supabase.from("resources") as never as any).delete().eq("id", resourceId);
        throw new Error("Unable to record published attachment");
      }
      await supabase.storage.from("submission-files").remove([submission.attachment_path]);
    }
  }

  await (supabase.from("submissions") as never as any)
    .update({ status, reviewer_id: user.id, reviewed_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/reviews");
  if (resourceSlug) {
    revalidatePath("/resources");
    revalidatePath(`/resources/${resourceSlug}`);
  }
}

export async function resolveBrokenReport(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const { supabase, user } = await requireAdmin();
  await (supabase.from("broken_reports") as never as any)
    .update({ resolved_at: new Date().toISOString(), resolved_by: user.id })
    .eq("id", id);
  revalidatePath("/admin/reviews");
}
