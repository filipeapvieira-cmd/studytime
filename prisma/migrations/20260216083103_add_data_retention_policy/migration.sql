-- CreateEnum
CREATE TYPE "DataRetentionPolicy" AS ENUM ('MONTHS_6', 'MONTHS_12', 'MONTHS_24', 'UNTIL_DELETED');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "dataRetentionPolicy" "DataRetentionPolicy" NOT NULL DEFAULT 'UNTIL_DELETED',
ADD COLUMN     "dataRetentionSetAt" TIMESTAMP(3);
