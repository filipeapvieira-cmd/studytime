import { NextResponse } from "next/server";
import { getFirstErrorMessage, getSessionData } from "@/src/lib/api/utils";
import { currentUser } from "@/src/lib/authentication";
import { db } from "@/src/lib/db";
import { FullSessionLogSchema } from "@/src/schemas/studySession.schema";
import type { FullSessionLog } from "@/src/types";

export async function POST(req: Request) {
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

  const userId: number = +user?.id;

  const response: unknown = await req.json();
  const parseResult = FullSessionLogSchema.safeParse(response);

  if (!parseResult.success) {
    const flattened = parseResult.error.flatten();
    const message = getFirstErrorMessage(flattened);

    return NextResponse.json(
      {
        status: "error",
        message,
        data: null,
      },
      { status: 400 },
    );
  }

  const sessionLog = parseResult.data as FullSessionLog;

  // Consent gating: reject optional journaling fields when consent is off
  const hasJournalingFields =
    (sessionLog.feelingDescription &&
      sessionLog.feelingDescription.trim() !== "") ||
    sessionLog.topics.some((t) => t.description && t.description.trim() !== "");

  if (hasJournalingFields) {
    const dbUser = await db.user.findUnique({
      where: { id: userId },
      select: { journalingConsentEnabled: true },
    });

    if (!dbUser?.journalingConsentEnabled) {
      return NextResponse.json(
        {
          status: "error",
          code: "CONSENT_REQUIRED",
          message: "Consent required to store optional journaling fields.",
          data: null,
        },
        { status: 403 },
      );
    }
  }

  const sessionData = await getSessionData(sessionLog, userId);

  try {
    await db.studySession.create({ data: sessionData });
    return NextResponse.json(
      {
        status: "success",
        message: "Session saved successfully",
        data: null,
      },
      { status: 200 },
    );
  } catch (error) {
    let message = "Something went wrong. Unable to save session...";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      {
        status: "error",
        message,
        data: null,
      },
      { status: 400 },
    );
  } finally {
    await db.$disconnect();
  }
}
