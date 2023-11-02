/*
  Warnings:

  - You are about to drop the column `objectId` on the `Transcriptions` table. All the data in the column will be lost.
  - You are about to drop the `Objects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Objects` DROP FOREIGN KEY `Objects_createdByUserId_fkey`;

-- DropForeignKey
ALTER TABLE `Transcriptions` DROP FOREIGN KEY `Transcriptions_objectId_fkey`;

-- AlterTable
ALTER TABLE `Transcriptions` DROP COLUMN `objectId`,
    ADD COLUMN `about_ObjectId` VARCHAR(191) NULL,
    ADD COLUMN `audio_ObjectId` VARCHAR(191) NULL,
    ADD COLUMN `database_ObjectId` VARCHAR(191) NULL,
    ADD COLUMN `file_ObjectId` VARCHAR(191) NULL,
    ADD COLUMN `youtube_ObjectId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Objects`;

-- CreateTable
CREATE TABLE `Object` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `type` VARCHAR(191) NOT NULL,
    `createdByUserId` VARCHAR(191) NOT NULL,
    `object_type` ENUM('Youtube', 'QA', 'File', 'Audio', 'Database', 'About') NOT NULL,
    `youtube_object_id` VARCHAR(191) NULL,
    `qa_object_id` VARCHAR(191) NULL,
    `file_object_id` VARCHAR(191) NULL,
    `audio_object_id` VARCHAR(191) NULL,
    `database_object_id` VARCHAR(191) NULL,
    `about_object_id` VARCHAR(191) NULL,

    UNIQUE INDEX `Object_youtube_object_id_key`(`youtube_object_id`),
    UNIQUE INDEX `Object_qa_object_id_key`(`qa_object_id`),
    UNIQUE INDEX `Object_file_object_id_key`(`file_object_id`),
    UNIQUE INDEX `Object_audio_object_id_key`(`audio_object_id`),
    UNIQUE INDEX `Object_database_object_id_key`(`database_object_id`),
    UNIQUE INDEX `Object_about_object_id_key`(`about_object_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Youtube_Object` (
    `id` VARCHAR(191) NOT NULL,
    `youtube_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QA_Object` (
    `id` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `answer` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File_Object` (
    `id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Audio_Object` (
    `id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Database_Object` (
    `id` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `About_Object` (
    `id` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Object` ADD CONSTRAINT `Object_createdByUserId_fkey` FOREIGN KEY (`createdByUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Object` ADD CONSTRAINT `Object_youtube_object_id_fkey` FOREIGN KEY (`youtube_object_id`) REFERENCES `Youtube_Object`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Object` ADD CONSTRAINT `Object_qa_object_id_fkey` FOREIGN KEY (`qa_object_id`) REFERENCES `QA_Object`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Object` ADD CONSTRAINT `Object_file_object_id_fkey` FOREIGN KEY (`file_object_id`) REFERENCES `File_Object`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Object` ADD CONSTRAINT `Object_audio_object_id_fkey` FOREIGN KEY (`audio_object_id`) REFERENCES `Audio_Object`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Object` ADD CONSTRAINT `Object_database_object_id_fkey` FOREIGN KEY (`database_object_id`) REFERENCES `Database_Object`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Object` ADD CONSTRAINT `Object_about_object_id_fkey` FOREIGN KEY (`about_object_id`) REFERENCES `About_Object`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transcriptions` ADD CONSTRAINT `Transcriptions_youtube_ObjectId_fkey` FOREIGN KEY (`youtube_ObjectId`) REFERENCES `Youtube_Object`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transcriptions` ADD CONSTRAINT `Transcriptions_file_ObjectId_fkey` FOREIGN KEY (`file_ObjectId`) REFERENCES `File_Object`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transcriptions` ADD CONSTRAINT `Transcriptions_audio_ObjectId_fkey` FOREIGN KEY (`audio_ObjectId`) REFERENCES `Audio_Object`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transcriptions` ADD CONSTRAINT `Transcriptions_database_ObjectId_fkey` FOREIGN KEY (`database_ObjectId`) REFERENCES `Database_Object`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transcriptions` ADD CONSTRAINT `Transcriptions_about_ObjectId_fkey` FOREIGN KEY (`about_ObjectId`) REFERENCES `About_Object`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
