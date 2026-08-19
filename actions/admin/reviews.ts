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
  return supabase;
}

export async function reviewSubmission(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["approved", "rejected"].includes(status)) return;
  const supabase = await requireAdmin();
  await (supabase.from("submissions") as never as any).update({ status }).eq("id", id);
  revalidatePath("/admin/reviews");
}

export async function resolveBrokenReport(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = await requireAdmin();
  await (supabase.from("broken_reports") as never as any)
    .update({ resolved_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/reviews");
}
