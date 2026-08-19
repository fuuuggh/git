"use client";

import { mainPageAboutConfig } from "@/config/main/pages";
import { useLocale } from "@/components/shared/locale-provider";

const MainAboutPage = () => {
  const { messages } = useLocale();
  const copy = messages.about;
  return (
    <div className="py-4 sm:py-8">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="max-w-2xl space-y-5">
          <h2 className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            {copy.eyebrow}
          </h2>
          <p className="text-3xl font-bold tracking-[-0.045em] text-foreground sm:text-4xl">
            {copy.title}
          </p>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {copy.description}
          </p>
        </div>
        <div className="mt-9">
          <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {mainPageAboutConfig.features.map((feature, index) => (
              <div key={feature.name} className="rounded-2xl border border-border bg-background p-5">
                <dt className="flex items-center gap-3 text-base font-semibold leading-7 text-foreground">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                    <feature.icon
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </div>
                  {copy.features[index]?.[0]}
                </dt>
                <dd className="mt-4 text-sm leading-6 text-muted-foreground">
                  {copy.features[index]?.[1]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default MainAboutPage;
