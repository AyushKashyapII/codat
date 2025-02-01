/*
  Warnings:

  - The `textToPassToAI` column on the `AiSearcher` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[attachedUserId]` on the table `AiSearcher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `attachedUserId` to the `AiSearcher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Codat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AiSearcher" DROP CONSTRAINT "AiSearcher_aiId_fkey";

-- DropForeignKey
ALTER TABLE "Codat" DROP CONSTRAINT "Codat_codatId_fkey";

-- AlterTable
ALTER TABLE "AiSearcher" ADD COLUMN     "attachedUserId" TEXT NOT NULL,
DROP COLUMN "textToPassToAI",
ADD COLUMN     "textToPassToAI" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "Codat" ADD COLUMN     "authorId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AiSearcher_attachedUserId_key" ON "AiSearcher"("attachedUserId");

-- AddForeignKey
ALTER TABLE "Codat" ADD CONSTRAINT "Codat_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiSearcher" ADD CONSTRAINT "AiSearcher_attachedUserId_fkey" FOREIGN KEY ("attachedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
