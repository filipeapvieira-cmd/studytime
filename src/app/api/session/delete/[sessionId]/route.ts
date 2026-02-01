import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/authentication";
import { db } from "@/src/lib/db";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId: sessionIdStr } = await context.params;
  const sessionId: number = Number(sessionIdStr);
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

  const userId = Number(user.id);

  // BOLA Fix: Verify ownership before deletion
  const session = await db.studySession.findFirst({
    where: { id: sessionId, userId },
  });

  if (!session) {
    return NextResponse.json(
      {
        status: "error",
        message: "Session not found or access denied.",
        data: null,
      },
      { status: 404 },
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
      { status: 200 },
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
      { status: 400 },
    );
  } finally {
    await db.$disconnect();
  }
}
