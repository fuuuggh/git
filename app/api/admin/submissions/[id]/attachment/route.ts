import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = createClient(await cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { data: profile } = await (supabase.from("profiles") as any)
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return new NextResponse("Forbidden", { status: 403 });

  const { data: submission } = await (supabase.from("submissions") as any)
    .select("attachment_path")
    .eq("id", id)
    .eq("status", "pending")
    .maybeSingle();
  if (!submission?.attachment_path) return new NextResponse("Not found", { status: 404 });

  const { data, error } = await supabase.storage
    .from("submission-files")
    .createSignedUrl(submission.attachment_path, 60);
  if (error || !data?.signedUrl) return new NextResponse("File unavailable", { status: 404 });

  return NextResponse.redirect(data.signedUrl);
}
