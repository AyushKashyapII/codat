/*
  Warnings:

  - You are about to drop the `_CollectionCodats` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_CollectionCodats" DROP CONSTRAINT "_CollectionCodats_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionCodats" DROP CONSTRAINT "_CollectionCodats_B_fkey";

-- DropTable
DROP TABLE "_CollectionCodats";

-- CreateTable
CREATE TABLE "_UserFollowed" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserFollowed_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserFollowed_B_index" ON "_UserFollowed"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_name_key" ON "Profile"("name");

-- AddForeignKey
ALTER TABLE "Codat" ADD CONSTRAINT "Codat_codatId_fkey" FOREIGN KEY ("codatId") REFERENCES "Collections"("collectionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollowed" ADD CONSTRAINT "_UserFollowed_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollowed" ADD CONSTRAINT "_UserFollowed_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
