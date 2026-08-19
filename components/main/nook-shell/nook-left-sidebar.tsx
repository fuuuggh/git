"use client";

import LanguageSwitcher from "@/components/shared/language-switcher";
import { useLocale } from "@/components/shared/locale-provider";
import { LoginMenu } from "@/components/login";
import { BookOpen, CircleHelp, FolderKanban, Home, Send, Tags } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NookLeftSidebar() {
  const { messages } = useLocale();
  const pathname = usePathname();
  const navigation = [
    { href: "/", title: messages.footer.home, icon: Home },
    { href: "/blog", title: messages.navigation.posts, icon: BookOpen },
    { href: "/resources", title: messages.navigation.resources, icon: FolderKanban },
    { href: "/search", title: messages.nook.search, icon: Tags },
    { href: "/about", title: messages.navigation.about, icon: CircleHelp },
  ];

  return (
    <aside className="hidden min-h-screen flex-col border-r border-border/80 bg-card/70 px-5 py-7 lg:sticky lg:top-0 lg:flex lg:h-screen">
      <Link href="/" className="flex items-center gap-3 px-2" aria-label="nook">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-lg font-bold tracking-[-0.08em] text-primary-foreground shadow-sm">B</span>
        <span><b className="block text-base tracking-[-0.04em]">nook</b><small className="mt-0.5 block text-xs text-muted-foreground">{messages.nook.tagline}</small></span>
      </Link>

      <nav className="mt-10 space-y-1" aria-label={messages.nook.primaryNavigation}>
        {navigation.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}><Icon className="h-4 w-4" aria-hidden="true" />{item.title}</Link>;
        })}
      </nav>

      <div className="mt-auto space-y-4 border-t border-border pt-5">
        <Link href="/submit" className="flex items-center gap-3 rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"><Send className="h-4 w-4 text-primary" aria-hidden="true" />{messages.navigation.submit}</Link>
        <div className="flex items-center justify-between px-1"><LanguageSwitcher /><LoginMenu /></div>
        <p className="px-1 text-xs leading-5 text-muted-foreground">{messages.nook.sidebarNote}</p>
      </div>
    </aside>
  );
}
