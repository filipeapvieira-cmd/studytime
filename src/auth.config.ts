import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { getUserByEmail } from "@/src/data/user";
import { LoginSchema } from "@/src/schemas";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);

          // It might happen that the user exists but the password is not set. It is the case when the user used a social login.
          if (!user || !user.password) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            return { ...user, id: user.id.toString() };
          }
        }
        return null;
      },
    }),
    Credentials({
      id: "email-verification",
      name: "Email Verification",
      credentials: {
        email: {},
        verificationSecret: {},
      },
      async authorize(credentials) {
        const secret = process.env.VERIFICATION_SIGN_IN_SECRET;
        if (!secret || credentials.verificationSecret !== secret) return null;

        const user = await getUserByEmail(credentials.email as string);
        if (!user || !user.emailVerified) return null;

        return { ...user, id: user.id.toString() };
      },
    }),
  ],
} satisfies NextAuthConfig;
