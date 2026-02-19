import { NextResponse } from "next/server";
import { getSessionUpdateData, topicsToDelete } from "@/src/lib/api/utils";
import { currentUser } from "@/src/lib/authentication";
import { db } from "@/src/lib/db";
import type { FullSessionLogUpdate } from "@/src/types";

export async function PUT(
  req: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId: sessionIdStr } = await context.params;
  const id: number = Number(sessionIdStr);
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

  const userId: number = +user?.id;

  // Verify ownership before update
  const existingSession = await db.studySession.findFirst({
    where: { id, userId },
  });

  if (!existingSession) {
    return NextResponse.json(
      {
        status: "error",
        message: "Session not found or access denied.",
        data: null,
      },
      { status: 404 },
    );
  }

  const sessionToUpdate: FullSessionLogUpdate = await req.json();

  // Consent gating: reject optional journaling fields when consent is off
  const hasJournalingFields =
    (sessionToUpdate.feelingDescription &&
      sessionToUpdate.feelingDescription.trim() !== "") ||
    sessionToUpdate.topics.some(
      (t) => t.description && t.description.trim() !== "",
    );

  if (hasJournalingFields) {
    const dbUser = await db.user.findUnique({
      where: { id: userId },
      select: { journalingConsentEnabled: true },
    });

    if (!dbUser?.journalingConsentEnabled) {
      return NextResponse.json(
        {
          status: "error",
          code: "CONSENT_REQUIRED",
          message: "Consent required to store optional journaling fields.",
          data: null,
        },
        { status: 403 },
      );
    }
  }

  const sessionData = await getSessionUpdateData(sessionToUpdate);

  const idsToDelete = await topicsToDelete(sessionToUpdate, id, userId);

  // Validate that any topic with an ID provided in the update belongs to this session
  const currentSessionTopics = await db.topic.findMany({
    where: { sessionId: id },
    select: { id: true },
  });
  const currentTopicIds = new Set(currentSessionTopics.map((t) => t.id));

  for (const topic of sessionToUpdate.topics) {
    if (topic.id && typeof topic.id === "number") {
      if (!currentTopicIds.has(topic.id)) {
        return NextResponse.json(
          {
            status: "error",
            message: `Unauthorized: Topic with ID ${topic.id} does not belong to this session.`,
            data: null,
          },
          { status: 403 },
        );
      }
    }
  }

  const updateSession = async () => {
    return await db.$transaction(async (tx) => {
      await tx.topic.deleteMany({
        where: {
          id: { in: idsToDelete },
          studySession: { userId },
        },
      });
      await tx.studySession.update({
        where: { id },
        data: sessionData,
      });
    });
  };

  await updateSession();
  try {
    // await updateSession();

    return NextResponse.json(
      {
        status: "success",
        message: "Session updated successfully",
        data: null,
      },
      { status: 200 },
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
      { status: 400 },
    );
  } finally {
    await db.$disconnect();
  }
}
