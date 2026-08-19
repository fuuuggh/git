import { createPublishedPost } from "@/actions/admin/create-post";

export default async function NewAdminPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">管理员</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">发布文章</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">先用这个稳定的基础编辑入口发布内容；富文本、封面和标签会在下一阶段统一完善。</p>
      {error ? <p className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">保存失败。请检查标题、英文网址名、摘要和正文；网址名不能重复。</p> : null}
      <form action={createPublishedPost} className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">标题<input required name="title" maxLength={120} className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none focus:border-primary" /></label>
          <label className="grid gap-2 text-sm font-medium">网址名（英文）<input required name="slug" placeholder="my-first-post" pattern="[a-z0-9-]+" className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none focus:border-primary" /></label>
        </div>
        <label className="grid gap-2 text-sm font-medium">分类<input required name="category" placeholder="学习笔记" maxLength={50} className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none focus:border-primary" /></label>
        <label className="grid gap-2 text-sm font-medium">摘要<textarea required name="description" rows={3} maxLength={300} className="resize-y rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none focus:border-primary" /></label>
        <label className="grid gap-2 text-sm font-medium">正文<textarea required name="body" rows={16} placeholder="直接输入文章内容；空一行会成为新段落。" className="resize-y rounded-xl border border-input bg-background px-3 py-3 font-normal leading-7 outline-none focus:border-primary" /></label>
        <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">发布文章</button>
      </form>
    </main>
  );
}
