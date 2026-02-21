/**
 * ESG Evidence Demo – Seed → Purge → Snapshot
 *
 * Creates demo users with time-bound retention policies, backdated sessions,
 * takes BEFORE/AFTER MetricsSnapshots, and runs the retention-purge logic
 * inline so the MetricsSnapshot table documents every deletion.
 *
 * Usage:  npm run db:esg-demo
 */

import { PrismaClient } from "@prisma/client";
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_SCRIPT = resolve(__dirname, "update-metrics-snapshot.mjs");

const db = new PrismaClient();

// ─── Config ──────────────────────────────────────────────────────────────────

const DEMO_DOMAIN = "@esg-demo.local";

const DEMO_USERS = [
    {
        name: "Erin (6-month retention)",
        email: `erin${DEMO_DOMAIN}`,
        policy: "MONTHS_6",
        oldSessionCount: 300, // sessions created BEFORE the cutoff → will be purged
        recentSessionCount: 20,
    },
    {
        name: "Frank (12-month retention)",
        email: `frank${DEMO_DOMAIN}`,
        policy: "MONTHS_12",
        oldSessionCount: 200,
        recentSessionCount: 30,
    },
    {
        name: "Grace (keep forever)",
        email: `grace${DEMO_DOMAIN}`,
        policy: "UNTIL_DELETED",
        oldSessionCount: 0, // control user – nothing to purge
        recentSessionCount: 20,
    },
];

const POLICY_MONTHS = { MONTHS_6: 6, MONTHS_12: 12, MONTHS_24: 24 };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function subtractMonths(date, months) {
    const d = new Date(date);
    d.setMonth(d.getMonth() - months);
    return d;
}

/** Hash a password to match the bcryptjs format used by the seed. */
async function hashPassword(plain) {
    // Use a simple sha-256 hash for demo-only accounts (never used for login).
    return createHash("sha256").update(plain).digest("hex");
}

function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

/** Generate a ~2 KB Editor.js-style JSON payload to bulk up the DB. */
function buildContentJson(title, idx) {
    const paragraph = `Session ${idx} study notes for ${title}. `.repeat(20);
    return {
        time: Date.now(),
        blocks: [
            { type: "header", data: { text: `${title} – session ${idx}`, level: 2 } },
            { type: "paragraph", data: { text: paragraph } },
            { type: "paragraph", data: { text: paragraph } },
            { type: "list", data: { style: "unordered", items: ["Key concept A", "Key concept B", "Key concept C", "Key concept D"] } },
        ],
        version: "2.28.0",
    };
}

const TOPIC_TITLES = ["Academic Work", "Next.js", "Research", "Reflection", "Project"];

/** Build a session with a specific createdAt date. */
function buildSession(userId, createdAt) {
    const startHour = randomInt(8, 20);
    const durationMin = randomInt(30, 90);

    const startTime = new Date(createdAt);
    startTime.setHours(startHour, randomInt(0, 59), 0, 0);

    const endTime = new Date(startTime.getTime() + durationMin * 60_000);

    return {
        userId,
        startTime,
        endTime,
        pauseDuration: Math.random() < 0.3 ? 0 : 5 * 60_000,
        createdAt,
        updatedAt: createdAt,
    };
}

/**
 * Calls the real update-metrics-snapshot.mjs script via child_process
 * so the demo evidence uses the actual production snapshot script.
 */
function runSnapshotScript(purgedCount, label) {
    const cmd = `node --env-file=.env "${SNAPSHOT_SCRIPT}" --purged=${purgedCount} --label="${label}"`;
    console.log(`   ▶ ${cmd}`);
    const output = execSync(cmd, { cwd: resolve(__dirname, ".."), encoding: "utf-8" });
    console.log(output);
    return output;
}

