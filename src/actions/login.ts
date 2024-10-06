"use server";

import { LoginSchema } from "@/src/schemas/index";
import { z } from "zod";
import { signIn } from "@/src/auth";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";
import { AuthError } from "next-auth";

export type FormState = {
  error?: string;
  success?: string;
};

export async function login(
  data: z.infer<typeof LoginSchema>
): Promise<FormState> {
  // Server-side validation
  const validatedFields = LoginSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return { error: "Invalid credentials!" };
        }
        default: {
          return { error: "Something went wrong!" };
        }
      }
    }
    // If you use this inside a server actions and don't throw Error you will not be redirected
    throw error;
  }

  return { success: "Email sent!" };
}
