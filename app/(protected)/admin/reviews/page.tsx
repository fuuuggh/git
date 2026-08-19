import { resolveBrokenReport, reviewSubmission } from "@/actions/admin/reviews";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const supabase = createClient(await cookies());
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) redirect("/login");
  const { data: profile } = await (supabase.from("profiles") as any).select("role").eq("id", session.user.id).single();
  if (profile?.role !== "admin") notFound();
  const [{ data: submissions }, { data: reports }] = await Promise.all([
    (supabase.from("submissions") as never as any).select("id,name,website_url,github_url,description,submitter_email,created_at,status").eq("status", "pending").order("created_at", { ascending: true }),
    (supabase.from("broken_reports") as never as any).select("id,report_type,details,created_at,resources(name,slug)").is("resolved_at", null).order("created_at", { ascending: true }),
  ]);

  return <main className="mx-auto max-w-5xl space-y-10 px-6 py-10">
    <header><p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">管理员</p><h1 className="mt-3 text-3xl font-bold tracking-tight">审核队列</h1><div className="mt-5 flex flex-wrap gap-3"><a href="/admin/posts/new" className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">发布文章</a><a href="/admin/resources/new" className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground">发布资源</a></div></header>
    <section><h2 className="text-lg font-bold">资源投稿 <span className="text-sm font-normal text-muted-foreground">{submissions?.length ?? 0}</span></h2>
      <div className="mt-4 space-y-3">{submissions?.length ? submissions.map((item: any) => <article key={item.id} className="rounded-xl border border-border bg-card p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold">{item.name}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{item.description}</p></div><div className="flex gap-2"><form action={reviewSubmission}><input type="hidden" name="id" value={item.id}/><input type="hidden" name="status" value="approved"/><button className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">通过</button></form><form action={reviewSubmission}><input type="hidden" name="id" value={item.id}/><input type="hidden" name="status" value="rejected"/><button className="rounded-lg border border-border px-3 py-2 text-sm font-semibold">拒绝</button></form></div></div>{item.website_url ? <a href={item.website_url} className="mt-3 block text-sm text-primary" target="_blank">{item.website_url}</a> : null}</article>) : <p className="text-sm text-muted-foreground">没有待审核投稿。</p>}</div>
    </section>
    <section><h2 className="text-lg font-bold">失效反馈 <span className="text-sm font-normal text-muted-foreground">{reports?.length ?? 0}</span></h2>
      <div className="mt-4 space-y-3">{reports?.length ? reports.map((item: any) => <article key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5"><div><p className="font-semibold">{item.resources?.name ?? "已删除资源"}</p><p className="mt-1 text-sm text-muted-foreground">{item.report_type}{item.details ? ` · ${item.details}` : ""}</p></div><form action={resolveBrokenReport}><input type="hidden" name="id" value={item.id}/><button className="rounded-lg border border-border px-3 py-2 text-sm font-semibold">标记已处理</button></form></article>) : <p className="text-sm text-muted-foreground">没有待处理反馈。</p>}</div>
    </section>
  </main>;
}
