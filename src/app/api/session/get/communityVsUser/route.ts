import { NextResponse } from "next/server";
import { currentUser } from "@/src/lib/authentication";
import { getAcademicYearData } from "@/src/lib/charts/monthlyDistributionChart.utils";
import { db } from "@/src/lib/db";
import {
  accumulateMonthlyEffectiveTimes,
  convertMsMonthlyTotalsToHours,
} from "@/src/lib/study-session-manipulation-utils";

export async function GET() {
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

  const userId: number = +user.id;

  try {
    // 1) Get the logged-in user's sessions
    const loggedInUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        StudySession: true,
      },
    });

    // 2) Get all other users' sessions
    const otherUsers = await db.user.findMany({
      where: {
        id: { not: userId },
      },
      include: {
        StudySession: true,
      },
    });

    // 3) Accumulate monthly totals for the logged-in user
    const userMonthlyTotalsMs = accumulateMonthlyEffectiveTimes(
      loggedInUser?.StudySession || [],
    );

    const userMonthlyTotalsInHours =
      convertMsMonthlyTotalsToHours(userMonthlyTotalsMs);

    // 4) Accumulate monthly totals for all other users combined
    let allCommunitySessions: any[] = [];
    for (const otherUser of otherUsers) {
      allCommunitySessions = [
        ...allCommunitySessions,
        ...otherUser.StudySession,
      ];
    }
    const communityMonthlyTotalsMs =
      accumulateMonthlyEffectiveTimes(allCommunitySessions);

    const communityMonthlyTotalsInHours = convertMsMonthlyTotalsToHours(
      communityMonthlyTotalsMs,
    );

    // 5) Group by academic year and months (September to August)
    const academicYearData = getAcademicYearData(
      userMonthlyTotalsInHours,
      communityMonthlyTotalsInHours,
    );

    return NextResponse.json(
      {
        status: "success",
        data: {
          academicYearData,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    let message = "Something went wrong. Unable to retrieve data.";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      {
        status: "error",
        message,
        data: null,
      },
      { status: 500 },
    );
  } finally {
    await db.$disconnect();
  }
}
