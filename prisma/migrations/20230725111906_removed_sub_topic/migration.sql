/*
  Warnings:

  - You are about to drop the column `subtopic` on the `contents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "contents" DROP COLUMN "subtopic",
ADD COLUMN     "hashtags" TEXT;
