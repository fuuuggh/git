"use client";

import { useLocale } from "@/components/shared/locale-provider";
import { Search } from "lucide-react";

export default function NookDesktopTopbar() {
  const { messages } = useLocale();

  return <div className="hidden h-[4.5rem] items-center border-b border-border/80 bg-background/70 px-8 backdrop-blur-xl lg:flex xl:px-12">
    <form action="/search" className="relative w-full max-w-xl">
      <label htmlFor="site-search" className="sr-only">{messages.search.placeholder}</label>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <input id="site-search" name="q" placeholder={messages.search.placeholder} className="w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/20" />
    </form>
  </div>;
}
