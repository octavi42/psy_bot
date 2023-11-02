/*
  Warnings:

  - You are about to drop the column `object_type` on the `Object` table. All the data in the column will be lost.
  - You are about to alter the column `type` on the `Object` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `Object` DROP COLUMN `object_type`,
    MODIFY `type` ENUM('Youtube', 'QA', 'File', 'Audio', 'Database', 'About') NOT NULL;