/** Parse key metrics from the snapshot script's stdout. */
function parseSnapshotOutput(output) {
    const get = (label) => {
        const match = output.match(new RegExp(`${label}:\\s+(.+)`));
        return match ? match[1].trim() : "?";
    };
    return {
        id: get("ID"),
        sessionsCount: get("Sessions"),
        dbSizeMB: get("DB size").replace(" MB", ""),
        usersCount: get("Users"),
        consentEnabledCount: get("Consent enabled"),
        purgedCount: get("Purged sessions"),
    };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
    const now = new Date();

    // ── Step 0 · Cleanup previous demo runs ──────────────────────────────────
    console.log("\n🧹 Cleaning up previous ESG demo data…");
    const demoUsers = await db.user.findMany({
        where: { email: { endsWith: DEMO_DOMAIN } },
        select: { id: true, email: true },
    });
    for (const u of demoUsers) {
        await db.user.delete({ where: { id: u.id } });
    }
    // Also clean previous demo snapshots
    await db.metricsSnapshot.deleteMany({
        where: { metadata: { path: ["source"], equals: "esg-demo" } },
    });
    console.log(`   Removed ${demoUsers.length} previous demo user(s) & their snapshots.\n`);

    // ── Step 1 · Seed demo users & sessions ──────────────────────────────────
    console.log("🌱 Step 1/5 – Seeding ESG demo data…");

    const createdUsers = [];
    const BATCH_PAUSE = 25; // log progress + sleep every N sessions
    const DELAY_MS = 100;   // ms to pause between batches (Neon rate-limit friendly)

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    for (const cfg of DEMO_USERS) {
        const user = await db.user.create({
            data: {
                name: cfg.name,
                email: cfg.email,
                emailVerified: now,
                password: await hashPassword("demo1234"),
                journalingConsentEnabled: true,
                journalingConsentAt: now,
                journalingConsentVersion: "privacy-notice-v1",
                journalingConsentSource: "esg-demo",
                dataRetentionPolicy: cfg.policy,
                dataRetentionSetAt: now,
            },
        });

        const sessions = [];

        // Old sessions – backdated past the retention cutoff
        if (cfg.policy !== "UNTIL_DELETED") {
            const months = POLICY_MONTHS[cfg.policy];
            const cutoff = subtractMonths(now, months);
            for (let i = 0; i < cfg.oldSessionCount; i++) {
                const age = subtractMonths(cutoff, randomInt(1, 6));
                sessions.push(buildSession(user.id, age));
            }
        }

        // Recent sessions – within the last 30 days (always safe)
        for (let i = 0; i < cfg.recentSessionCount; i++) {
            const daysAgo = randomInt(1, 30);
            const recent = new Date(now);
            recent.setDate(recent.getDate() - daysAgo);
            sessions.push(buildSession(user.id, recent));
        }

        // Insert sessions with 2 Topics each (bulky contentJson for DB weight)
        const total = sessions.length;
        const startMs = Date.now();

        for (let idx = 0; idx < total; idx++) {
            const s = sessions[idx];
            const session = await db.studySession.create({ data: s });

            // Attach 2 topics per session with ~2 KB contentJson each
            const t1 = TOPIC_TITLES[idx % TOPIC_TITLES.length];
            const t2 = TOPIC_TITLES[(idx + 1) % TOPIC_TITLES.length];
            const halfDuration = Math.floor((s.endTime - s.startTime) / 2);
            await db.topic.createMany({
                data: [
                    { sessionId: session.id, title: t1, description: `${t1} session`, timeOfStudy: halfDuration, contentJson: buildContentJson(t1, idx) },
                    { sessionId: session.id, title: t2, description: `${t2} session`, timeOfStudy: halfDuration, contentJson: buildContentJson(t2, idx) },
                ],
            });

            // Progress log + small delay every BATCH_PAUSE sessions
            if ((idx + 1) % BATCH_PAUSE === 0 || idx + 1 === total) {
                const pct = Math.round(((idx + 1) / total) * 100);
                const elapsed = ((Date.now() - startMs) / 1000).toFixed(1);
                process.stdout.write(`\r   [${cfg.email}] ${idx + 1}/${total} sessions (${pct}%) – ${elapsed}s`);
                if (idx + 1 < total) await sleep(DELAY_MS);
            }
        }
        console.log("  ✓");

        const totalSessions = cfg.oldSessionCount + cfg.recentSessionCount;
        console.log(
            `   Created ${cfg.email.padEnd(28)} (${cfg.policy.padEnd(13)}) — ${totalSessions} sessions (${cfg.oldSessionCount} old, ${cfg.recentSessionCount} recent)`,
        );

        createdUsers.push({ ...cfg, userId: user.id });
    }

    // ── Step 2 · BEFORE snapshot (calls the real snapshot script) ─────────
    console.log("\n📸 Step 2/5 – BEFORE snapshot (running update-metrics-snapshot.mjs)…");
    // Disconnect Prisma before spawning the snapshot script to avoid connection conflicts
    await db.$disconnect();
    const beforeOutput = runSnapshotScript(0, "BEFORE retention purge");
    const before = parseSnapshotOutput(beforeOutput);
    // Reconnect for purge step
    await db.$connect();

    // ── Step 3 · Retention purge (inline) ────────────────────────────────────
    console.log("\n🗑️  Step 3/5 – Running retention purge…");
    let totalPurged = 0;

    for (const cfg of createdUsers) {
        const months = POLICY_MONTHS[cfg.policy];
        if (!months) {
            console.log(`   ${cfg.email} – policy ${cfg.policy}, 0 deleted`);
            continue;
        }

        const cutoff = subtractMonths(now, months);
        const oldSessions = await db.studySession.findMany({
            where: { userId: cfg.userId, createdAt: { lt: cutoff } },
            select: { id: true },
        });

        if (oldSessions.length > 0) {
            // Cascade: Topics and Feelings are removed automatically
            await db.studySession.deleteMany({
                where: { id: { in: oldSessions.map((s) => s.id) } },
            });
        }

        totalPurged += oldSessions.length;
        console.log(
            `   Deleted ${oldSessions.length} session(s) for ${cfg.email} (cutoff: ${cutoff.toISOString().slice(0, 10)})`,
        );
    }

    // VACUUM FULL so PostgreSQL physically releases the disk space,
    // making the size difference visible in the AFTER snapshot.
    // Note: VACUUM FULL requires superuser — may fail on Neon serverless.
    console.log("   Running VACUUM FULL to reclaim disk space…");
    try {
        await db.$executeRawUnsafe("VACUUM FULL");
        console.log("   VACUUM FULL completed.");
    } catch {
        console.log("   ⚠ VACUUM FULL not available (Neon serverless) — size reduction may be less visible, but deletions are recorded.");
    }
    // ── Step 4 · AFTER snapshot (calls the real snapshot script) ──────────
    console.log("\n📸 Step 4/5 – AFTER snapshot (running update-metrics-snapshot.mjs)…");
    await db.$disconnect();
    const afterOutput = runSnapshotScript(totalPurged, "AFTER retention purge");
    const after = parseSnapshotOutput(afterOutput);

    // ── Step 5 · Evidence summary ────────────────────────────────────────────
    console.log("\n📊 Step 5/5 – Evidence Summary");
    console.log("┌─────────────────────────────────┬──────────┬──────────┐");
    console.log("│ Metric                          │ BEFORE   │ AFTER    │");
    console.log("├─────────────────────────────────┼──────────┼──────────┤");
    console.log(
        `│ Total sessions                  │ ${String(before.sessionsCount).padStart(8)} │ ${String(after.sessionsCount).padStart(8)} │`,
    );
    console.log(
        `│ Purged sessions (this run)      │ ${String(before.purgedCount).padStart(8)} │ ${String(after.purgedCount).padStart(8)} │`,
    );
    console.log(
        `│ DB size (MB)                    │ ${String(before.dbSizeMB).padStart(8)} │ ${String(after.dbSizeMB).padStart(8)} │`,
    );
    console.log(
        `│ Users count                     │ ${String(before.usersCount).padStart(8)} │ ${String(after.usersCount).padStart(8)} │`,
    );
    console.log(
        `│ Consent-enabled count           │ ${String(before.consentEnabledCount).padStart(8)} │ ${String(after.consentEnabledCount).padStart(8)} │`,
    );
    console.log("└─────────────────────────────────┴──────────┴──────────┘");
    console.log(
        "\n✅ Done – both snapshots are stored in the MetricsSnapshot table.",
    );
    console.log(
        "   Open Prisma Studio (npm run db:studio) to inspect the evidence.\n",
    );
}

main()
    .catch((err) => {
        console.error("❌ ESG demo failed:", err);
        process.exit(1);
    })
    .finally(() => db.$disconnect());
