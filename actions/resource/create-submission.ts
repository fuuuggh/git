"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { isLocale, messages } from "@/lib/i18n";

const submissionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  website: z.string().trim().url().optional().or(z.literal("")),
  github: z.string().trim().url().optional().or(z.literal("")),
  download: z.string().trim().url().optional().or(z.literal("")),
  resourceType: z.enum(["website", "open_source", "download", "document", "template", "asset", "api", "service"]),
  description: z.string().trim().min(20).max(1000),
  submitterEmail: z.string().trim().email().optional().or(z.literal("")),
});

const allowedMimeTypes = new Set([
  "application/pdf", "application/zip", "application/x-zip-compressed", "text/plain", "image/jpeg", "image/png", "image/webp",
]);
const maximumAttachmentBytes = 10 * 1024 * 1024;
const cleanFileName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-").slice(-120) || "attachment";

export type SubmissionState = { status: "idle" | "success" | "error"; message?: string };

export async function createSubmission(_: SubmissionState, formData: FormData): Promise<SubmissionState> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("site_locale")?.value;
  const copy = messages[isLocale(locale) ? locale : "zh"].submit;
  if (String(formData.get("company") ?? "").trim()) {
    return { status: "success", message: copy.received };
  }
  const parsed = submissionSchema.safeParse({
    name: formData.get("name"),
    website: formData.get("website"),
    github: formData.get("github"),
    download: formData.get("download"),
    resourceType: formData.get("resourceType"),
    description: formData.get("description"),
    submitterEmail: formData.get("submitterEmail"),
  });
  const attachment = formData.get("attachment");
  const hasAttachment = attachment instanceof File && attachment.size > 0;
  if (!parsed.success || (hasAttachment && (!allowedMimeTypes.has(attachment.type) || attachment.size > maximumAttachmentBytes)) || (!parsed?.data?.website && !parsed?.data?.github && !parsed?.data?.download && !hasAttachment)) {
    return { status: "error", message: copy.invalid };
  }

  if (cookieStore.get("resource-submission-cooldown")) {
    return { status: "error", message: copy.cooldown };
  }
  const supabase = createClient(cookieStore);
  let attachmentPath: string | null = null;
  if (hasAttachment) {
    attachmentPath = `pending/${crypto.randomUUID()}/${cleanFileName(attachment.name)}`;
    const { error: uploadError } = await supabase.storage.from("submission-files").upload(attachmentPath, Buffer.from(await attachment.arrayBuffer()), {
      contentType: attachment.type,
      upsert: false,
    });
    if (uploadError) return { status: "error", message: copy.failed };
  }
  const { error } = await (supabase.from("submissions" as never) as any).insert({
    name: parsed.data.name,
    website_url: parsed.data.website || null,
    github_url: parsed.data.github || null,
    download_url: parsed.data.download || null,
    resource_type: parsed.data.resourceType,
    description: parsed.data.description,
    submitter_email: parsed.data.submitterEmail || null,
    attachment_path: attachmentPath,
    attachment_name: hasAttachment ? attachment.name : null,
    attachment_mime_type: hasAttachment ? attachment.type : null,
    attachment_size_bytes: hasAttachment ? attachment.size : null,
  });
  if (error) return { status: "error", message: copy.failed };
  cookieStore.set("resource-submission-cooldown", "1", { httpOnly: true, maxAge: 300, path: "/", sameSite: "lax" });
  return { status: "success", message: copy.received };
}
