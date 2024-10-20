import { db } from "@/src/lib/db";
import { NextResponse } from "next/server";
import { getSessionData } from "@/src/lib/api/utils";
import { currentUser } from "@/src/lib/authentication";

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unauthorized access. Please log in.",
        data: null,
      },
      { status: 401 }
    );
  }

  const userId: number = +user?.id;

  const sessionLog = await req.json();

  const sessionData = getSessionData(sessionLog, userId);

  try {
    await db.studySession.create({ data: sessionData });
    return NextResponse.json(
      {
        status: "success",
        message: "Session saved successfully",
        data: null,
      },
      { status: 200 }
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
      { status: 400 }
    );
  } finally {
    await db.$disconnect();
  }
}
