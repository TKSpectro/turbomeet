/*
  Warnings:

  - You are about to drop the column `date` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the `Times` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `value` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Times" DROP CONSTRAINT "Times_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_appointmentId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "date",
ADD COLUMN     "value" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "meetingId" TEXT,
ALTER COLUMN "appointmentId" DROP NOT NULL,
ALTER COLUMN "answer" SET DEFAULT 'YES';

-- DropTable
DROP TABLE "Times";

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE SET NULL ON UPDATE CASCADE;
