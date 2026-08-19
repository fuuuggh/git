"use client";

import { useLocale } from "@/components/shared/locale-provider";
import React from "react";

const MainPolicyPage = () => {
  const { messages } = useLocale();
  const copy = messages.legal;
  return (
    <div className="py-4 sm:py-8">
      <div className="max-w-3xl rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">nook</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.045em] text-foreground sm:text-4xl">
            {copy.policyTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            {copy.policyDescription}
          </p>

          {copy.policy.map((item) => (
            <section key={item[0]} className="mt-7 border-t border-border pt-6 first:border-0 first:pt-0">
              <h2 className="text-lg font-semibold tracking-[-0.025em] text-foreground">
                {item[0]}
              </h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">
                {item[1]}
              </p>
            </section>
          ))}
      </div>
    </div>
  );
};

export default MainPolicyPage;
