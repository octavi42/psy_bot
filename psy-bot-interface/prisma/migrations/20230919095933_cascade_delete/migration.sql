-- DropForeignKey
ALTER TABLE `Transcriptions` DROP FOREIGN KEY `Transcriptions_objectId_fkey`;

-- AddForeignKey
ALTER TABLE `Transcriptions` ADD CONSTRAINT `Transcriptions_objectId_fkey` FOREIGN KEY (`objectId`) REFERENCES `Objects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
