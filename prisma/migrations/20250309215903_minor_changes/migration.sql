/*
  Warnings:

  - The `codatTags` column on the `Codat` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Codat" DROP COLUMN "codatTags",
ADD COLUMN     "codatTags" JSONB[];
