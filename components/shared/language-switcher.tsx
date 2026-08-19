"use client";

import { useLocale } from "@/components/shared/locale-provider";
import { Languages } from "lucide-react";

export default function LanguageSwitcher() {
  const { locale, messages } = useLocale();
  const nextLocale = locale === "zh" ? "en" : "zh";

  function switchLocale() {
    document.cookie = `site_locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  }

  return <button type="button" onClick={switchLocale} title={nextLocale === "en" ? messages.switchToEnglish : messages.switchToChinese} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent" aria-label={nextLocale === "en" ? messages.switchToEnglish : messages.switchToChinese}><Languages className="h-4 w-4" />{locale === "zh" ? "EN" : "中文"}</button>;
}
