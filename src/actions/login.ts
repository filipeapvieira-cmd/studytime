"use server";

import { LoginSchema } from "@/src/schemas/index";
import { z } from "zod";
import { signIn } from "@/src/auth";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "../data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";

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
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.password || !existingUser.email) {
    return { error: "Email does not exist" };
  }

  // If the user has not verified their email, send a new verification email
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    if (!verificationToken) return { error: "Something went wrong!" };

    await sendVerificationEmail(
      verificationToken?.email,
      verificationToken?.token
    );
    return { success: "Confirmation email sent!" };
  }

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
