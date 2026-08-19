"use client";

import { createSubmission, SubmissionState } from "@/actions/resource/create-submission";
import { useActionState } from "react";

const initialState: SubmissionState = { status: "idle" };

export default function MainResourceSubmitForm() {
  const [state, formAction, pending] = useActionState(createSubmission, initialState);
  if (state.status === "success") return <div className="rounded-2xl border border-primary/25 bg-primary/5 p-6 text-sm text-foreground">{state.message}</div>;
  return (
    <form action={formAction} className="mt-9 grid gap-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <label className="sr-only" aria-hidden="true">公司<input name="company" tabIndex={-1} autoComplete="off" /></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">资源名称<input required name="name" className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none focus:border-primary" /></label>
        <label className="grid gap-2 text-sm font-medium">官网链接<input name="website" type="url" placeholder="https://" className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none focus:border-primary" /></label>
      </div>
      <label className="grid gap-2 text-sm font-medium">GitHub 链接（可选）<input name="github" type="url" placeholder="https://github.com/..." className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none focus:border-primary" /></label>
      <label className="grid gap-2 text-sm font-medium">为什么值得推荐<textarea required name="description" rows={5} minLength={20} className="resize-y rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none focus:border-primary" /></label>
      <label className="grid gap-2 text-sm font-medium">邮箱（可选，仅在需要确认时联系）<input name="submitterEmail" type="email" className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none focus:border-primary" /></label>
      {state.status === "error" ? <p className="text-sm text-destructive">{state.message}</p> : null}
      <button disabled={pending} className="w-fit rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{pending ? "提交中…" : "提交审核"}</button>
    </form>
  );
}
