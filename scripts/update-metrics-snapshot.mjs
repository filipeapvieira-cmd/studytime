/**
 * Manually create a MetricsSnapshot record.
 *
 * Usage:  npm run db:snapshot
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
    console.log("⏳ Collecting metrics…");

    const [usersCount, sessionsCount, consentEnabledCount] = await Promise.all([
        db.user.count(),
        db.studySession.count(),
        db.user.count({ where: { journalingConsentEnabled: true } }),
    ]);

    const dbSizeResult =
        await db.$queryRaw`SELECT pg_database_size(current_database()) as size`;
    const dbSizeBytes = dbSizeResult[0]?.size
        ? BigInt(dbSizeResult[0].size)
        : BigInt(0);

    const snapshot = await db.metricsSnapshot.create({
        data: {
            usersCount,
            sessionsCount,
            consentEnabledCount,
            retentionPurgedSessionsCount: 0,
            dbSizeBytes,
            metadata: {
                source: "manual",
                ranAt: new Date().toISOString(),
            },
        },
    });

    const sizeMB = (Number(dbSizeBytes) / 1024 / 1024).toFixed(2);

    console.log("✅ Snapshot created successfully!");
    console.log(`   ID:                ${snapshot.id}`);
    console.log(`   DB size:           ${sizeMB} MB`);
    console.log(`   Users:             ${usersCount}`);
    console.log(`   Sessions:          ${sessionsCount}`);
    console.log(`   Consent enabled:   ${consentEnabledCount}`);
}

main()
    .catch((err) => {
        console.error("❌ Failed to create snapshot:", err);
        process.exit(1);
    })
    .finally(() => db.$disconnect());
