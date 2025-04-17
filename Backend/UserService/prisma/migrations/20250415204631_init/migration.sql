/*
  Warnings:

  - Added the required column `code` to the `SubmissionQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubmissionQuestion" ADD COLUMN     "code" TEXT NOT NULL;
