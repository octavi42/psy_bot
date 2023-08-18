/*
  Warnings:

  - You are about to drop the column `chatId` on the `Objects` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Objects` table. All the data in the column will be lost.
  - Added the required column `title` to the `Objects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Objects` DROP FOREIGN KEY `Objects_chatId_fkey`;

-- AlterTable
ALTER TABLE `Objects` DROP COLUMN `chatId`,
    DROP COLUMN `name`,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    ADD COLUMN `transcription` VARCHAR(191) NULL;
