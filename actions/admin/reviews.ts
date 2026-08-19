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

export async function reviewSubmission(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["approved", "rejected"].includes(status)) return;
  const { supabase, user } = await requireAdmin();
  const { data: submission } = await (supabase.from("submissions") as never as any)
    .select("id,name,website_url,github_url,description,status")
    .eq("id", id)
    .eq("status", "pending")
    .maybeSingle();
  if (!submission) return;

  let resourceSlug: string | null = null;
  if (status === "approved") {
    resourceSlug = toResourceSlug(submission.name);
    const { error } = await (supabase.from("resources") as never as any).insert({
      name: submission.name,
      slug: resourceSlug,
      description: submission.description,
      website_url: submission.website_url,
      github_url: submission.github_url,
      status: "active",
      pricing: "free",
      open_source: Boolean(submission.github_url),
      last_checked_at: new Date().toISOString(),
      created_by: user.id,
    });
    if (error) throw new Error("Unable to publish resource");
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
