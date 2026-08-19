"use client";

import { useLocale } from "@/components/shared/locale-provider";
import { Moon, Sun } from "lucide-react";

export default function ThemeSwitcher() {
  const { messages } = useLocale();

  function toggleTheme() {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextIsDark);
    document.cookie = `site_theme=${nextIsDark ? "dark" : "light"}; path=/; max-age=31536000; samesite=lax`;
  }

  return <button type="button" onClick={toggleTheme} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-accent" aria-label={messages.theme.toggle} title={messages.theme.toggle}><Sun className="hidden h-4 w-4 dark:block" /><Moon className="h-4 w-4 dark:hidden" /></button>;
}
