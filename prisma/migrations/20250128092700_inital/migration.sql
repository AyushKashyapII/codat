/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `userId` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "name" SET DEFAULT 'Codat User',
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- CreateTable
CREATE TABLE "Codat" (
    "codatId" TEXT NOT NULL,
    "codatName" TEXT NOT NULL,
    "codatDescription" TEXT NOT NULL,
    "codatCode" TEXT NOT NULL,
    "codatLanguage" TEXT NOT NULL,
    "codatIsPublic" BOOLEAN NOT NULL DEFAULT true,
    "codatAIDesc" TEXT NOT NULL,
    "codatAIFunc" TEXT NOT NULL,

    CONSTRAINT "Codat_pkey" PRIMARY KEY ("codatId")
);

-- CreateTable
CREATE TABLE "Teams" (
    "teamId" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "teamOwnerId" TEXT NOT NULL,

    CONSTRAINT "Teams_pkey" PRIMARY KEY ("teamId")
);

-- CreateTable
CREATE TABLE "AiSearcher" (
    "aiId" TEXT NOT NULL,
    "textToPassToAI" TEXT NOT NULL,

    CONSTRAINT "AiSearcher_pkey" PRIMARY KEY ("aiId")
);

-- CreateTable
CREATE TABLE "_CodatSaved" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CodatSaved_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TeamCodats" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TeamCodats_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TeamMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TeamMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TeamModerators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TeamModerators_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CodatSaved_B_index" ON "_CodatSaved"("B");

-- CreateIndex
CREATE INDEX "_TeamCodats_B_index" ON "_TeamCodats"("B");

-- CreateIndex
CREATE INDEX "_TeamMembers_B_index" ON "_TeamMembers"("B");

-- CreateIndex
CREATE INDEX "_TeamModerators_B_index" ON "_TeamModerators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- AddForeignKey
ALTER TABLE "Codat" ADD CONSTRAINT "Codat_codatId_fkey" FOREIGN KEY ("codatId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teams" ADD CONSTRAINT "Teams_teamOwnerId_fkey" FOREIGN KEY ("teamOwnerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiSearcher" ADD CONSTRAINT "AiSearcher_aiId_fkey" FOREIGN KEY ("aiId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CodatSaved" ADD CONSTRAINT "_CodatSaved_A_fkey" FOREIGN KEY ("A") REFERENCES "Codat"("codatId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CodatSaved" ADD CONSTRAINT "_CodatSaved_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamCodats" ADD CONSTRAINT "_TeamCodats_A_fkey" FOREIGN KEY ("A") REFERENCES "Codat"("codatId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamCodats" ADD CONSTRAINT "_TeamCodats_B_fkey" FOREIGN KEY ("B") REFERENCES "Teams"("teamId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamMembers" ADD CONSTRAINT "_TeamMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Teams"("teamId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamMembers" ADD CONSTRAINT "_TeamMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamModerators" ADD CONSTRAINT "_TeamModerators_A_fkey" FOREIGN KEY ("A") REFERENCES "Teams"("teamId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamModerators" ADD CONSTRAINT "_TeamModerators_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
