"use client";

import { type Locale, messages } from "@/lib/i18n";
import { createContext, useContext } from "react";

const LocaleContext = createContext<Locale>("zh");

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const locale = useContext(LocaleContext);
  return { locale, messages: messages[locale] };
}
