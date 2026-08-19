"use client";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/shared/locale-provider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactFormSchema } from "@/lib/validation/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 as SpinnerIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

type ContactFormValues = z.infer<typeof contactFormSchema>;

const defaultValues: Partial<ContactFormValues> = {
  name: "",
  email: "",
  message: "",
};

const MainContactPage = () => {
  const { messages } = useLocale();
  const copy = messages.contact;
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
  });

  async function onSubmit(data: ContactFormValues) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      });
      if (!response?.ok) {
        throw new Error("Contact request failed");
      }
      form.reset();
      toast.success(copy.sent);
    } catch (error) {
      console.error(copy.failed, error);
      toast.error(copy.failed);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="py-4 sm:py-8">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">nook</p>
        <h2 className="mt-3 text-3xl font-bold tracking-[-0.045em] text-foreground sm:text-4xl">
          {copy.title}
        </h2>
        <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          {copy.description}
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-8 grid max-w-2xl gap-5"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  {copy.name}
                </FormLabel>
                <div className="flex w-full">
                  <FormControl>
                    <Input className="rounded-xl bg-background" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  {copy.email}
                </FormLabel>
                <div className="flex w-full">
                  <FormControl>
                    <Input className="rounded-xl bg-background" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  {copy.message}
                </FormLabel>
                <div className="flex w-full">
                  <FormControl>
                    <Textarea className="min-h-36 resize-y rounded-xl bg-background" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-fit rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.98]"
          >
            {isLoading && <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />}
            {copy.send}
          </Button>
        </form>
      </Form>
      </div>
    </div>
  );
};

export default MainContactPage;
