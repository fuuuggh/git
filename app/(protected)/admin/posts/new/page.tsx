import { createPublishedPost } from "@/actions/admin/create-post";
import { getRequestLocale } from "@/lib/i18n-server";
import { messages } from "@/lib/i18n";

export default async function NewAdminPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const allCopy = messages[await getRequestLocale()];
  const copy = allCopy.admin;
  const formCopy = allCopy.adminForm;
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">{copy.eyebrow}</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">{copy.publishPost}</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{formCopy.newPostHint}</p>
      {error ? <p className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error === "images" ? formCopy.imageError : formCopy.savePostError}</p> : null}
      <form action={createPublishedPost} encType="multipart/form-data" className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">{formCopy.title}<input required name="title" maxLength={120} className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none focus:border-primary" /></label>
          <label className="grid gap-2 text-sm font-medium">{formCopy.slug}<input required name="slug" placeholder="my-first-post" pattern="[a-z0-9-]+" className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none focus:border-primary" /></label>
        </div>
        <label className="grid gap-2 text-sm font-medium">{formCopy.category}<input required name="category" placeholder="学习笔记" maxLength={50} className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none focus:border-primary" /></label>
        <label className="grid gap-2 text-sm font-medium">{formCopy.description}<textarea required name="description" rows={3} maxLength={300} className="resize-y rounded-xl border border-input bg-background px-3 py-2.5 font-normal outline-none focus:border-primary" /></label>
        <label className="grid gap-2 text-sm font-medium">{formCopy.coverImage}<input name="coverImage" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal file:mr-4 file:border-0 file:bg-transparent file:text-sm file:font-semibold" /><span className="text-xs font-normal leading-5 text-muted-foreground">{formCopy.coverImageHint}</span></label>
        <label className="grid gap-2 text-sm font-medium">{formCopy.body}<textarea required name="body" rows={16} placeholder={formCopy.bodyPlaceholder} className="resize-y rounded-xl border border-input bg-background px-3 py-3 font-normal leading-7 outline-none focus:border-primary" /></label>
        <label className="grid gap-2 text-sm font-medium">{formCopy.bodyImages}<input name="inlineImages" type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" className="rounded-xl border border-input bg-background px-3 py-2.5 font-normal file:mr-4 file:border-0 file:bg-transparent file:text-sm file:font-semibold" /><span className="text-xs font-normal leading-5 text-muted-foreground">{formCopy.bodyImagesHint}</span></label>
        <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">{copy.publishPost}</button>
      </form>
    </main>
  );
}
