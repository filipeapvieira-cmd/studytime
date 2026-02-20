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

  const startedAt = new Date();
  let totalSessionsDeleted = 0;
  let usersEvaluated = 0;
  let usersWithPurges = 0;
  let runStatus: "success" | "error" = "success";
  let runErrorMessage: string | null = null;

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
    usersEvaluated = users.length;

    for (const user of users) {
      if (totalSessionsDeleted >= MAX_TOTAL_DELETIONS) break;

      const months = POLICY_MONTHS[user.dataRetentionPolicy];
      if (!months) continue;

      const cutoff = subtractMonths(startedAt, months);
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
        usersWithPurges++;
      }
    }
  } catch (error) {
    runStatus = "error";
    runErrorMessage =
      error instanceof Error ? error.message : "Unknown retention error";
    console.error("Retention cleanup error:", error);
  }

  try {
    // 1. Get counts
    const [usersCount, sessionsCount, consentEnabledCount] = await Promise.all([
      db.user.count(),
      db.studySession.count(),
      db.user.count({ where: { journalingConsentEnabled: true } }),
    ]);

    // 2. Get DB size
    // Note: pg_database_size returns a BigInt, we need to cast or handle it.
    // querying raw SQL
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbSizeResult: any =
      await db.$queryRaw`SELECT pg_database_size(current_database()) as size`;
    const dbSizeBytes = dbSizeResult[0]?.size
      ? BigInt(dbSizeResult[0].size)
      : BigInt(0);

    // 3. Create Snapshot (always, even when there are no purges)
    const snapshot = await db.metricsSnapshot.create({
      data: {
        usersCount,
        sessionsCount,
        consentEnabledCount,
        retentionPurgedSessionsCount: totalSessionsDeleted,
        dbSizeBytes,
        metadata: {
          retentionExecutionTimeMs: Date.now() - startedAt.getTime(),
          usersEvaluated,
          usersWithPurges,
          changesDetected: totalSessionsDeleted > 0,
          runStatus,
          runErrorMessage,
        },
      },
      select: { id: true },
    });

    if (runStatus === "error") {
      return NextResponse.json(
        {
          status: "error",
          message: runErrorMessage || "Retention cleanup failed",
          data: {
            snapshotId: snapshot.id,
            usersEvaluated,
            usersWithPurges,
            sessionsDeleted: totalSessionsDeleted,
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      status: "success",
      data: {
        snapshotId: snapshot.id,
        usersEvaluated,
        usersWithPurges,
        sessionsDeleted: totalSessionsDeleted,
      },
    });
  } catch (snapshotError) {
    console.error("Metrics snapshot error:", snapshotError);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 },
    );
  }
}
