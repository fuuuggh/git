import MainResourceSubmitForm from "@/components/main/resource/main-resource-submit-form";
import { getRequestLocale } from "@/lib/i18n-server";
import { messages } from "@/lib/i18n";

export default async function SubmitPage() {
  const copy = messages[await getRequestLocale()].submit;
  return (
    <section className="py-4 sm:py-8">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">{copy.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.045em] text-foreground sm:text-4xl">{copy.title}</h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{copy.description}</p>
      </div>
      <MainResourceSubmitForm />
    </section>
  );
}
