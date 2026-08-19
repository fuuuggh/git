"use client";

import { useLocale } from "@/components/shared/locale-provider";
import { GithubIcon, GoogleIcon, LoadingDots } from "@/icons";
import { getUrl } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const getLoginRedirectPath = (pathname?: string | null): string => {
  return (
    getUrl() +
    "/auth/callback" + // Required for PKCE authentication.
    "?redirect=" + // Passed to auth/route/callback to redirect after auth
    (pathname ? pathname : "/dashboard")
  );
};

interface LoginSectionProps {
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginSection: React.FC<LoginSectionProps> = ({ setOpen }) => {
  const { messages } = useLocale();
  const copy = messages.login;
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, copy.passwordHint),
  });
  const supabase = createClient();
  const form = useForm<{ email: string; password: string }>({
    resolver: zodResolver(formSchema),
  });
  const [signInGoogleClicked, setSignInGoogleClicked] =
    React.useState<boolean>(false);
  const [signInGithubClicked, setSignInGithubClicked] =
    React.useState<boolean>(false);
  const [emailError, setEmailError] = React.useState("");
  const router = useRouter();
  const currentPathname = usePathname();
  const redirectTo = getLoginRedirectPath(currentPathname);

  async function signInWithGoogle() {
    setSignInGoogleClicked(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          prompt: "consent",
        },
      },
    });
    router.refresh();
  }

  async function signInWithGitHub() {
    setSignInGithubClicked(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo,
        queryParams: {
          prompt: "consent",
        },
      },
    });
    router.refresh();
  }

  async function signInWithEmail(values: { email: string; password: string }) {
    setEmailError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setEmailError(copy.failed.replace("{message}", error.message));
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <div className="mx-auto w-full justify-center rounded-md border border-black/5 bg-gray-50 align-middle shadow-md">
        <div className="flex flex-col items-center justify-center space-y-3 border-b px-4 py-6 pt-8 text-center">
          <a href="https://ub.cafe">
            <Image
              src="/images/logo.png"
              alt="Logo"
              className="h-16 w-16 rounded-full"
              width={64}
              height={64}
              priority
            />
          </a>
          <h3 className="font-display text-2xl font-bold">
            {copy.title}
          </h3>
        </div>

        {/* Sign in buttons with Social accounts */}
        <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
          <form onSubmit={form.handleSubmit(signInWithEmail)} className="space-y-3 border-b border-black/10 pb-5">
            <label className="sr-only" htmlFor="login-email">{copy.email}</label>
            <input id="login-email" type="email" placeholder={copy.emailPlaceholder} {...form.register("email")} className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:border-primary" />
            <label className="sr-only" htmlFor="login-password">{copy.password}</label>
            <input id="login-password" type="password" placeholder={copy.passwordPlaceholder} {...form.register("password")} className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:border-primary" />
            <button type="submit" className="flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
              {copy.signIn}
            </button>
            {emailError ? <p className="text-sm text-destructive">{emailError}</p> : null}
          </form>
          <button
            disabled={signInGoogleClicked}
            className={`${
              signInGoogleClicked
                ? "cursor-not-allowed border-gray-200 bg-gray-100"
                : "border border-gray-200 bg-white text-black hover:bg-gray-50"
            } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
            onClick={() => signInWithGoogle()}
          >
            {signInGoogleClicked ? (
              <LoadingDots color="#808080" />
            ) : (
              <>
                <GoogleIcon className="h-5 w-5" />
                <p>{copy.google}</p>
              </>
            )}
          </button>

          <button
            disabled={signInGithubClicked}
            className={`${
              signInGithubClicked
                ? "cursor-not-allowed border-gray-200 bg-gray-100"
                : "border border-gray-200 bg-white text-black hover:bg-gray-50"
            } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
            onClick={() => signInWithGitHub()}
          >
            {signInGithubClicked ? (
              <LoadingDots color="#808080" />
            ) : (
              <>
                <GithubIcon className="h-5 w-5" />
                <p>{copy.github}</p>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginSection;
