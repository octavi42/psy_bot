/*
  Warnings:

  - You are about to drop the column `type` on the `Object` table. All the data in the column will be lost.
  - Added the required column `type` to the `Specific_Object` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Object` DROP COLUMN `type`;

-- AlterTable
ALTER TABLE `Specific_Object` ADD COLUMN `type` ENUM('Youtube', 'QA', 'File', 'Audio', 'Database', 'About') NOT NULL;
