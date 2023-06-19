"use client";

import { FC } from "react";
import { Icons } from "@/components/icons";
import FormField from "./FormField";
import { useForm } from "@/src/hooks/useForm";
import { Button } from "./ui/button";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface LoginProps {
  type: "login" | "register";
}

const Login: FC<LoginProps> = ({ type }) => {
  const { form, errors, handleChange, validateForm } = useForm();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateForm();
    console.log(form.email, form.password);
  };

  const btnMarginTop = type === "login" ? "mt-11" : "mt-6";

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
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
        )}
        <Button className={`${btnMarginTop} w-full`} type="submit">
          {type === "login" ? "Login" : "Register"}
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
