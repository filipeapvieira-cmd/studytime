"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";

import type { z } from "zod";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";

import { getRateLimit } from "@/src/lib/rate-limit";
import { RegisterSchema } from "@/src/schemas/index";
import { createUser, getUserByEmail } from "../data/user";
import { db } from "../lib/db";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";

export type FormState = {
  error?: string;
  success?: string;
};

export async function register(
  data: z.infer<typeof RegisterSchema>,
): Promise<FormState> {
  const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
  const isAllowed = await getRateLimit(ip);

  if (!isAllowed) {
    return { error: "Too many attempts. Please try again later." };
  }

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

  const verificationToken = await generateVerificationToken(email);
  if (!verificationToken) return { error: "Something went wrong!" };
  await sendVerificationEmail(
    verificationToken?.email,
    verificationToken?.token,
  );

  return { success: "Confirmation email sent!" };
}
