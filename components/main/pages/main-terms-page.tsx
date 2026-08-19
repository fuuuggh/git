"use client";

import { useLocale } from "@/components/shared/locale-provider";
import React from "react";

const MainTermsPage = () => {
  const { messages } = useLocale();
  const copy = messages.legal;
  return (
    <div className="bg-white py-5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {copy.termsTitle}
          </p>

          {copy.terms.map((item) => (
            <p key={item} className="text-md mt-8 leading-8 text-gray-600">
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainTermsPage;
