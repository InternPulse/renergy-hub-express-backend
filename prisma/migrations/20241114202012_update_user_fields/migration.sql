/*
  Warnings:

  - A unique constraint covering the columns `[username,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "confirmPassword" TEXT,
ALTER COLUMN "userType" DROP NOT NULL,
ALTER COLUMN "registerType" DROP NOT NULL,
ALTER COLUMN "registrationDate" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "phoneNumber" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_email_key" ON "User"("username", "email");
