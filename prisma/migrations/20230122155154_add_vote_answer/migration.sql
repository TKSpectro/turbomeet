/*
  Warnings:

  - Added the required column `answer` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Answer" AS ENUM ('YES', 'IFNECESSARY', 'NO');

-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "answer" "Answer" NOT NULL;
