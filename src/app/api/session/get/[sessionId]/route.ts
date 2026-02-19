import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/authentication";
import { decryptJournalingText } from "@/src/lib/crypto";
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
  const id = Number(sessionIdStr);
  const userId = Number(user.id);

  // Verify ownership before returning data
  const session = await db.studySession.findFirst({
    where: { id, userId },
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

  const [feelings, topics] = await db.$transaction([
    db.feeling.findUnique({
      where: {
        sessionId: id,
      },
    }),
    db.topic.findMany({
      where: {
        sessionId: id,
      },
    }),
  ]);

  const decryptedTopics = await Promise.all(
    topics.map(async (topic) => ({
      ...topic,
      description: await decryptJournalingText(topic.description),
    })),
  );

  const decryptedFeelings = feelings
    ? {
        ...feelings,
        description:
          (await decryptJournalingText(feelings.description)) ||
          feelings.description,
      }
    : null;

  return NextResponse.json({
    topics: decryptedTopics,
    feelings: decryptedFeelings,
  });
}
