/*
  Warnings:

  - You are about to drop the column `token` on the `LoginSession` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "LoginSession_token_key";

-- AlterTable
ALTER TABLE "LoginSession" DROP COLUMN "token";

-- AlterTable
ALTER TABLE "Quarter" ALTER COLUMN "id" SET DEFAULT to_char(now(), 'YYYY') || '-' || to_char(now(), 'Q');

-- AlterTable
ALTER TABLE "SchoolPrincipalAssignment" ALTER COLUMN "endDate" SET DEFAULT NOW() + INTERVAL '5 year';
