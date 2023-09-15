/*
  Warnings:

  - You are about to drop the column `statusMessage` on the `SavingProcess` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `SavingProcess` DROP COLUMN `statusMessage`,
    ADD COLUMN `message` TEXT NULL;
