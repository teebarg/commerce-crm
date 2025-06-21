-- CreateEnum
CREATE TYPE "notification_statuses" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED');

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "status" "notification_statuses" NOT NULL DEFAULT 'DRAFT';
