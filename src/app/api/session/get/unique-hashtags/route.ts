import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { getUniqueHashtags } from "@/src/lib/api/utils";
import { currentUser } from "@/src/lib/authentication";

export async function GET() {
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json(
      {
        status: "error",
        message: "Unauthorized access. Please log in.",
        data: [],
      },
      { status: 401 }
    );
  }

  const userId = +user.id;

  try {
    const uniqueTopics = await getUniqueHashtags(userId);

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
        message: "Hashtags retrieved successfully.",
        data: uniqueTopics,
      },
      { status: 200 }
    );
  } catch (error) {
    let message = "Something went wrong. Unable to retrieve hashtags...";

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
