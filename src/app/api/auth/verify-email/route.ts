import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signIn } from "@/src/auth";
import { getUserByEmail } from "@/src/data/user";
import { getVerificationTokenByToken } from "@/src/data/verification-tokens";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const baseUrl = new URL(request.url).origin;

  if (!token) {
    return NextResponse.redirect(
      `${baseUrl}/auth/new-verification?error=Token+not+found`,
    );
  }

  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return NextResponse.redirect(
      `${baseUrl}/auth/new-verification?error=Token+does+not+exist`,
    );
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return NextResponse.redirect(
      `${baseUrl}/auth/new-verification?error=Token+has+expired`,
    );
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return NextResponse.redirect(
      `${baseUrl}/auth/new-verification?error=Email+does+not+exist`,
    );
  }

  // Mark the email as verified
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  // Delete the used verification token
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  // Sign in the user using the email-verification provider.
  // signIn() throws a NEXT_REDIRECT when redirectTo is set — this is
  // expected Next.js behavior and must be re-thrown for the redirect to work.
  await signIn("email-verification", {
    email: existingToken.email,
    verificationSecret: process.env.VERIFICATION_SIGN_IN_SECRET,
    redirectTo: "/dashboard",
  });
}
