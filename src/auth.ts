import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getUserById } from "./data/user";

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.role) {
        //session.user.role = token.role as UserRole;
      }
      if (session.user) {
        //session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      // When we update user information, we need to update the token and consequently the session
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        // session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      // If I don't have token.sub, it means that the user is not logged in
      if (!token.sub) return token;

      // We use getUserById because it is a much less expensive query than using getUserByEmail (because it is a primary key)
      const existingUser = await getUserById(parseInt(token.sub));

      if (!existingUser) return token;
      // We add the role to the token
      //token.role = existingUser.role;
      // Add isTwoFactorEnabled
      //token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      // Related with update user information.
      // We need to know if the user was registered with OAuth, because it will have different fields to modify
      //const existingAccount = await getAccountByUserId(existingUser.id);

      // When we update user information, we need to update the token
      token.name = existingUser.name;
      token.email = existingUser.email;
      //token.isOAuth = !!existingAccount;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
