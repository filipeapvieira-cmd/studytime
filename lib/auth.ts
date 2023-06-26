import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import { db } from "@/lib/db";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      credentials: {},
      // @ts-ignore
      async authorize(credentials, _) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        if (!email || !password) {
          throw new Error("Missing username or password");
        }

        const user = await db.user.findUnique({
          where: {
            email,
          },
        });

        // if user doesn't exist or password doesn't match
        if (!user || !(await compare(password, user.password))) {
          throw new Error("Invalid username or password");
        }

        console.log("api\auth\[...nextauth]\route.ts");
        console.log(user);

        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    /*
    callback is called whenever a JSON Web Token is created (i.e. at sign in) or 
    updated (i.e whenever a session is accessed in the client).

    The arguments user, account, profile and isNewUser are only passed the first time this callback 
    is called on a new session, after the user signs in. 
    In subsequent calls, only token will be available.

    jwt() callback is invoked before the session() callback, so anything you add to the JSON Web Token will be immediately available in the session callback.
    */
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token (GitHub or Google...) to the token right after signin
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      if (user) {
        token.uid = user.id;
      }
      //console.log("jwt");
      //console.log({ token, account, user });
      return token;
    },

    async session({ session, token }) {
      /*
      Send properties to the client, like an access_token from a provider.
      */
      if (session && session.accessToken && token && token.accessToken) {
        session.accessToken = token.accessToken;
      }

      /*
      lib\auth.ts
      */
      session = {
        ...session,
        user: {
          ...session.user,
          id: String(token.uid),
        }
      }

      //console.log("session");
      //console.log({ session, token });
      return session
    }
  }
};