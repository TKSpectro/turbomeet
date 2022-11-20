/*
  Warnings:

  - A unique constraint covering the columns `[adminToken]` on the table `Meeting` will be added. If there are existing duplicate values, this will fail.
  - The required column `adminToken` was added to the `Meeting` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "adminToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_adminToken_key" ON "Meeting"("adminToken");
