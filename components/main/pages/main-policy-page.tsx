"use client";

import { useLocale } from "@/components/shared/locale-provider";
import React from "react";

const MainPolicyPage = () => {
  const { messages } = useLocale();
  const copy = messages.legal;
  return (
    <div className="bg-white py-5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {copy.policyTitle}
          </p>
          <h2 className="text-md my-6 leading-7 text-gray-600">
            {copy.policyDescription}
          </h2>

          {copy.policy.map((item) => (
            <div key={item[0]}>
              <p className="mt-6 text-xl font-semibold text-gray-900">
                {item[0]}
              </p>
              <p className="text-md mt-2 leading-8 text-gray-600">
                {item[1]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPolicyPage;
