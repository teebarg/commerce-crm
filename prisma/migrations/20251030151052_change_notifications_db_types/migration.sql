-- DropForeignKey
ALTER TABLE "public"."notification_events" DROP CONSTRAINT "notification_events_subscriber_id_fkey";

-- AlterTable
ALTER TABLE "public"."notification_events" ALTER COLUMN "subscriber_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."notification_events" ADD CONSTRAINT "notification_events_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "public"."push_subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
