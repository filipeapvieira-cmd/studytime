"use client";

import { FC, useState } from "react";
import { Icons } from "@/components/icons";
import FormField from "./FormField";
import { EmailSchema, PasswordSchema } from "@/lib/validations/login";
import { z } from "zod";

interface LoginProps {
  type: "login" | "register";
}

type LoginForm = {
  email: string;
  password: string;
};

type LoginFormError = {
  email?: string[] | undefined;
  password?: string[] | undefined;
};

const Login: FC<LoginProps> = ({}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFormError>({
    email: undefined,
    password: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    //let error: z.infer<typeof EmailSchema>;
    switch (name) {
      case "email":
        const error = EmailSchema.safeParse(value);
        if (!error.success) {
          setErrors((prevState) => {
            return {
              ...prevState,
              [name]: [...(prevState.email || []), error.error.message],
            };
          });
        }
        break;
    }
  };
  return (
    <div className="flex flex-col items-center justify-center rounded-md shadow-md overflow-hidden w-[300px] h-[500px]">
      <div className="flex flex-col items-center justify-center bg-primary text-primary-foreground w-full flex-1">
        <Icons.logo size={70} />
        <p className="text-3xl">Study Time</p>
      </div>
      <form className="flex-1">
        <FormField
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
        />
        <FormField
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
        />
      </form>
    </div>
  );
};

export default Login;
