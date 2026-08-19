"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/shared/locale-provider";

const MainDesktopNavigationMenu = () => {
  const currentPath = usePathname();
  const { messages } = useLocale();
  const navigation = [
    { title: messages.navigation.posts, href: "/" },
    { title: messages.navigation.resources, href: "/resources" },
    { title: messages.navigation.submit, href: "/submit" },
    { title: messages.navigation.about, href: "/about" },
  ];
  return (
    <>
      <div className="hidden gap-x-6 md:flex">
        {navigation.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            className={cn(
              "relative inline-flex items-center rounded-full px-4 py-1.5 text-base font-semibold tracking-tight text-gray-500 antialiased ring-1 ring-transparent transition duration-200 [word-spacing:-5px] active:scale-[96%] active:ring-black/20",
              {
                "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-50 px-4 text-gray-600 shadow-md shadow-black/5 ring-1 ring-black/10":
                  currentPath === item.href,
              },
              {
                "bg-transparent ring-transparent hover:bg-gradient-to-tr hover:from-gray-200 hover:via-gray-100 hover:to-gray-50 hover:shadow-md hover:shadow-black/5 hover:ring-1 hover:ring-black/10":
                  currentPath !== item.href,
              },
            )}
          >
            <div className="relative">{item.title}</div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default MainDesktopNavigationMenu;
