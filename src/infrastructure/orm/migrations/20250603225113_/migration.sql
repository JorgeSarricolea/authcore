/*
  Warnings:

  - A unique constraint covering the columns `[email_verification_code]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `email_verification_code` VARCHAR(191) NULL,
    ADD COLUMN `email_verification_expires` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_verification_code_key` ON `User`(`email_verification_code`);
