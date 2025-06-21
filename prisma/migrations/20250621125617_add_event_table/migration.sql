/*
  Warnings:

  - You are about to drop the column `createdAt` on the `NotificationTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `NotificationTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `deliveredAt` on the `notification_recipients` table. All the data in the column will be lost.
  - You are about to drop the column `notificationId` on the `notification_recipients` table. All the data in the column will be lost.
  - You are about to drop the column `readAt` on the `notification_recipients` table. All the data in the column will be lost.
  - You are about to drop the column `subscriberId` on the `notification_recipients` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `sentAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `templateId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `platform_posts` table. All the data in the column will be lost.
  - You are about to drop the column `errorMessage` on the `platform_posts` table. All the data in the column will be lost.
  - You are about to drop the column `platformId` on the `platform_posts` table. All the data in the column will be lost.
  - You are about to drop the column `platformPostId` on the `platform_posts` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `platform_posts` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `platform_posts` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledAt` on the `platform_posts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `platform_posts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `platforms` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `NotificationTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notification_id` to the `notification_recipients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriber_id` to the `notification_recipients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform_id` to the `platform_posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_id` to the `platform_posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `platform_posts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "notification_event_types" AS ENUM ('SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'DISMISSED', 'FAILED');

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_postId_fkey";

-- DropForeignKey
ALTER TABLE "notification_recipients" DROP CONSTRAINT "notification_recipients_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "notification_recipients" DROP CONSTRAINT "notification_recipients_subscriberId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_templateId_fkey";

-- DropForeignKey
ALTER TABLE "platform_posts" DROP CONSTRAINT "platform_posts_platformId_fkey";

-- DropForeignKey
ALTER TABLE "platform_posts" DROP CONSTRAINT "platform_posts_postId_fkey";

-- AlterTable
ALTER TABLE "NotificationTemplate" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "media" DROP COLUMN "createdAt",
DROP COLUMN "postId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "post_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "notification_recipients" DROP COLUMN "deliveredAt",
DROP COLUMN "notificationId",
DROP COLUMN "readAt",
DROP COLUMN "subscriberId",
ADD COLUMN     "delivered_at" TIMESTAMP(3),
ADD COLUMN     "notification_id" TEXT NOT NULL,
ADD COLUMN     "read_at" TIMESTAMP(3),
ADD COLUMN     "subscriber_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "scheduledAt",
DROP COLUMN "sentAt",
DROP COLUMN "templateId",
ADD COLUMN     "scheduled_at" TIMESTAMP(3),
ADD COLUMN     "sent_at" TIMESTAMP(3),
ADD COLUMN     "template_id" TEXT;

-- AlterTable
ALTER TABLE "platform_posts" DROP COLUMN "createdAt",
DROP COLUMN "errorMessage",
DROP COLUMN "platformId",
DROP COLUMN "platformPostId",
DROP COLUMN "postId",
DROP COLUMN "publishedAt",
DROP COLUMN "scheduledAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "error_message" TEXT,
ADD COLUMN     "platform_id" TEXT NOT NULL,
ADD COLUMN     "platform_post_id" TEXT,
ADD COLUMN     "post_id" TEXT NOT NULL,
ADD COLUMN     "published_at" TIMESTAMP(3),
ADD COLUMN     "scheduled_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "platforms" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "push_subscriptions" ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "notification_events" (
    "id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "event_type" "notification_event_types" NOT NULL,
    "device_type" "device_types",
    "platform" TEXT,
    "user_agent" TEXT,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notification_events_recipient_id_event_type_idx" ON "notification_events"("recipient_id", "event_type");

-- AddForeignKey
ALTER TABLE "platform_posts" ADD CONSTRAINT "platform_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_posts" ADD CONSTRAINT "platform_posts_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "platforms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "NotificationTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_recipients" ADD CONSTRAINT "notification_recipients_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_recipients" ADD CONSTRAINT "notification_recipients_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "push_subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_events" ADD CONSTRAINT "notification_events_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "notification_recipients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
