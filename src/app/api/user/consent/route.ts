import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/authentication";
import { db } from "@/src/lib/db";

export async function GET() {
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unauthorized access. Please log in.",
        data: null,
      },
      { status: 401 },
    );
  }

  const userId = +user.id;

  const dbUser = await db.user.findUnique({
    where: { id: userId },
    select: { journalingConsentEnabled: true },
  });

  return NextResponse.json({
    status: "success",
    data: {
      journalingConsentEnabled: dbUser?.journalingConsentEnabled ?? false,
    },
  });
}

export async function PUT(req: Request) {
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unauthorized access. Please log in.",
        data: null,
      },
      { status: 401 },
    );
  }

  const userId = +user.id;
  const body = await req.json();
  const enabled = Boolean(body.enabled);

  await db.user.update({
    where: { id: userId },
    data: {
      journalingConsentEnabled: enabled,
      ...(enabled
        ? {
            journalingConsentAt: new Date(),
            journalingConsentVersion: "privacy-notice-v1",
            journalingConsentSource: "settings_toggle",
          }
        : {}),
    },
  });

  return NextResponse.json({
    status: "success",
    message: enabled
      ? "Journaling consent enabled."
      : "Journaling consent disabled.",
    data: { journalingConsentEnabled: enabled },
  });
}
