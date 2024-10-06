import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { Topic, studySessionDto, TopicFormatted } from "@/src/types";
import { getUniqueTopicTitles } from "@/src/lib/api/utils";
import { auth } from "@/src/auth";

export async function GET() {
  const session = await auth();
  console.log(session);

  //TODO: Refactor this in all API routes
  if (!session || !session.user) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unauthorized access. Please log in.",
        data: [],
      },
      { status: 401 }
    );
  }

  const userId = +session.user.id;

  try {
    const uniqueTopics = await getUniqueTopicTitles(userId);

    if (!uniqueTopics) {
      return NextResponse.json(
        {
          status: "error",
          message: "No study sessions found for this user.",
          data: [],
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Topics retrieved successfully.",
        data: uniqueTopics,
      },
      { status: 200 }
    );
  } catch (error) {
    let message = "Something went wrong. Unable to retrieve sessions...";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      {
        status: "error",
        message,
        data: [],
      },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}
