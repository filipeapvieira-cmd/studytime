import { type NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/src/lib/authentication";
import { db } from "@/src/lib/db";

export async function GET(req: NextRequest) {
  const user = await currentUser();

  if (!user || !user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = Number(user.id);

  try {
    const [sessionsCount, topicsCount, cloudinaryConfigCount] =
      await Promise.all([
        db.studySession.count({ where: { userId } }),
        db.topic.count({
          where: { studySession: { userId } },
        }),
        db.cloudinaryConfig.count({ where: { userId } }),
      ]);

    return NextResponse.json({
      sessions: sessionsCount,
      topics: topicsCount,
      cloudinaryConfigs: cloudinaryConfigCount,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
