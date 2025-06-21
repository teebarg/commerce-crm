/*
  Warnings:

  - You are about to drop the column `recipient_id` on the `notification_events` table. All the data in the column will be lost.
  - You are about to drop the `notification_recipients` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `notification_id` to the `notification_events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriber_id` to the `notification_events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "notification_events" DROP CONSTRAINT "notification_events_recipient_id_fkey";

-- DropForeignKey
ALTER TABLE "notification_recipients" DROP CONSTRAINT "notification_recipients_notification_id_fkey";

-- DropForeignKey
ALTER TABLE "notification_recipients" DROP CONSTRAINT "notification_recipients_subscriber_id_fkey";

-- DropIndex
DROP INDEX "notification_events_recipient_id_event_type_idx";

-- AlterTable
ALTER TABLE "notification_events" DROP COLUMN "recipient_id",
ADD COLUMN     "delivered_at" TIMESTAMP(3),
ADD COLUMN     "notification_id" TEXT NOT NULL,
ADD COLUMN     "read_at" TIMESTAMP(3),
ADD COLUMN     "subscriber_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "failed_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sent_count" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "notification_recipients";

-- CreateIndex
CREATE INDEX "notification_events_notification_id_subscriber_id_event_typ_idx" ON "notification_events"("notification_id", "subscriber_id", "event_type");

-- AddForeignKey
ALTER TABLE "notification_events" ADD CONSTRAINT "notification_events_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_events" ADD CONSTRAINT "notification_events_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "push_subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
