/*
  Warnings:

  - You are about to drop the column `transcription` on the `Objects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Objects` DROP COLUMN `transcription`;

-- CreateTable
CREATE TABLE `Transcriptions` (
    `id` VARCHAR(191) NOT NULL,
    `objectId` VARCHAR(191) NOT NULL,
    `data` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Transcriptions` ADD CONSTRAINT `Transcriptions_objectId_fkey` FOREIGN KEY (`objectId`) REFERENCES `Objects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
