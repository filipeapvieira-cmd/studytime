"use client";

import React, { useRef, useState, useTransition } from "react";
import CardWrapper from "./card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/src/schemas";
import { z } from "zod";
import { login } from "@/src/actions/login";
import FormError from "../form-error";
import FormSuccess from "../form-success";

export default function LoginForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });
  const formRef = useRef<HTMLFormElement>(null);
  const isValid = form.formState.isValid;

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const response = await login(data);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess(response.success);
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
      showSocial={!isPending}
    >
      <Form {...form}>
        <form
          ref={formRef}
          className="flex flex-col items-center justify-center w-full h-4/5 mx-auto space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-3 w-full">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      className="bg-white/10"
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      className="bg-white/10"
                      type="password"
                      disabled={isPending}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            className={`w-full disabled:cursor-not-allowed`}
            type="submit"
            disabled={!isValid || isPending}
          >
            {isPending && (
              <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
            )}
            {!isPending && "Log-in"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
