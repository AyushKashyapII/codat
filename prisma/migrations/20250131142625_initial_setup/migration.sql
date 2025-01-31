/*
  Warnings:

  - Added the required column `updatedAt` to the `Codat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Teams` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AiSearcher" DROP CONSTRAINT "AiSearcher_aiId_fkey";

-- DropForeignKey
ALTER TABLE "Codat" DROP CONSTRAINT "Codat_codatId_fkey";

-- DropForeignKey
ALTER TABLE "Teams" DROP CONSTRAINT "Teams_teamOwnerId_fkey";

-- AlterTable
ALTER TABLE "Codat" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Teams" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Collections" (
    "collectionId" TEXT NOT NULL,
    "collectionName" TEXT NOT NULL,
    "collectionDesc" TEXT NOT NULL,
    "collectionOwnerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Collections_pkey" PRIMARY KEY ("collectionId")
);

-- CreateTable
CREATE TABLE "_CollectionCodats" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CollectionCodats_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Collections_collectionId_idx" ON "Collections"("collectionId");

-- CreateIndex
CREATE INDEX "Collections_collectionOwnerId_idx" ON "Collections"("collectionOwnerId");

-- CreateIndex
CREATE INDEX "_CollectionCodats_B_index" ON "_CollectionCodats"("B");

-- CreateIndex
CREATE INDEX "AiSearcher_aiId_idx" ON "AiSearcher"("aiId");

-- CreateIndex
CREATE INDEX "Codat_codatId_idx" ON "Codat"("codatId");

-- CreateIndex
CREATE INDEX "Codat_codatIsPublic_idx" ON "Codat"("codatIsPublic");

-- CreateIndex
CREATE INDEX "Teams_teamId_idx" ON "Teams"("teamId");

-- CreateIndex
CREATE INDEX "Teams_teamOwnerId_idx" ON "Teams"("teamOwnerId");

-- CreateIndex
CREATE INDEX "User_userId_idx" ON "User"("userId");

-- AddForeignKey
ALTER TABLE "Codat" ADD CONSTRAINT "Codat_codatId_fkey" FOREIGN KEY ("codatId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teams" ADD CONSTRAINT "Teams_teamOwnerId_fkey" FOREIGN KEY ("teamOwnerId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collections" ADD CONSTRAINT "Collections_collectionOwnerId_fkey" FOREIGN KEY ("collectionOwnerId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiSearcher" ADD CONSTRAINT "AiSearcher_aiId_fkey" FOREIGN KEY ("aiId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionCodats" ADD CONSTRAINT "_CollectionCodats_A_fkey" FOREIGN KEY ("A") REFERENCES "Codat"("codatId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionCodats" ADD CONSTRAINT "_CollectionCodats_B_fkey" FOREIGN KEY ("B") REFERENCES "Collections"("collectionId") ON DELETE CASCADE ON UPDATE CASCADE;
