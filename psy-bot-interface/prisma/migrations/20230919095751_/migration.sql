/*
  Warnings:

  - You are about to drop the column `data` on the `Transcriptions` table. All the data in the column will be lost.
  - Added the required column `text` to the `Transcriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Transcriptions` DROP COLUMN `data`,
    ADD COLUMN `text` TEXT NOT NULL;
