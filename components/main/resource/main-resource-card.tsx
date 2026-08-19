"use client";

import { useLocale } from "@/components/shared/locale-provider";
import { PublicResource } from "@/lib/resources";
import { ArrowUpRight, CheckCircle2, ExternalLink, Github } from "lucide-react";
import Link from "next/link";

export default function MainResourceCard({ resource }: { resource: PublicResource }) {
  const { messages } = useLocale();
  const pricingLabel = {
    free: messages.resources.free,
    freemium: messages.resources.freemium,
    open_source: messages.resources.openSource,
  } as const;
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-sm font-bold tracking-[-0.06em] text-primary">{resource.name.slice(0, 2).toUpperCase()}</div>
          <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">{resource.categories?.name ?? messages.common.uncategorized}</p>
          <h2 className="mt-1 truncate text-lg font-bold tracking-[-0.035em] text-foreground">
            <Link href={`/resources/${resource.slug}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {resource.name}
            </Link>
          </h2>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
          {resource.open_source ? messages.resources.openSource : pricingLabel[resource.pricing]}
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
      <div className="mt-auto flex items-center gap-3 border-t border-border pt-4 text-sm">
        <Link href={`/resources/${resource.slug}`} className="inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:opacity-70">
          {messages.resourceCard.details}<ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
        <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 text-primary/70" />{resource.last_checked_at ? new Intl.DateTimeFormat(messages.blog.dateLocale, { month: "short", day: "numeric" }).format(new Date(resource.last_checked_at)) : messages.resourceDetail.pendingCheck}</span>
        {resource.website_url ? (
          <a href={resource.website_url} target="_blank" rel="noreferrer" aria-label={messages.resourceCard.visitSite.replace("{name}", resource.name)} className="text-muted-foreground transition-colors hover:text-foreground">
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
        {resource.github_url ? (
          <a href={resource.github_url} target="_blank" rel="noreferrer" aria-label={messages.resourceCard.visitGithub.replace("{name}", resource.name)} className="text-muted-foreground transition-colors hover:text-foreground">
            <Github className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </article>
  );
}
