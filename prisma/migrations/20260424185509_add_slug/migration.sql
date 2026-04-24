/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `slug` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `verification` MODIFY `value` TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_slug_key` ON `user`(`slug`);
