"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

async function requireAdmin() {
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await (supabase.from("profiles") as never as any)
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") throw new Error("Forbidden");
  return supabase;
}

export async function updatePostVisibility(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const published = String(formData.get("published") ?? "") === "true";
  if (!id) return;
  const supabase = await requireAdmin();
  await (supabase.from("posts") as never as any)
    .update({ published, published_at: published ? new Date().toISOString() : null })
    .eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/posts");
}
