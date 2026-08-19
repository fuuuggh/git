"use client";

import { useLocale } from "@/components/shared/locale-provider";
import { ArrowUpRight, CheckCircle2, FolderKanban, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function NookRightSidebar() {
  const { messages } = useLocale();
  const categories = [messages.nook.development, messages.nook.learning, messages.nook.design, messages.nook.efficiency];

  return (
    <aside className="hidden border-l border-border/80 bg-card/45 px-5 py-7 xl:block">
      <div className="sticky top-7 space-y-5">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary"><ShieldCheck className="h-5 w-5" /></div>
          <h2 className="mt-4 font-bold tracking-tight">{messages.nook.qualityTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{messages.nook.qualityDescription}</p>
          <Link href="/about" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:opacity-75">{messages.home.learnMore}<ArrowUpRight className="h-3.5 w-3.5" /></Link>
        </section>
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2"><FolderKanban className="h-4 w-4 text-primary" /><h2 className="font-bold tracking-tight">{messages.nook.exploreTitle}</h2></div>
          <div className="mt-4 space-y-1">
            {categories.map((category) => <Link href="/resources" key={category} className="flex items-center justify-between rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"><span>{category}</span><ArrowUpRight className="h-3.5 w-3.5" /></Link>)}
          </div>
        </section>
        <section className="rounded-2xl border border-dashed border-border bg-transparent p-5">
          <div className="flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="h-4 w-4 text-primary" />{messages.nook.statusTitle}</div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{messages.nook.statusDescription}</p>
        </section>
      </div>
    </aside>
  );
}
