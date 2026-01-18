"use server";

import { headers } from "next/headers";
import { AuthError } from "next-auth";
import type { z } from "zod";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { signIn } from "@/src/auth";
import { getRateLimit } from "@/src/lib/rate-limit";
import { LoginSchema } from "@/src/schemas/index";
import { getTwoFactorConfirmationByUserId } from "../data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "../data/two-factor-token";
import { getUserByEmail } from "../data/user";
import { db } from "../lib/db";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";

export type FormState = {
  error?: string;
  success?: string;
  twoFactor?: boolean;
};

export async function login(
  data: z.infer<typeof LoginSchema>,
): Promise<FormState> {
  const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
  const isAllowed = await getRateLimit(ip);

  if (!isAllowed) {
    return { error: "Too many attempts. Please try again later." };
  }

  // Server-side validation
  const validatedFields = LoginSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.password || !existingUser.email) {
    return { error: "Email does not exist" };
  }

  // If the user has not verified their email, send a new verification email
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );

    if (!verificationToken) return { error: "Something went wrong!" };

    await sendVerificationEmail(
      verificationToken?.email,
      verificationToken?.token,
    );
    return {
      success: "Please check your inbox and verify your Email address!",
    };
  }

  // 2 Factor Authentication
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    // If I have the code, verify the code, otherwise send the code
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return { error: "Invalid two factor token!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid two factor token!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Two factor token has expired!" };
      }

      // Remove the two factor token
      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      // Verify if a two factor confirmation already exists
      const existingTwoFactorConfirmation =
        await getTwoFactorConfirmationByUserId(existingUser.id);

      // If we already have a two factor confirmation, remove it
      if (existingTwoFactorConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingTwoFactorConfirmation.id,
          },
        });
      }

      // Create a new two factor confirmation
      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }
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
