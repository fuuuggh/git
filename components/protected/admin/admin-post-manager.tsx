"use client";

import { updatePostVisibility } from "@/actions/admin/manage-posts";
import { useLocale } from "@/components/shared/locale-provider";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Post = { id: string; title: string; slug: string; description: string; published: boolean; updated_at: string; categories: { name: string } | null };

export default function AdminPostManager() {
  const { messages } = useLocale();
  const copy = messages.admin;
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    (supabase.from("posts") as never as any)
      .select("id,title,slug,description,published,updated_at,categories(name)")
      .order("updated_at", { ascending: false })
      .then(({ data, error: requestError }: { data: Post[] | null; error: unknown }) => {
        if (requestError) setError(true);
        else setPosts(data ?? []);
      });
  }, []);

  if (error) return <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">{copy.postsUnavailable}</p>;
  if (!posts) return <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">{copy.loadingPosts}</p>;
  if (!posts.length) return <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">{copy.noPosts}</p>;

  return <div className="space-y-3">{posts.map((post) => (
    <article key={post.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="text-xs font-medium tracking-[0.12em] text-primary uppercase">{post.categories?.name ?? messages.common.uncategorized}</p><h2 className="mt-1 font-semibold text-foreground">{post.title}</h2><p className="mt-1 text-sm text-muted-foreground">{post.description}</p><p className="mt-2 text-xs text-muted-foreground">{post.published ? copy.published : copy.unpublished} · /posts/{post.slug}</p></div>
      <form action={async (formData) => { await updatePostVisibility(formData); router.refresh(); }}><input type="hidden" name="id" value={post.id}/><input type="hidden" name="published" value={post.published ? "false" : "true"}/><button className="rounded-lg border border-border px-3 py-2 text-sm font-semibold">{post.published ? copy.unpublish : copy.republish}</button></form>
    </article>
  ))}</div>;
}
