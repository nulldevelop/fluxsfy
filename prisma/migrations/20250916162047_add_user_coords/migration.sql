/*
  Warnings:

  - You are about to drop the column `latitute` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "latitute",
ADD COLUMN     "latitude" DOUBLE PRECISION;
