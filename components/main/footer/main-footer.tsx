"use client";

import { GithubIcon } from "@/icons/socials";
import Link from "next/link";
import { useLocale } from "@/components/shared/locale-provider";

const MainFooter = () => {
  const { messages } = useLocale();
  const copy = messages.footer;
  const pages = [
    { title: copy.home, slug: "/" },
    { title: messages.navigation.about, slug: "/about" },
    { title: copy.contact, slug: "/contact" },
  ];
  const legals = [
    { title: copy.terms, slug: "/terms" },
    { title: copy.policy, slug: "/policy" },
  ];
  return (
    <footer
      className="border-t border-border bg-card"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        {copy.landmark}
      </h2>
      <div className="mx-auto max-w-5xl px-6 pb-8 pt-16 sm:pt-20 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div>
            <p className="text-base font-semibold text-foreground">{copy.name}</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
              {copy.description}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{copy.navigation}</h3>
            <ul role="list" className="mt-4 space-y-3">
              {pages.map((page) => (
                <li key={page.slug}>
                  <Link href={page.slug} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{copy.information}</h3>
            <ul role="list" className="mt-4 space-y-3">
              {legals.map((legal) => (
                <li key={legal.slug}>
                  <Link href={legal.slug} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {legal.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-14 border-t border-border pt-8 sm:mt-16 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            {[{ name: "GitHub", url: "https://github.com/fuuuggh", icon: GithubIcon }].map((item) => (
              <a
                key={item.name}
                href={item.url}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
          <p className="mt-8 text-sm leading-5 text-muted-foreground md:order-1 md:mt-0">
            {copy.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
