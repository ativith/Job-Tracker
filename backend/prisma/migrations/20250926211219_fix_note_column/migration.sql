/*
  Warnings:

  - You are about to drop the column `Note` on the `Jobs` table. All the data in the column will be lost.
  - Added the required column `note` to the `Jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Jobs" DROP COLUMN "Note",
ADD COLUMN     "note" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "note" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Events" ADD CONSTRAINT "Events_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
