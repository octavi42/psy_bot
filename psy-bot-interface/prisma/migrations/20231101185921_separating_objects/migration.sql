/*
  Warnings:

  - You are about to drop the column `about_object_id` on the `Object` table. All the data in the column will be lost.
  - You are about to drop the column `audio_object_id` on the `Object` table. All the data in the column will be lost.
  - You are about to drop the column `database_object_id` on the `Object` table. All the data in the column will be lost.
  - You are about to drop the column `file_object_id` on the `Object` table. All the data in the column will be lost.
  - You are about to drop the column `qa_object_id` on the `Object` table. All the data in the column will be lost.
  - You are about to drop the column `youtube_object_id` on the `Object` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[specific_object_id]` on the table `Object` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `specific_object_id` to the `Object` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Object` DROP FOREIGN KEY `Object_about_object_id_fkey`;

-- DropForeignKey
ALTER TABLE `Object` DROP FOREIGN KEY `Object_audio_object_id_fkey`;

-- DropForeignKey
ALTER TABLE `Object` DROP FOREIGN KEY `Object_database_object_id_fkey`;

-- DropForeignKey
ALTER TABLE `Object` DROP FOREIGN KEY `Object_file_object_id_fkey`;

-- DropForeignKey
ALTER TABLE `Object` DROP FOREIGN KEY `Object_qa_object_id_fkey`;

-- DropForeignKey
ALTER TABLE `Object` DROP FOREIGN KEY `Object_youtube_object_id_fkey`;

-- AlterTable
ALTER TABLE `Object` DROP COLUMN `about_object_id`,
    DROP COLUMN `audio_object_id`,
    DROP COLUMN `database_object_id`,
    DROP COLUMN `file_object_id`,
    DROP COLUMN `qa_object_id`,
    DROP COLUMN `youtube_object_id`,
    ADD COLUMN `specific_object_id` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Specific_Object` (
    `id` VARCHAR(191) NOT NULL,
    `youtube_object_id` VARCHAR(191) NULL,
    `qa_object_id` VARCHAR(191) NULL,
    `file_object_id` VARCHAR(191) NULL,
    `audio_object_id` VARCHAR(191) NULL,
    `database_object_id` VARCHAR(191) NULL,
    `about_object_id` VARCHAR(191) NULL,

    UNIQUE INDEX `Specific_Object_youtube_object_id_key`(`youtube_object_id`),
    UNIQUE INDEX `Specific_Object_qa_object_id_key`(`qa_object_id`),
    UNIQUE INDEX `Specific_Object_file_object_id_key`(`file_object_id`),
    UNIQUE INDEX `Specific_Object_audio_object_id_key`(`audio_object_id`),
    UNIQUE INDEX `Specific_Object_database_object_id_key`(`database_object_id`),
    UNIQUE INDEX `Specific_Object_about_object_id_key`(`about_object_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Object_specific_object_id_key` ON `Object`(`specific_object_id`);

-- AddForeignKey
ALTER TABLE `Object` ADD CONSTRAINT `Object_specific_object_id_fkey` FOREIGN KEY (`specific_object_id`) REFERENCES `Specific_Object`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Specific_Object` ADD CONSTRAINT `Specific_Object_youtube_object_id_fkey` FOREIGN KEY (`youtube_object_id`) REFERENCES `Youtube_Object`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Specific_Object` ADD CONSTRAINT `Specific_Object_qa_object_id_fkey` FOREIGN KEY (`qa_object_id`) REFERENCES `QA_Object`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Specific_Object` ADD CONSTRAINT `Specific_Object_file_object_id_fkey` FOREIGN KEY (`file_object_id`) REFERENCES `File_Object`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Specific_Object` ADD CONSTRAINT `Specific_Object_audio_object_id_fkey` FOREIGN KEY (`audio_object_id`) REFERENCES `Audio_Object`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Specific_Object` ADD CONSTRAINT `Specific_Object_database_object_id_fkey` FOREIGN KEY (`database_object_id`) REFERENCES `Database_Object`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Specific_Object` ADD CONSTRAINT `Specific_Object_about_object_id_fkey` FOREIGN KEY (`about_object_id`) REFERENCES `About_Object`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
