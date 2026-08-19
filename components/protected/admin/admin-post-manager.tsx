"use client";

import { updatePostVisibility } from "@/actions/admin/manage-posts";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Post = { id: string; title: string; slug: string; description: string; published: boolean; updated_at: string; categories: { name: string } | null };

export default function AdminPostManager() {
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

  if (error) return <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">暂时无法读取文章；稍后刷新即可重试。</p>;
  if (!posts) return <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">正在读取文章…</p>;
  if (!posts.length) return <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">还没有文章。可先发布第一篇。</p>;

  return <div className="space-y-3">{posts.map((post) => (
    <article key={post.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="text-xs font-medium tracking-[0.12em] text-primary uppercase">{post.categories?.name ?? "未分类"}</p><h2 className="mt-1 font-semibold text-foreground">{post.title}</h2><p className="mt-1 text-sm text-muted-foreground">{post.description}</p><p className="mt-2 text-xs text-muted-foreground">{post.published ? "已发布" : "已下架"} · /posts/{post.slug}</p></div>
      <form action={async (formData) => { await updatePostVisibility(formData); router.refresh(); }}><input type="hidden" name="id" value={post.id}/><input type="hidden" name="published" value={post.published ? "false" : "true"}/><button className="rounded-lg border border-border px-3 py-2 text-sm font-semibold">{post.published ? "下架" : "重新发布"}</button></form>
    </article>
  ))}</div>;
}
