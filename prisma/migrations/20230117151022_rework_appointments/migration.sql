/*
  Warnings:

  - You are about to drop the column `end` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `date` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "end",
DROP COLUMN "start",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Times" (
    "id" TEXT NOT NULL,
    "start" TIMESTAMP(3),
    "end" TIMESTAMP(3),
    "appointmentId" TEXT NOT NULL,

    CONSTRAINT "Times_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Times" ADD CONSTRAINT "Times_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
