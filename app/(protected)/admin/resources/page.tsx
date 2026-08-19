import AdminResourceManager from "@/components/protected/admin/admin-resource-manager";
import { getRequestLocale } from "@/lib/i18n-server";
import { messages } from "@/lib/i18n";

export default async function AdminResourcesPage() {
  const copy = messages[await getRequestLocale()].admin;
  return <main className="mx-auto max-w-5xl px-6 py-10"><p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">{copy.eyebrow}</p><div className="mt-3 flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-bold tracking-tight">{copy.resourceManager}</h1><p className="mt-2 text-sm text-muted-foreground">{copy.resourceManagerHint}</p></div><a href="/admin/resources/new" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">{copy.publishResource}</a></div><div className="mt-8"><AdminResourceManager /></div></main>;
}
