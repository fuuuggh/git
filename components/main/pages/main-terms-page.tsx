"use client";

import { useLocale } from "@/components/shared/locale-provider";
import React from "react";

const MainTermsPage = () => {
  const { messages } = useLocale();
  const copy = messages.legal;
  return (
    <div className="py-4 sm:py-8">
      <div className="max-w-3xl rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">nook</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.045em] text-foreground sm:text-4xl">
            {copy.termsTitle}
          </h1>

          <ol className="mt-8 space-y-5">
          {copy.terms.map((item, index) => (
            <li key={item} className="flex gap-4 text-sm leading-7 text-muted-foreground sm:text-base"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-primary">{index + 1}</span>
              {item}
            </li>
          ))}
          </ol>
      </div>
    </div>
  );
};

export default MainTermsPage;
