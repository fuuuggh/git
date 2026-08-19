import AdminResourceManager from "@/components/protected/admin/admin-resource-manager";

export default function AdminResourcesPage() {
  return <main className="mx-auto max-w-5xl px-6 py-10"><p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">管理员</p><div className="mt-3 flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-bold tracking-tight">资源管理</h1><p className="mt-2 text-sm text-muted-foreground">修改资源状态会同步影响前台资源库。</p></div><a href="/admin/resources/new" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">发布资源</a></div><div className="mt-8"><AdminResourceManager /></div></main>;
}
