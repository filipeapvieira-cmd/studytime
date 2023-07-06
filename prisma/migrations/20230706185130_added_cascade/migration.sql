-- DropForeignKey
ALTER TABLE "contents" DROP CONSTRAINT "contents_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "feelings" DROP CONSTRAINT "feelings_sessionId_fkey";

-- AddForeignKey
ALTER TABLE "contents" ADD CONSTRAINT "contents_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feelings" ADD CONSTRAINT "feelings_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
