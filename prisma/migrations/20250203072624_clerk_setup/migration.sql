/*
  Warnings:

  - You are about to drop the column `attachedUserId` on the `AiSearcher` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Authenticator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[attachedProfileId]` on the table `AiSearcher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `attachedProfileId` to the `AiSearcher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "AiSearcher" DROP CONSTRAINT "AiSearcher_attachedUserId_fkey";

-- DropForeignKey
ALTER TABLE "Authenticator" DROP CONSTRAINT "Authenticator_userId_fkey";

-- DropForeignKey
ALTER TABLE "Codat" DROP CONSTRAINT "Codat_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Collections" DROP CONSTRAINT "Collections_collectionOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "Teams" DROP CONSTRAINT "Teams_teamOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "_CodatSaved" DROP CONSTRAINT "_CodatSaved_B_fkey";

-- DropForeignKey
ALTER TABLE "_TeamMembers" DROP CONSTRAINT "_TeamMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamMembers" DROP CONSTRAINT "_TeamMembers_B_fkey";

-- DropForeignKey
ALTER TABLE "_TeamModerators" DROP CONSTRAINT "_TeamModerators_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamModerators" DROP CONSTRAINT "_TeamModerators_B_fkey";

-- DropIndex
DROP INDEX "AiSearcher_attachedUserId_key";

-- AlterTable
ALTER TABLE "AiSearcher" DROP COLUMN "attachedUserId",
ADD COLUMN     "attachedProfileId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Authenticator";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "name" TEXT DEFAULT 'Codat Profile',
    "password" TEXT,
    "image" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_phoneNumber_key" ON "Profile"("phoneNumber");

-- CreateIndex
CREATE INDEX "Profile_id_idx" ON "Profile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AiSearcher_attachedProfileId_key" ON "AiSearcher"("attachedProfileId");

-- AddForeignKey
ALTER TABLE "Codat" ADD CONSTRAINT "Codat_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teams" ADD CONSTRAINT "Teams_teamOwnerId_fkey" FOREIGN KEY ("teamOwnerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collections" ADD CONSTRAINT "Collections_collectionOwnerId_fkey" FOREIGN KEY ("collectionOwnerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiSearcher" ADD CONSTRAINT "AiSearcher_attachedProfileId_fkey" FOREIGN KEY ("attachedProfileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CodatSaved" ADD CONSTRAINT "_CodatSaved_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamMembers" ADD CONSTRAINT "_TeamMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamMembers" ADD CONSTRAINT "_TeamMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "Teams"("teamId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamModerators" ADD CONSTRAINT "_TeamModerators_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamModerators" ADD CONSTRAINT "_TeamModerators_B_fkey" FOREIGN KEY ("B") REFERENCES "Teams"("teamId") ON DELETE CASCADE ON UPDATE CASCADE;
