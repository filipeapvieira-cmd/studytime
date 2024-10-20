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
import { RegisterSchema } from "@/src/schemas";
import { z } from "zod";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import { register } from "@/src/actions/register";

export default function RegisterForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: "", email: "", password: "" },
    mode: "onBlur",
  });
  const formRef = useRef<HTMLFormElement>(null);
  const isValid = form.formState.isValid;

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const response = await register(data);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess(response.success);
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
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
            {!isPending && "Register"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
