/*
  Warnings:

  - Added the required column `createdByUserId` to the `Objects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Objects` ADD COLUMN `createdByUserId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `role` ENUM('user', 'member', 'contributor', 'admin') NOT NULL DEFAULT 'user';

-- AddForeignKey
ALTER TABLE `Objects` ADD CONSTRAINT `Objects_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
