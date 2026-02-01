import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
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
