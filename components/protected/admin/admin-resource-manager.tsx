"use client";

import { updateResourceStatus } from "@/actions/admin/manage-resources";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Resource = { id: string; name: string; slug: string; description: string; status: "active" | "broken" | "archived"; updated_at: string; last_checked_at: string | null; categories: { name: string } | null };

export default function AdminResourceManager() {
  const [resources, setResources] = useState<Resource[] | null>(null);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    (supabase.from("resources") as never as any)
      .select("id,name,slug,description,status,updated_at,last_checked_at,categories(name)")
      .order("updated_at", { ascending: false })
      .then(({ data, error: requestError }: { data: Resource[] | null; error: unknown }) => {
        if (requestError) setError(true);
        else setResources(data ?? []);
      });
  }, []);

  if (error) return <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">暂时无法读取资源；稍后刷新即可重试。</p>;
  if (!resources) return <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">正在读取资源…</p>;
  if (!resources.length) return <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">还没有已发布资源。</p>;

  return <div className="space-y-3">{resources.map((resource) => (
    <article key={resource.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="text-xs font-medium tracking-[0.12em] text-primary uppercase">{resource.categories?.name ?? "未分类"}</p><h2 className="mt-1 font-semibold text-foreground">{resource.name}</h2><p className="mt-1 text-sm text-muted-foreground">{resource.description}</p><p className="mt-2 text-xs text-muted-foreground">状态：{resource.status} · 最后检查：{resource.last_checked_at?.slice(0, 10) ?? "未检查"}</p></div>
      <form action={async (formData) => { await updateResourceStatus(formData); router.refresh(); }} className="flex shrink-0 items-center gap-2"><input type="hidden" name="id" value={resource.id}/><select name="status" defaultValue={resource.status} className="rounded-lg border border-input bg-background px-3 py-2 text-sm"><option value="active">正常</option><option value="broken">失效</option><option value="archived">归档</option></select><button className="rounded-lg border border-border px-3 py-2 text-sm font-semibold">保存</button></form>
    </article>
  ))}</div>;
}
