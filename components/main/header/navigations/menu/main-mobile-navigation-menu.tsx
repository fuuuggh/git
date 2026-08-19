"use client";

import { Disclosure, Transition } from "@headlessui/react";
import Link from "next/link";
import { ExoticComponent, FC, ReactNode } from "react";
import { useLocale } from "@/components/shared/locale-provider";

interface MainMobileNavigationMenuProps {
  fragment: ExoticComponent<{
    children?: ReactNode | undefined;
  }>;
}

const MainMobileNavigationMenu: FC<MainMobileNavigationMenuProps> = ({
  fragment,
}) => {
  const { messages } = useLocale();
  const navigation = [
    { title: messages.navigation.posts, href: "/blog" },
    { title: messages.navigation.resources, href: "/resources" },
    { title: messages.navigation.submit, href: "/submit" },
    { title: messages.navigation.about, href: "/about" },
  ];

  return (
    <>
      <Transition
        as={fragment}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-300"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Disclosure.Panel className="w-full border-t border-black/5 bg-gray-50 lg:hidden">
          {navigation.map((item) => (
            <Disclosure.Button key={item.href} as={Link} href={item.href} className="block border-b border-border px-8 py-4 text-base font-semibold text-foreground transition-colors hover:bg-accent">
              {item.title}
            </Disclosure.Button>
          ))}
        </Disclosure.Panel>
      </Transition>
    </>
  );
};

export default MainMobileNavigationMenu;
