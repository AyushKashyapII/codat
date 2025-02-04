/*
  Warnings:

  - You are about to alter the column `codatLanguage` on the `Codat` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- DropForeignKey
ALTER TABLE "Codat" DROP CONSTRAINT "Codat_codatId_fkey";

-- DropIndex
DROP INDEX "Codat_codatId_idx";

-- DropIndex
DROP INDEX "Codat_codatIsPublic_idx";

-- AlterTable
ALTER TABLE "Codat" ADD COLUMN     "collectionId" TEXT,
ALTER COLUMN "codatLanguage" SET DATA TYPE VARCHAR(50);

-- CreateIndex
CREATE INDEX "Codat_authorId_codatIsPublic_idx" ON "Codat"("authorId", "codatIsPublic");

-- CreateIndex
CREATE INDEX "Codat_collectionId_createdAt_idx" ON "Codat"("collectionId", "createdAt");

-- AddForeignKey
ALTER TABLE "Codat" ADD CONSTRAINT "Codat_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collections"("collectionId") ON DELETE SET NULL ON UPDATE CASCADE;
