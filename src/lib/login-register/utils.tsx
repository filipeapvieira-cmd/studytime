import { FormState, UserDetails } from "@/src/types";
import { signIn } from "next-auth/react";

export const formLogic = (type: "login" | "register", form: FormState) => {
  const userDetails =
    type === "login"
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password };

  return type === "login" ? loginUser(userDetails) : registerUser(userDetails);
};

const registerUser = async (userDetails: UserDetails) => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(userDetails),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to connect, please try again later"
    );
  }

  const obj = { ...data, redirectUrl: "/auth/login" };

  return obj;
};

const loginUser = async (userDetails: UserDetails) => {
  let signInResult = null;

  signInResult = await signIn("credentials", {
    redirect: false,
    email: userDetails.email,
    password: userDetails.password,
  });

  if (signInResult && signInResult.error) {
    throw new Error(signInResult.error);
  }

  return {
    status: "success",
    message: "Redirecting to dashboard...",
    redirectUrl: "/dashboard",
  };
};
