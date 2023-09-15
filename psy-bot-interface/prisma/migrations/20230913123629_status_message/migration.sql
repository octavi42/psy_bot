/*
  Warnings:

  - You are about to drop the column `message` on the `SavingProcess` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `SavingProcess` DROP COLUMN `message`,
    ADD COLUMN `statusMessage` TEXT NULL;
