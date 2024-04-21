"use client";

import { FC, useState } from "react";
import { Icons } from "@/src/components/icons";
import FormField from "./FormField";
import { useForm } from "@/src/hooks/useForm";
import { Button } from "./ui/button";
import Link from "next/link";
import { buttonVariants } from "@/src/components/ui/button";
import { useCustomToast } from "@/src/hooks/useCustomToast";
import { useRouter } from "next/navigation";
import { formFieldsAndRules } from "@/src/lib/validations/login-register/rules";
import { formLogic } from "@/src/lib/login-register/utils";

interface LoginProps {
  type: "login" | "register";
}

const Login: FC<LoginProps> = ({ type }) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    form,
    errors,
    handleChange,
    validateForm,
    isFormValid,
    hasErrors,
    resetForm,
  } = useForm(formFieldsAndRules(type));
  const { showToast } = useCustomToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /* Cannot use useState for error handling, as setErrors is an async operation and we cannot await it */
    /* As an alternative we return an object from the validateForm() */
    const errorObj = validateForm();
    if (hasErrors(errorObj)) return;

    try {
      setIsLoading(true);

      const response = await formLogic(type, form);

      showToast(response);
      resetForm();
      router.refresh(); //necessary for the rights update to be immediately reflected
      router.push(response.redirectUrl);
    } catch (error) {
      let message = "Unable to connect, please try again later";

      if (error instanceof Error) {
        message = error.message;
      }

      showToast({
        status: "error",
        message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const componentHeight = type === "login" ? "h-[500px]" : "h-[600px]";
  const btnMarginTop = type === "login" ? "mt-12" : "mt-6";
  const btnText = type === "login" ? "Login" : "Register";

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-md shadow-md border-border bg-secondary/90 overflow-hidden w-[300px] ${componentHeight}`}
    >
      <div className="flex flex-col items-center justify-center bg-primary text-primary-foreground w-full flex-1">
        <Icons.Logo size={70} />
        <p className="text-3xl">Study Time</p>
      </div>
      <form
        className="flex-[3] flex flex-col items-center justify-center"
        onSubmit={handleSubmit}
      >
        <div className="space-y-3">
          {type === "register" && (
            <FormField
              label="Name"
              type="text"
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              error={errors.name}
            />
          )}
          <FormField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <FormField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />
          {type === "register" && (
            <FormField
              label="Confirm password"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword || ""}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          )}
        </div>
        <Button
          className={`${btnMarginTop} w-full disabled:cursor-not-allowed`}
          type="submit"
          disabled={!isFormValid() || isLoading}
        >
          {isLoading && <Icons.loading className="mr-2 h-4 w-4 animate-spin" />}
          {!isLoading && btnText}
        </Button>

        {type === "login" && (
          <Link
            href="/register"
            className={`${buttonVariants({ variant: "link" })} mt-3`}
          >
            Create an account
          </Link>
        )}
      </form>
    </div>
  );
};

export default Login;
