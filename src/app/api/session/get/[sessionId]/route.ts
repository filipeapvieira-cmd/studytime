import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request, context: any) {
  const { params } = context;
  const id = params.sessionId;

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
