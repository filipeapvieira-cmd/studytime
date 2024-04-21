"use client";
import React, { useRef } from "react";
import AuthContainer from "./container";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";

import { useForm } from "react-hook-form";
import { formSchema } from "@/src/lib/schemas/loginFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Icons } from "../icons";
import { onSubmitAction } from "@/src/app/actions/login-form-submit";
// @ts-expect-error
import { useFormState } from "react-dom";

type LoginFormSchema = z.output<typeof formSchema>;

const onSubmit = async (data: LoginFormSchema) => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("password", data.password);
  console.log(await onSubmitAction(formData));
};

export default function LoginForm() {
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });
  const formRef = useRef<HTMLFormElement>(null);
  const isValid = form.formState.isValid;
  const isLoading = false;
  return (
    <AuthContainer className="h-[500px]">
      <Form {...form}>
        <form
          ref={formRef}
          className="flex flex-col items-center justify-center w-4/5 h-4/5"
          /*           action={}
           */ onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} className="bg-white/10" />
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
                    <Input placeholder="" {...field} className="bg-white/10" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            className={`mt-12 w-full disabled:cursor-not-allowed`}
            type="submit"
            disabled={!isValid || isLoading}
          >
            {isLoading && (
              <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
            )}
            {!isLoading && "Log-in"}
          </Button>
          <Link
            href="/register"
            className={`${buttonVariants({ variant: "link" })} mt-3`}
          >
            Create an account
          </Link>
        </form>
      </Form>
    </AuthContainer>
  );
}
