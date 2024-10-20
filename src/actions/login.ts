"use server";

import { LoginSchema } from "@/src/schemas/index";
import { z } from "zod";
import { signIn } from "@/src/auth";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "../data/user";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { getTwoFactorTokenByEmail } from "../data/two-factor-token";
import { db } from "../lib/db";
import { getTwoFactorConfirmationByUserId } from "../data/two-factor-confirmation";

export type FormState = {
  error?: string;
  success?: string;
  twoFactor?: boolean;
};

export async function login(
  data: z.infer<typeof LoginSchema>
): Promise<FormState> {
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
      existingUser.email
    );

    if (!verificationToken) return { error: "Something went wrong!" };

    await sendVerificationEmail(
      verificationToken?.email,
      verificationToken?.token
    );
    return { success: "Confirmation email sent!" };
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
