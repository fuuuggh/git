"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";

const submissionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  website: z.string().trim().url().optional().or(z.literal("")),
  github: z.string().trim().url().optional().or(z.literal("")),
  description: z.string().trim().min(20).max(1000),
  submitterEmail: z.string().trim().email().optional().or(z.literal("")),
});

export type SubmissionState = { status: "idle" | "success" | "error"; message?: string };

export async function createSubmission(_: SubmissionState, formData: FormData): Promise<SubmissionState> {
  if (String(formData.get("company") ?? "").trim()) {
    return { status: "success", message: "已收到，审核后会决定是否发布。" };
  }
  const parsed = submissionSchema.safeParse({
    name: formData.get("name"),
    website: formData.get("website"),
    github: formData.get("github"),
    description: formData.get("description"),
    submitterEmail: formData.get("submitterEmail"),
  });
  if (!parsed.success) return { status: "error", message: "请检查名称、链接和描述是否填写正确。" };

  const cookieStore = await cookies();
  if (cookieStore.get("resource-submission-cooldown")) {
    return { status: "error", message: "请稍后几分钟再提交。" };
  }
  const supabase = createClient(cookieStore);
  const { error } = await (supabase.from("submissions" as never) as any).insert({
    name: parsed.data.name,
    website_url: parsed.data.website || null,
    github_url: parsed.data.github || null,
    description: parsed.data.description,
    submitter_email: parsed.data.submitterEmail || null,
  });
  if (error) return { status: "error", message: "提交失败，请稍后再试。" };
  cookieStore.set("resource-submission-cooldown", "1", { httpOnly: true, maxAge: 300, path: "/", sameSite: "lax" });
  return { status: "success", message: "已收到，审核后会决定是否发布。" };
}
