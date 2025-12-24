/*
  Warnings:

  - You are about to drop the column `stage` on the `startups` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "startups" DROP COLUMN "stage",
ADD COLUMN     "pitchDeckUrl" TEXT;
