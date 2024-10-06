"use server";

import { RegisterSchema } from "@/src/schemas/index";
import { z } from "zod";
import { signIn } from "@/src/auth";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "../data/user";
import { db } from "../lib/db";

export type FormState = {
  error?: string;
  success?: string;
};

export async function register(
  data: z.infer<typeof RegisterSchema>
): Promise<FormState> {
  const validatedFields = RegisterSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "User already exists!" };
  }

  await createUser({ email, password: hashedPassword, name });

  // TODO: send verification token by email
  /*  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(
    verificationToken?.email,
    verificationToken?.token
  ); */

  return { success: "Confirmation email sent!" };
}
