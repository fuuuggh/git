import { PublicResource } from "@/lib/resources";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";

const pricingLabel = {
  free: "免费",
  freemium: "免费增值",
  open_source: "开源",
} as const;

export default function MainResourceCard({ resource }: { resource: PublicResource }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-[0.14em] text-primary uppercase">
            {resource.categories?.name ?? "未分类"}
          </p>
          <h2 className="mt-2 truncate text-lg font-bold tracking-tight text-foreground">
            <Link href={`/resources/${resource.slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {resource.name}
            </Link>
          </h2>
        </div>
        <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
          {resource.open_source ? "开源" : pricingLabel[resource.pricing]}
        </span>
      </div>
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">{resource.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {resource.platforms.slice(0, 3).map((platform) => (
          <span key={platform} className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
            {platform}
          </span>
        ))}
        {resource.tags.slice(0, 2).map((tag) => (
          <span key={tag.slug} className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
            {tag.name}
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-center gap-3 pt-6 text-sm">
        <Link href={`/resources/${resource.slug}`} className="font-semibold text-primary transition-colors hover:text-primary/75">
          查看详情
        </Link>
        {resource.website_url ? (
          <a href={resource.website_url} target="_blank" rel="noreferrer" aria-label={`访问 ${resource.name} 官网`} className="text-muted-foreground transition-colors hover:text-foreground">
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
        {resource.github_url ? (
          <a href={resource.github_url} target="_blank" rel="noreferrer" aria-label={`访问 ${resource.name} GitHub`} className="text-muted-foreground transition-colors hover:text-foreground">
            <Github className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
