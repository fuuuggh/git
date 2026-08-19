"use client";

import { mainPageAboutConfig } from "@/config/main/pages";
import { useLocale } from "@/components/shared/locale-provider";

const MainAboutPage = () => {
  const { messages } = useLocale();
  const copy = messages.about;
  return (
    <div className="py-5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6 lg:text-center">
          <h2 className="text-sm font-semibold tracking-[0.16em] text-primary uppercase">
            {copy.eyebrow}
          </h2>
          <p className="mt-3 text-3xl font-bold tracking-[-0.035em] text-foreground sm:text-4xl">
            {copy.title}
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {copy.description}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {mainPageAboutConfig.features.map((feature, index) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-foreground">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {copy.features[index]?.[0]}
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">
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
