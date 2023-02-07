/*
  Warnings:

  - Made the column `meetingId` on table `Appointment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `appointmentId` on table `Vote` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_meetingId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_appointmentId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "meetingId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Vote" ALTER COLUMN "appointmentId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
