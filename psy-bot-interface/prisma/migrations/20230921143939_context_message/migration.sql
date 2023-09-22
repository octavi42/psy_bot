/*
  Warnings:

  - You are about to drop the column `text` on the `Messages` table. All the data in the column will be lost.
  - Added the required column `content` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Messages` DROP COLUMN `text`,
    ADD COLUMN `content` TEXT NOT NULL;
