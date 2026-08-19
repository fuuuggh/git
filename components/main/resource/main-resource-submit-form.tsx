"use client";

import { createSubmission, SubmissionState } from "@/actions/resource/create-submission";
import { useActionState } from "react";
import { useLocale } from "@/components/shared/locale-provider";

const initialState: SubmissionState = { status: "idle" };

export default function MainResourceSubmitForm() {
  const [state, formAction, pending] = useActionState(createSubmission, initialState);
  const { messages } = useLocale();
  const copy = messages.submit;
  if (state.status === "success") return <div className="rounded-2xl border border-primary/25 bg-primary/5 p-6 text-sm text-foreground">{state.message}</div>;
  return (
    <form action={formAction} className="mt-9 grid gap-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <label className="sr-only" aria-hidden="true">公司<input name="company" tabIndex={-1} autoComplete="off" /></label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">{copy.name}<input required name="name" className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none focus:border-primary" /></label>
        <label className="grid gap-2 text-sm font-medium">{copy.website}<input name="website" type="url" placeholder="https://" className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none focus:border-primary" /></label>
      </div>
      <label className="grid gap-2 text-sm font-medium">{copy.github}<input name="github" type="url" placeholder="https://github.com/..." className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none focus:border-primary" /></label>
      <label className="grid gap-2 text-sm font-medium">{copy.reason}<textarea required name="description" rows={5} minLength={20} className="resize-y rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none focus:border-primary" /></label>
      <label className="grid gap-2 text-sm font-medium">{copy.email}<input name="submitterEmail" type="email" className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none focus:border-primary" /></label>
      {state.status === "error" ? <p className="text-sm text-destructive">{state.message}</p> : null}
      <button disabled={pending} className="w-fit rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{pending ? copy.sending : copy.send}</button>
    </form>
  );
}
