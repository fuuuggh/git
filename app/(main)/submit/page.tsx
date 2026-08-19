import MainResourceSubmitForm from "@/components/main/resource/main-resource-submit-form";

export default function SubmitPage() {
  return (
    <section className="py-4 sm:py-8">
      <p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">资源投稿</p>
      <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-foreground">推荐一个值得被发现的资源。</h1>
      <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">发布前会人工检查资源链接、免费状态与基本信息；审核通过后才会出现在资源库。</p>
      <MainResourceSubmitForm />
    </section>
  );
}
