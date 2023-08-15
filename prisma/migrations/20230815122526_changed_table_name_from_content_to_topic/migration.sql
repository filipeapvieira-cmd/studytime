/*
  Warnings:

  - You are about to drop the column `contentDescription` on the `contents` table. All the data in the column will be lost.
  - You are about to drop the column `topic` on the `contents` table. All the data in the column will be lost.
  - You are about to drop the column `feelingDescription` on the `feelings` table. All the data in the column will be lost.
  - Added the required column `description` to the `contents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `contents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `feelings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contents" DROP COLUMN "contentDescription",
DROP COLUMN "topic",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "feelings" DROP COLUMN "feelingDescription",
ADD COLUMN     "description" TEXT NOT NULL;