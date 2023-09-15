-- CreateTable
CREATE TABLE `SavingProcess` (
    `id` VARCHAR(191) NOT NULL,
    `state` ENUM('saved', 'saving', 'unknown') NOT NULL DEFAULT 'unknown',
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SavingProcess_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SavingProcess` ADD CONSTRAINT `SavingProcess_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
