"use client";

import MainFooter from "@/components/main/footer/main-footer";
import { useLocale } from "@/components/shared/locale-provider";
import { LogoIcon } from "@/icons";
import Link from "next/link";

const SharedNotFound = () => {
  const { messages } = useLocale();
  const copy = messages.notFound;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 pb-16 pt-20 text-center sm:pb-24 sm:pt-28">
        <LogoIcon className="mx-auto h-14 w-14" />
        <p className="mt-10 text-sm font-semibold tracking-[0.16em] text-primary">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{copy.title}</h1>
        <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">{copy.description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">{copy.home}</Link>
          <Link href="/resources" className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent">{copy.resources}</Link>
        </div>
      </main>
      <MainFooter />
    </div>
  );
};

export default SharedNotFound;
