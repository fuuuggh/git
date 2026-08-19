import AdminPostManager from "@/components/protected/admin/admin-post-manager";

export default function AdminPostsPage() {
  return <main className="mx-auto max-w-5xl px-6 py-10"><p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">管理员</p><div className="mt-3 flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-bold tracking-tight">文章管理</h1><p className="mt-2 text-sm text-muted-foreground">可查看发布状态，并随时下架或重新发布文章。</p></div><a href="/admin/posts/new" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">发布文章</a></div><div className="mt-8"><AdminPostManager /></div></main>;
}
