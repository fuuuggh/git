import { getPublicResource } from "@/lib/resources";
import MainResourceReportForm from "@/components/main/resource/main-resource-report-form";
import { ExternalLink, Github, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = await getPublicResource(slug);
  if (!resource) notFound();

  return (
    <article className="py-4 sm:py-8">
      <p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">{resource.categories?.name ?? "资源库"}</p>
      <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl">{resource.name}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{resource.long_description ?? resource.description}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {resource.website_url ? <a href={resource.website_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"><ExternalLink className="h-4 w-4" />访问官网</a> : null}
        {resource.github_url ? <a href={resource.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground"><Github className="h-4 w-4" />GitHub</a> : null}
      </div>
      <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
        <div className="bg-card p-5"><dt className="text-sm text-muted-foreground">使用方式</dt><dd className="mt-2 font-semibold text-foreground">{resource.open_source ? "开源" : resource.pricing === "free" ? "免费" : "免费增值"}</dd></div>
        <div className="bg-card p-5"><dt className="text-sm text-muted-foreground">支持平台</dt><dd className="mt-2 font-semibold text-foreground">{resource.platforms.join(" · ") || "未标注"}</dd></div>
        <div className="bg-card p-5"><dt className="text-sm text-muted-foreground">许可证</dt><dd className="mt-2 font-semibold text-foreground">{resource.license ?? "未标注"}</dd></div>
        <div className="bg-card p-5"><dt className="text-sm text-muted-foreground">最后检查</dt><dd className="mt-2 inline-flex items-center gap-2 font-semibold text-foreground"><ShieldCheck className="h-4 w-4 text-primary" />{resource.last_checked_at ?? "待检查"}</dd></div>
      </dl>
      <MainResourceReportForm resourceId={resource.id} />
    </article>
  );
}
