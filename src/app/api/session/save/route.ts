import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { SessionTimeAndDate, SessionLogTopicContentFeelings } from "@/types";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { getSessionData } from "@/lib/api/utils";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unauthorized access. Please log in.",
        data: null,
      },
      { status: 401 }
    );
  }

  const userId: number = +session.user.id;
  const {
    description,
    timeAndDate,
  }: {
    description: SessionLogTopicContentFeelings;
    timeAndDate: SessionTimeAndDate;
  } = await req.json();
  const sessionData = getSessionData(description, timeAndDate, userId);

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
