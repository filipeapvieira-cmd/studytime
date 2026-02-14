-- AlterTable
ALTER TABLE "users" ADD COLUMN     "journalingConsentAt" TIMESTAMP(3),
ADD COLUMN     "journalingConsentEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "journalingConsentSource" TEXT,
ADD COLUMN     "journalingConsentVersion" TEXT;
