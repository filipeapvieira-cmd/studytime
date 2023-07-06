import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { SessionTimeAndDate, SessionLogTopicContentFeelings } from "@/types";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { getSessionData } from "@/lib/api/utils";

export async function PUT(req: Request, context: any) {
  const { params } = context;
  const id: number = Number(params.sessionId);
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
  //console.log(sessionData);

  const updateSession = async () => {
    return await db.$transaction(async (tx) => {
      await tx.studySession.delete({
        where: { id },
      });
      await tx.studySession.create({ data: sessionData });
    });
  };

  try {
    await updateSession();

    return NextResponse.json(
      {
        status: "success",
        message: "Session updated successfully",
        data: null,
      },
      { status: 200 }
    );
  } catch (error) {
    let message = "Something went wrong. Unable to update session...";

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
