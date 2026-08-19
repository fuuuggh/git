import { cookies } from "next/headers";
import { type Locale, isLocale } from "./i18n";

export async function getRequestLocale(): Promise<Locale> {
  const value = (await cookies()).get("site_locale")?.value;
  return isLocale(value) ? value : "zh";
}
