"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { z } from "zod";

const reportSchema = z.object({
  resourceId: z.string().uuid(),
  reportType: z.enum(["website_broken", "download_broken", "github_broken", "information_incorrect"]),
  message: z.string().trim().max(600).optional(),
});

export type BrokenReportState = { status: "idle" | "success" | "error"; message?: string };

export async function createBrokenReport(_: BrokenReportState, formData: FormData): Promise<BrokenReportState> {
  if (String(formData.get("company") ?? "").trim()) {
    return { status: "success", message: "感谢反馈，我们会尽快检查。" };
  }
  const parsed = reportSchema.safeParse({
    resourceId: formData.get("resourceId"),
    reportType: formData.get("reportType"),
    message: formData.get("message") || undefined,
  });
  if (!parsed.success) return { status: "error", message: "请选择问题类型后再提交。" };

  const cookieStore = await cookies();
  if (cookieStore.get("broken-report-cooldown")) {
    return { status: "error", message: "请稍后几分钟再提交。" };
  }
  const supabase = createClient(cookieStore);
  const { error } = await (supabase.from("broken_reports" as never) as any).insert({
    resource_id: parsed.data.resourceId,
    report_type: parsed.data.reportType,
    details: parsed.data.message ?? null,
  });
  if (error) return { status: "error", message: "提交失败，请稍后再试。" };
  cookieStore.set("broken-report-cooldown", "1", { httpOnly: true, maxAge: 300, path: "/", sameSite: "lax" });
  return { status: "success", message: "感谢反馈，我们会尽快检查。" };
}
