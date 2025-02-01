/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "AiSearcher" DROP CONSTRAINT "AiSearcher_aiId_fkey";

-- DropForeignKey
ALTER TABLE "Codat" DROP CONSTRAINT "Codat_codatId_fkey";

-- DropForeignKey
ALTER TABLE "Collections" DROP CONSTRAINT "Collections_collectionOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "Teams" DROP CONSTRAINT "Teams_teamOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "_CodatSaved" DROP CONSTRAINT "_CodatSaved_B_fkey";

-- DropForeignKey
ALTER TABLE "_TeamMembers" DROP CONSTRAINT "_TeamMembers_B_fkey";

-- DropForeignKey
ALTER TABLE "_TeamModerators" DROP CONSTRAINT "_TeamModerators_B_fkey";

-- DropIndex
DROP INDEX "User_userId_idx";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "userId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- AddForeignKey
ALTER TABLE "Codat" ADD CONSTRAINT "Codat_codatId_fkey" FOREIGN KEY ("codatId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teams" ADD CONSTRAINT "Teams_teamOwnerId_fkey" FOREIGN KEY ("teamOwnerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collections" ADD CONSTRAINT "Collections_collectionOwnerId_fkey" FOREIGN KEY ("collectionOwnerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiSearcher" ADD CONSTRAINT "AiSearcher_aiId_fkey" FOREIGN KEY ("aiId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CodatSaved" ADD CONSTRAINT "_CodatSaved_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamMembers" ADD CONSTRAINT "_TeamMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamModerators" ADD CONSTRAINT "_TeamModerators_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
