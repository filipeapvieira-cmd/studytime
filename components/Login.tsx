"use client";

import { FC, useEffect } from "react";
import { Icons } from "@/components/icons";
import FormField from "./FormField";
import { useForm } from "@/src/hooks/useForm";
import { Button } from "./ui/button";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useFetch } from "@/src/hooks/useFecth";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  loginFormRules,
  loginFormFields,
  registerFormFields,
  registerFormRules,
} from "@/lib/validations/login-register/rules";

interface LoginProps {
  type: "login" | "register";
}

const Login: FC<LoginProps> = ({ type }) => {
  const useFormParameters =
    type === "login"
      ? { initialFormState: loginFormFields, validationRules: loginFormRules }
      : {
          initialFormState: registerFormFields,
          validationRules: registerFormRules,
        };

  const { form, errors, handleChange, validateForm, isFormValid, hasErrors } =
    useForm(useFormParameters);
  const {
    updatedResponse: response,
    updatedError: error,
    isLoading,
    fetchData,
  } = useFetch();
  const { toast } = useToast();
  const router = useRouter();

  const handleFecthResponse = (response: any, error: unknown) => {
    let toastContent = {};

    const showToast = () => {
      if (response) {
        toastContent = {
          variant: "default",
          title: `Registration Successful`,
          description: `Being redirected to Login page...`,
        };
      }
      if (error) {
        toast({
          variant: "destructive",
          title: `Uh oh! Something went wrong`,
          description: `${error.message}`,
        });
      }
    };
    showToast();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /* Cannot use useState for error handling, as setErrors is an async operation and we cannot await it */
    /* As an alternative we return an object from the validateForm() */
    const errorObj = validateForm();
    if (hasErrors(errorObj)) return;

    const userDetails = {
      name: form.name,
      email: form.email,
      password: form.password,
    };

    await fetchData("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userDetails),
    });

    console.log(response);
    console.log(error);

    handleFecthResponse(response, error);

    if (response) {
      router.push("/login");
    }
  };

  const btnMarginTop = type === "login" ? "mt-11" : "mt-6";
  const btnText = type === "login" ? "Login" : "Register";

  return (
    <div className="flex flex-col items-center justify-center rounded-md shadow-md overflow-hidden w-[300px] h-[500px]">
      <div className="flex flex-col items-center justify-center bg-primary text-primary-foreground w-full flex-1">
        <Icons.logo size={70} />
        <p className="text-3xl">Study Time</p>
      </div>
      <form
        className="flex-[2.5] flex flex-col items-center justify-center"
        onSubmit={handleSubmit}
      >
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
