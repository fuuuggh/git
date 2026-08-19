import MainResourceSubmitForm from "@/components/main/resource/main-resource-submit-form";
import { getRequestLocale } from "@/lib/i18n-server";
import { messages } from "@/lib/i18n";

export default async function SubmitPage() {
  const copy = messages[await getRequestLocale()].submit;
  return (
    <section className="py-4 sm:py-8">
      <p className="text-sm font-medium tracking-[0.16em] text-primary uppercase">{copy.eyebrow}</p>
      <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-foreground">{copy.title}</h1>
      <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">{copy.description}</p>
      <MainResourceSubmitForm />
    </section>
  );
}
