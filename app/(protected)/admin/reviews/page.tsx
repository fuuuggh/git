import AdminReviewQueues from "@/components/protected/admin/admin-review-queues";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const supabase = createClient(await cookies());
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) redirect("/login");

  // This controls the dashboard shell only. Every action still verifies the
  // signed-in user and their Supabase admin role before changing data.
  if (session.user.email?.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) notFound();

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-6 py-10">
      <header><p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">管理员</p><h1 className="mt-3 text-3xl font-bold tracking-tight">审核队列</h1><div className="mt-5 flex flex-wrap gap-3"><a href="/admin/posts/new" className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">发布文章</a><a href="/admin/resources/new" className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground">发布资源</a></div></header>
      <AdminReviewQueues />
    </main>
  );
}
