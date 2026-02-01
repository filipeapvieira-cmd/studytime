import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/authentication";
import { db } from "@/src/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
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

  const { sessionId: sessionIdStr } = await context.params;
  const id = sessionIdStr;

  const [feelings, topics] = await db.$transaction([
    db.feeling.findUnique({
      where: {
        sessionId: Number(id),
      },
    }),
    db.topic.findMany({
      where: {
        sessionId: Number(id),
      },
    }),
  ]);

  return NextResponse.json({ topics, feelings });
}
