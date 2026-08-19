import { getPublicResource } from "@/lib/resources";
import MainResourceReportForm from "@/components/main/resource/main-resource-report-form";
import { Download, ExternalLink, FileDown, Github, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { getRequestLocale } from "@/lib/i18n-server";
import { messages } from "@/lib/i18n";

export const revalidate = 60;

const formatAttachmentSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allCopy = messages[await getRequestLocale()];
  const copy = allCopy.resourceDetail;
  const resource = await getPublicResource(slug);
  if (!resource) notFound();

  return (
    <article className="py-2 sm:py-5">
      <header className="rounded-3xl border border-border bg-card px-6 py-9 shadow-sm sm:px-10 sm:py-12">
      <div className="flex flex-wrap items-start justify-between gap-5"><div><p className="text-xs font-bold tracking-[0.16em] text-primary uppercase">{resource.categories?.name ?? allCopy.resources.eyebrow}</p>
      <h1 className="mt-4 text-4xl font-bold tracking-[-0.06em] text-foreground sm:text-5xl">{resource.name}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{resource.long_description ?? resource.description}</p></div><span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">{resource.open_source ? allCopy.resources.openSource : resource.pricing === "free" ? allCopy.resources.free : allCopy.resources.freemium}</span></div>
      <div className="mt-8 flex flex-wrap gap-3">
        {resource.website_url ? <a href={resource.website_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"><ExternalLink className="h-4 w-4" />{copy.visit}</a> : null}
        {resource.github_url ? <a href={resource.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground"><Github className="h-4 w-4" />GitHub</a> : null}
        {resource.download_url ? <a href={resource.download_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground"><Download className="h-4 w-4" />{copy.download}</a> : null}
      </div>
      </header>
      {resource.attachments.length ? <section className="mt-10 rounded-2xl border border-border bg-card p-5"><h2 className="font-semibold text-foreground">{copy.attachments}</h2><ul className="mt-4 space-y-3">{resource.attachments.map((attachment) => <li key={attachment.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"><div className="min-w-0"><p className="truncate text-sm font-medium text-foreground">{attachment.file_name}</p><p className="mt-1 text-xs text-muted-foreground">{attachment.mime_type} · {formatAttachmentSize(attachment.size_bytes)}</p></div><a href={attachment.url} download className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent"><FileDown className="h-4 w-4" />{copy.downloadFile}</a></li>)}</ul></section> : null}
      <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
        <div className="bg-card p-5"><dt className="text-sm text-muted-foreground">{copy.use}</dt><dd className="mt-2 font-semibold text-foreground">{resource.open_source ? allCopy.resources.openSource : resource.pricing === "free" ? allCopy.resources.free : allCopy.resources.freemium}</dd></div>
        <div className="bg-card p-5"><dt className="text-sm text-muted-foreground">{copy.platform}</dt><dd className="mt-2 font-semibold text-foreground">{resource.platforms.join(" · ") || copy.unmarked}</dd></div>
        <div className="bg-card p-5"><dt className="text-sm text-muted-foreground">{copy.license}</dt><dd className="mt-2 font-semibold text-foreground">{resource.license ?? copy.unmarked}</dd></div>
        <div className="bg-card p-5"><dt className="text-sm text-muted-foreground">{copy.checked}</dt><dd className="mt-2 inline-flex items-center gap-2 font-semibold text-foreground"><ShieldCheck className="h-4 w-4 text-primary" />{resource.last_checked_at ?? copy.pendingCheck}</dd></div>
      </dl>
      <MainResourceReportForm resourceId={resource.id} />
    </article>
  );
}
