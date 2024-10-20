"use server";

import { getUserByEmail } from "@/src/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/src/schemas";
import { z } from "zod";

export const reset = async (value: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(value);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "User does not exist!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  // Send reset email
  return { success: "Reset Email sent!" };
};
