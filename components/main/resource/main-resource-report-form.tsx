"use client";

import { BrokenReportState, createBrokenReport } from "@/actions/resource/create-broken-report";
import { useActionState } from "react";

const initialState: BrokenReportState = { status: "idle" };

export default function MainResourceReportForm({ resourceId }: { resourceId: string }) {
  const [state, formAction, pending] = useActionState(createBrokenReport, initialState);
  return (
    <form action={formAction} className="mt-10 rounded-2xl border border-border bg-card p-5">
      <input type="hidden" name="resourceId" value={resourceId} />
      <label className="sr-only" aria-hidden="true">公司<input name="company" tabIndex={-1} autoComplete="off" /></label>
      <p className="font-semibold text-foreground">发现资源有问题？</p>
      <p className="mt-1 text-sm text-muted-foreground">提交后会进入人工处理队列。</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <select name="reportType" defaultValue="website_broken" className="rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary">
          <option value="website_broken">官网无法访问</option>
          <option value="download_broken">下载链接失效</option>
          <option value="github_broken">GitHub 链接失效</option>
          <option value="information_incorrect">信息不正确</option>
        </select>
        <input name="message" maxLength={600} placeholder="补充说明（可选）" className="min-w-0 flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
        <button disabled={pending} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent disabled:opacity-60">{pending ? "提交中…" : "报告问题"}</button>
      </div>
      {state.status !== "idle" ? <p className={`mt-3 text-sm ${state.status === "error" ? "text-destructive" : "text-primary"}`}>{state.message}</p> : null}
    </form>
  );
}
