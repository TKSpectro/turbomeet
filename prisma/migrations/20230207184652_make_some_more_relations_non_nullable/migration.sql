/*
  Warnings:

  - Made the column `ownerId` on table `Meeting` required. This step will fail if there are existing NULL values in that column.
  - Made the column `meetingId` on table `Vote` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_meetingId_fkey";

-- AlterTable
ALTER TABLE "Meeting" ALTER COLUMN "ownerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Vote" ALTER COLUMN "meetingId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
