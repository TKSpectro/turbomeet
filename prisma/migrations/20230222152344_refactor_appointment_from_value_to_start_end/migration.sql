/*
  Warnings:

  - You are about to drop the column `value` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `start` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "value",
ADD COLUMN     "end" TIMESTAMP(3),
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL;
