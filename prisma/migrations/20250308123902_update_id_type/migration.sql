/*
  Warnings:

  - The primary key for the `drafts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `drafts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `notification_templates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `notification_templates` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `push_subscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `push_subscriptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `sessions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `tenants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `tenants` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `tweets` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `tweets` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "drafts" DROP CONSTRAINT "drafts_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "drafts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notification_templates" DROP CONSTRAINT "notification_templates_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "notification_templates_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "push_subscriptions" DROP CONSTRAINT "push_subscriptions_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tenants" DROP CONSTRAINT "tenants_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "tenants_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "tweets" DROP CONSTRAINT "tweets_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "tweets_pkey" PRIMARY KEY ("id");
