-- AlterTable
ALTER TABLE "LoginSession" ALTER COLUMN "expiresAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Quarter" ALTER COLUMN "id" SET DEFAULT to_char(now(), 'YYYY') || '-' || to_char(now(), 'Q');

-- AlterTable
ALTER TABLE "SchoolPrincipalAssignment" ALTER COLUMN "endDate" SET DEFAULT NOW() + INTERVAL '5 year';
