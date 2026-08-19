"use client";

import { resolveBrokenReport, reviewSubmission } from "@/actions/admin/reviews";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

type QueueState =
  | { status: "loading" }
  | { status: "unavailable" }
  | { status: "ready"; submissions: any[]; reports: any[] };

export default function AdminReviewQueues() {
  const [state, setState] = useState<QueueState>({ status: "loading" });

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    const timeout = window.setTimeout(() => {
      if (active) setState({ status: "unavailable" });
    }, 2500);

    Promise.all([
      (supabase.from("submissions") as never as any)
        .select("id,name,website_url,github_url,description,submitter_email,created_at,status")
        .eq("status", "pending")
        .order("created_at", { ascending: true }),
      (supabase.from("broken_reports") as never as any)
        .select("id,report_type,details,created_at,resources(name,slug)")
        .is("resolved_at", null)
        .order("created_at", { ascending: true }),
    ]).then(([submissions, reports]) => {
      window.clearTimeout(timeout);
      if (!active) return;
      if (submissions.error || reports.error) {
        setState({ status: "unavailable" });
        return;
      }
      setState({ status: "ready", submissions: submissions.data ?? [], reports: reports.data ?? [] });
    }).catch(() => {
      window.clearTimeout(timeout);
      if (active) setState({ status: "unavailable" });
    });

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, []);

  if (state.status === "loading") {
    return <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-10 text-center text-sm text-muted-foreground">正在读取审核队列…</div>;
  }
  if (state.status === "unavailable") {
    return <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-10 text-center"><p className="font-semibold text-foreground">暂时无法读取审核队列</p><p className="mt-2 text-sm text-muted-foreground">数据库连接较慢；页面已可使用，稍后刷新即可重试。</p></div>;
  }

  return <>
    <section>
      <h2 className="text-lg font-bold">资源投稿 <span className="text-sm font-normal text-muted-foreground">{state.submissions.length}</span></h2>
      <div className="mt-4 space-y-3">{state.submissions.length ? state.submissions.map((item) => <article key={item.id} className="rounded-xl border border-border bg-card p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold">{item.name}</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{item.description}</p></div><div className="flex gap-2"><form action={reviewSubmission}><input type="hidden" name="id" value={item.id}/><input type="hidden" name="status" value="approved"/><button className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">通过并发布</button></form><form action={reviewSubmission}><input type="hidden" name="id" value={item.id}/><input type="hidden" name="status" value="rejected"/><button className="rounded-lg border border-border px-3 py-2 text-sm font-semibold">拒绝</button></form></div></div>{item.website_url ? <a href={item.website_url} className="mt-3 block text-sm text-primary" target="_blank" rel="noreferrer">{item.website_url}</a> : null}</article>) : <p className="text-sm text-muted-foreground">没有待审核投稿。</p>}</div>
    </section>
    <section>
      <h2 className="text-lg font-bold">失效反馈 <span className="text-sm font-normal text-muted-foreground">{state.reports.length}</span></h2>
      <div className="mt-4 space-y-3">{state.reports.length ? state.reports.map((item) => <article key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5"><div><p className="font-semibold">{item.resources?.name ?? "已删除资源"}</p><p className="mt-1 text-sm text-muted-foreground">{item.report_type}{item.details ? ` · ${item.details}` : ""}</p></div><form action={resolveBrokenReport}><input type="hidden" name="id" value={item.id}/><button className="rounded-lg border border-border px-3 py-2 text-sm font-semibold">标记已处理</button></form></article>) : <p className="text-sm text-muted-foreground">没有待处理反馈。</p>}</div>
    </section>
  </>;
}
