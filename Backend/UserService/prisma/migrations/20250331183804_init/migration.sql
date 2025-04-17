/*
  Warnings:

  - You are about to drop the column `checker` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `contestId` on the `Question` table. All the data in the column will be lost.
  - Changed the type of `duration` on the `Contest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_contestId_fkey";

-- AlterTable
ALTER TABLE "Contest" DROP COLUMN "duration",
ADD COLUMN     "duration" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "checker",
DROP COLUMN "contestId";

-- CreateTable
CREATE TABLE "ContestQuestion" (
    "contestId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "ContestQuestion_pkey" PRIMARY KEY ("contestId","questionId")
);

-- AddForeignKey
ALTER TABLE "ContestQuestion" ADD CONSTRAINT "ContestQuestion_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestQuestion" ADD CONSTRAINT "ContestQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
