-- CreateTable
CREATE TABLE "metrics_snapshots" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "db_size_bytes" BIGINT NOT NULL,
    "users_count" INTEGER NOT NULL,
    "sessions_count" INTEGER NOT NULL,
    "consent_enabled_count" INTEGER NOT NULL,
    "retention_purged_sessions_count" INTEGER NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "metrics_snapshots_pkey" PRIMARY KEY ("id")
);
