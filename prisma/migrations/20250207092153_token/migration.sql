/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_token_key" ON "Profile"("token");
