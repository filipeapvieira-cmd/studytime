import { db } from "@/src/lib/db";
import { NextResponse } from "next/server";
import { FullSessionLogUpdate } from "@/src/types";
import { getSessionUpdateData, topicsToDelete } from "@/src/lib/api/utils";
import { currentUser } from "@/src/lib/authentication";

export async function PUT(req: Request, context: any) {
  const { params } = context;
  const id: number = Number(params.sessionId);
  const user = await currentUser();

  if (!user) {
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
  const sessionToUpdate: FullSessionLogUpdate = await req.json();

  const sessionData = getSessionUpdateData(sessionToUpdate, userId);

  const updateSession = async () => {
    return await db.$transaction(async (tx) => {
      await tx.topic.deleteMany({
        where: {
          id: { in: await topicsToDelete(sessionToUpdate) },
        },
      });
      await tx.studySession.update({
        where: { id },
        data: sessionData,
      });
    });
  };

  /*   const updateSession = async () => {
    return await db.$transaction(async (tx) => {
      await tx.studySession.delete({
        where: { id },
      });
      await tx.studySession.create({ data: sessionData });
    });
  }; */
  await updateSession();
  try {
    // await updateSession();

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
