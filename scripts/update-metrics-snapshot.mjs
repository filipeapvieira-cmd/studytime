/**
 * Manually create a MetricsSnapshot record.
 *
 * Usage:  npm run db:snapshot
 *         npm run db:snapshot -- --purged=10 --label="AFTER retention purge"
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// ─── Parse optional CLI args ─────────────────────────────────────────────────
function parseArgs() {
    const args = process.argv.slice(2);
    let purged = 0;
    let label = "manual";

    for (const arg of args) {
        if (arg.startsWith("--purged=")) {
            purged = Number.parseInt(arg.split("=")[1], 10) || 0;
        } else if (arg.startsWith("--label=")) {
            label = arg.split("=").slice(1).join("=");
        }
    }
    return { purged, label };
}

async function main() {
    const { purged, label } = parseArgs();
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
            retentionPurgedSessionsCount: purged,
            dbSizeBytes,
            metadata: {
                source: label,
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
    console.log(`   Purged sessions:   ${purged}`);
    console.log(`   Label:             ${label}`);
}

main()
    .catch((err) => {
        console.error("❌ Failed to create snapshot:", err);
        process.exit(1);
    })
    .finally(() => db.$disconnect());
