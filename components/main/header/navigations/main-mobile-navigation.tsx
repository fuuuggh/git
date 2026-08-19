"use client";

import { LoginMenu } from "@/components/login";
import { Disclosure } from "@headlessui/react";
import React, { Fragment } from "react";
import { MainMobileMenuButton, MainMobileNavigationMenu } from "./menu";
import LanguageSwitcher from "@/components/shared/language-switcher";
import Link from "next/link";

const MainMobileNavigation = () => {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <nav className="mx-auto flex max-w-5xl items-center justify-between bg-background px-6 py-4 md:hidden">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-[-0.04em]"><span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-sm text-primary-foreground">B</span>nook</Link>

            {/* Mobile Menu Button */}
            <div className="flex flex-1 items-center justify-end gap-3 pr-2">
              <LanguageSwitcher />
              <LoginMenu />
              <MainMobileMenuButton open={open} />
            </div>
          </nav>

          {/* Mobile Navigation */}
          <MainMobileNavigationMenu fragment={Fragment} />
        </>
      )}
    </Disclosure>
  );
};

export default MainMobileNavigation;
