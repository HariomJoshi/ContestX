-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "constraints" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "public_test_cases" TEXT NOT NULL DEFAULT '';
