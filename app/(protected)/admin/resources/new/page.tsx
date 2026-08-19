import { createResource } from "@/actions/admin/create-resource";

export default async function NewResourcePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="mx-auto max-w-3xl px-6 py-10"><p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">管理员</p><h1 className="mt-3 text-3xl font-bold tracking-tight">发布资源</h1>
    {error ? <p className="mt-5 rounded-xl border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">保存失败：请检查必填项、链接和 slug 是否正确。</p> : null}
    <form action={createResource} className="mt-8 grid gap-5 rounded-2xl border border-border bg-card p-6">
      <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium">名称<input required name="name" className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal" /></label><label className="grid gap-2 text-sm font-medium">Slug（英文网址名）<input required name="slug" placeholder="github" pattern="[a-z0-9-]+" className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal" /></label></div>
      <label className="grid gap-2 text-sm font-medium">简介<textarea required name="description" minLength={20} rows={4} className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal" /></label>
      <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium">分类<input required name="category" placeholder="开发工具" className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal" /></label><label className="grid gap-2 text-sm font-medium">使用方式<select name="pricing" className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal"><option value="free">免费</option><option value="open_source">开源</option><option value="freemium">免费增值</option></select></label></div>
      <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium">官网<input name="website" type="url" placeholder="https://" className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal" /></label><label className="grid gap-2 text-sm font-medium">GitHub<input name="github" type="url" placeholder="https://github.com/..." className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal" /></label></div>
      <div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium">平台<input name="platform" placeholder="Web, macOS, Windows" className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal" /></label><label className="grid gap-2 text-sm font-medium">许可证（可选）<input name="license" placeholder="MIT" className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal" /></label></div>
      <label className="grid gap-2 text-sm font-medium">标签（可选，以逗号分隔）<input name="tags" placeholder="效率, 开源, 开发工具" className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal" /></label>
      <button className="w-fit rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">发布资源</button>
    </form></main>;
}
