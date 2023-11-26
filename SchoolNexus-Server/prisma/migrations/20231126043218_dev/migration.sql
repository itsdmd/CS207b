-- AlterTable
ALTER TABLE "SchoolPrincipalAssignment" ALTER COLUMN "endDate" SET DEFAULT NOW() + INTERVAL '5 year';
