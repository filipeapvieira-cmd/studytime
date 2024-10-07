import { db } from "@/src/lib/db";
import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/authentication";

export async function DELETE(req: Request, context: any) {
  const { params } = context;
  const sessionId: number = Number(params.sessionId);
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

  const deleteSession = async () => {
    await db.studySession.delete({
      where: {
        id: sessionId,
      },
    });
  };

  try {
    const deletedSession = await deleteSession();

    return NextResponse.json(
      {
        status: "success",
        message: "Session deleted successfully",
        data: deletedSession,
      },
      { status: 200 }
    );
  } catch (error) {
    let message = "Something went wrong. Unable to delete session...";

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
