import { PublicPost } from "@/lib/posts";
import { ArrowUpRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NookPostCard({
  post,
  fallbackCategory,
  readLabel,
  locale,
}: {
  post: PublicPost;
  fallbackCategory: string;
  readLabel: string;
  locale: string;
}) {
  const date = new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" }).format(new Date(post.published_at ?? post.updated_at));

  return <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md">
    <Link href={`/blog/${post.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      {post.cover_image_url ? <Image src={post.cover_image_url} alt={post.title} width={960} height={540} className="aspect-[16/9] w-full object-cover transition duration-300 group-hover:scale-[1.02]" /> : <div className="flex aspect-[16/9] items-end bg-[linear-gradient(145deg,hsl(var(--secondary)),hsl(var(--muted))_58%,hsl(var(--background)))] p-5"><BookOpen className="h-6 w-6 text-primary/75" /></div>}
      <div className="p-5">
        <p className="text-xs font-semibold tracking-[0.13em] text-primary uppercase">{post.categories?.name ?? fallbackCategory}</p>
        <h2 className="mt-3 line-clamp-2 text-lg font-bold tracking-[-0.035em] text-foreground">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{post.description}</p>
        <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground"><span>{date}</span><span className="inline-flex items-center gap-1 font-semibold text-primary">{readLabel}<ArrowUpRight className="h-3.5 w-3.5" /></span></div>
      </div>
    </Link>
  </article>;
}
