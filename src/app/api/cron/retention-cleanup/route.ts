import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";

const BATCH_SIZE = 200;
const MAX_TOTAL_DELETIONS = 10_000;

/**
 * Retention cleanup cron job.
 *
 * Retention age is determined by StudySession.createdAt (the "created_at" column).
 * Deleting a StudySession cascades to its Topics and Feelings via Prisma onDelete: Cascade.
 */

const POLICY_MONTHS: Record<string, number> = {
  MONTHS_6: 6,
  MONTHS_12: 12,
  MONTHS_24: 24,
};

function subtractMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() - months);
  return d;
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET;

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized" },
      { status: 401 },
    );
  }

  const now = new Date();
  let totalSessionsDeleted = 0;
  let usersProcessed = 0;

  try {
    // Find all users with a time-bound retention policy
    const users = await db.user.findMany({
      where: {
        dataRetentionPolicy: { not: "UNTIL_DELETED" },
      },
      select: {
        id: true,
        dataRetentionPolicy: true,
      },
    });

    for (const user of users) {
      if (totalSessionsDeleted >= MAX_TOTAL_DELETIONS) break;

      const months = POLICY_MONTHS[user.dataRetentionPolicy];
      if (!months) continue;

      const cutoff = subtractMonths(now, months);
      let deletedForUser = 0;

      // Delete in batches to avoid serverless timeouts
      while (totalSessionsDeleted < MAX_TOTAL_DELETIONS) {
        const oldSessions = await db.studySession.findMany({
          where: {
            userId: user.id,
            createdAt: { lt: cutoff },
          },
          select: { id: true },
          take: BATCH_SIZE,
        });

        if (oldSessions.length === 0) break;

        const ids = oldSessions.map((s) => s.id);

        // Cascade delete: Topics and Feelings are removed automatically
        await db.studySession.deleteMany({
          where: { id: { in: ids } },
        });

        deletedForUser += ids.length;
        totalSessionsDeleted += ids.length;
      }

      if (deletedForUser > 0) {
        usersProcessed++;
      }
    }

    return NextResponse.json({
      status: "success",
      data: {
        usersProcessed,
        sessionsDeleted: totalSessionsDeleted,
      },
    });
  } catch (error) {
    console.error("Retention cleanup error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 },
    );
  }
}
