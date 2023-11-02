/*
  Warnings:

  - Added the required column `saved_status` to the `Object` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Object` ADD COLUMN `saved` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `saved_status` TEXT NOT NULL;
